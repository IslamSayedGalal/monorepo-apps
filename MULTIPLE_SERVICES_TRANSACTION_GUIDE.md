# Multiple Services in One Transaction - Rollback on Error

## Problem Scenario

When a controller calls multiple services, and you want **all operations to rollback if ANY error occurs**, you have several options.

## Solution 1: Orchestrator Service (✅ BEST PRACTICE)

Create a service that orchestrates multiple operations with `@Transactional()`.

### Example: Creating Playlist with Tags

```typescript
// Controller - Thin, no transaction
@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService, private readonly playlistOrchestratorService: PlaylistOrchestratorService) {}

  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    const userId = 3;
    // Call orchestrator - handles transaction internally
    return this.playlistOrchestratorService.createPlaylistWithTags(createPlaylistDto, userId);
  }
}

// Orchestrator Service - Handles transaction
@Injectable()
export class PlaylistOrchestratorService {
  constructor(private readonly playlistService: PlaylistService, private readonly tagsService: TagsService, private readonly notificationService: NotificationService) {}

  @Transactional() // ✅ Single transaction for all operations
  async createPlaylistWithTags(createPlaylistDto: CreatePlaylistDto, userId: number) {
    // All these operations are in ONE transaction
    // If ANY fails, ALL rollback

    // 1. Create playlist
    const playlist = await this.playlistService.create(createPlaylistDto, userId);

    // 2. Create tags
    const tags = await Promise.all(createPlaylistDto.tagIds.map((tagId) => this.tagsService.associateWithPlaylist(tagId, playlist.id)));

    // 3. Send notification
    await this.notificationService.notifyPlaylistCreated(playlist.id);

    // 4. Update analytics
    await this.analyticsService.trackPlaylistCreation(playlist.id);

    // If any of the above fails, ALL operations rollback!
    return { playlist, tags };
  }
}
```

**Benefits:**

- ✅ Clean separation of concerns
- ✅ Reusable orchestrator service
- ✅ Single transaction wraps all operations
- ✅ Automatic rollback on any error

---

## Solution 2: Transaction on Controller (⚠️ Acceptable for This Case)

If you really need to call multiple services from controller, you CAN use `@Transactional()` on the controller method.

### Example

```typescript
@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService, private readonly tagsService: TagsService, private readonly notificationService: NotificationService) {}

  @Post()
  @Transactional() // ⚠️ Transaction wraps all service calls
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    const userId = 3;

    // All these operations are in ONE transaction
    // If ANY fails, ALL rollback

    // 1. Create playlist
    const playlist = await this.playlistService.create(createPlaylistDto, userId);

    // 2. Create tags (if service has @Transactional, it joins existing transaction)
    const tags = await Promise.all(createPlaylistDto.tagIds.map((tagId) => this.tagsService.associateWithPlaylist(tagId, playlist.id)));

    // 3. Send notification
    await this.notificationService.notifyPlaylistCreated(playlist.id);

    // If any fails, ALL rollback!
    return { playlist, tags };
  }
}
```

**Important:** For this to work, the service methods should use `@Transactional()` with propagation options:

```typescript
@Injectable()
export class PlaylistService {
  // Join existing transaction if one exists
  @Transactional({ propagation: 'REQUIRED' }) // Default behavior
  async create(dto: CreatePlaylistDto, userId: number) {
    // This will join the transaction from controller
    return await this.repository.save(playlist);
  }
}
```

**When to Use:**

- ⚠️ Simple operations that need to be atomic
- ⚠️ Quick prototypes
- ⚠️ When orchestrator service would be overkill

**Drawbacks:**

- ❌ Transaction stays open during HTTP response
- ❌ Controller becomes responsible for transaction management
- ❌ Less reusable

---

## Solution 3: Manual QueryRunner (🔧 Advanced)

For maximum control, use `QueryRunner` manually.

### Example

```typescript
@Controller('/playlists')
export class PlaylistController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly playlistService: PlaylistService,
    private readonly tagsService: TagsService
  ) {}

  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userId = 3;

      // Pass transactional manager to services
      const playlist = await this.playlistService.createWithManager(
        createPlaylistDto,
        userId,
        queryRunner.manager
      );

      const tags = await Promise.all(
        createPlaylistDto.tagIds.map(tagId =>
          this.tagsService.associateWithManager(
            tagId,
            playlist.id,
            queryRunner.manager
          )
        )
      );

      // Commit if all succeed
      await queryRunner.commitTransaction();
      return { playlist, tags };
    } catch (error) {
      // Rollback on any error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Always release
      await queryRunner.release();
    }
  }
}

// Service methods accept EntityManager
@Injectable()
export class PlaylistService {
  async createWithManager(
    dto: CreatePlaylistDto,
    userId: number,
    manager: EntityManager
  ) {
    const playlist = Playlist.create({ ... });
    const entity = PlaylistMapper.toPersistence(playlist);
    return await manager.save(PlaylistOrmEntity, entity);
  }
}
```

**When to Use:**

- 🔧 Need fine-grained control
- 🔧 Complex transaction logic
- 🔧 Custom error handling

**Drawbacks:**

- ❌ More verbose
- ❌ Manual resource management
- ❌ More error-prone

---

## Transaction Propagation Options

With `typeorm-transactional`, you can control how transactions behave:

```typescript
@Transactional({ propagation: 'REQUIRED' })  // Default - join existing or create new
@Transactional({ propagation: 'REQUIRES_NEW' })  // Always create new transaction
@Transactional({ propagation: 'NESTED' })  // Create savepoint (nested transaction)
```

### Propagation: REQUIRED (Default)

```typescript
// Controller
@Transactional()
async create() {
  // Transaction 1 starts here
  await this.serviceA.method();  // Joins Transaction 1
  await this.serviceB.method();  // Joins Transaction 1
  // Transaction 1 commits here
}

// Service A
@Transactional({ propagation: 'REQUIRED' })  // Joins existing transaction
async method() {
  // Part of Transaction 1
}
```

### Propagation: REQUIRES_NEW

```typescript
// Controller
@Transactional()
async create() {
  // Transaction 1 starts
  await this.serviceA.method();  // Creates Transaction 2 (independent)
  // Transaction 2 commits
  await this.serviceB.method();  // Part of Transaction 1
  // Transaction 1 commits
}

// Service A
@Transactional({ propagation: 'REQUIRES_NEW' })  // New transaction
async method() {
  // Independent Transaction 2
  // Commits independently
}
```

---

## Real-World Example: Complete Implementation

### Step 1: Create Orchestrator Service

```typescript
// apps/admin-panel-api/src/playlist/playlist-orchestrator.service.ts
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { PlaylistService } from './playlist.service';
import { TagsService } from '../tags/tags.service';
import { CreatePlaylistDto } from '@my-workspace/playlists';

@Injectable()
export class PlaylistOrchestratorService {
  constructor(private readonly playlistService: PlaylistService, private readonly tagsService: TagsService) {}

  @Transactional() // ✅ All operations in one transaction
  async createPlaylistWithTags(createPlaylistDto: CreatePlaylistDto, userId: number) {
    try {
      // 1. Create playlist
      const playlist = await this.playlistService.create(createPlaylistDto, userId);

      // 2. Associate tags if provided
      if (createPlaylistDto.tagIds && createPlaylistDto.tagIds.length > 0) {
        await Promise.all(createPlaylistDto.tagIds.map((tagId) => this.tagsService.associateWithPlaylist(tagId, playlist.id)));
      }

      // 3. Any other operations...
      // If ANY step fails, ALL rollback automatically!

      return playlist;
    } catch (error) {
      // Transaction automatically rolls back
      // Just rethrow or handle as needed
      throw error;
    }
  }
}
```

### Step 2: Update Controller

```typescript
// apps/admin-panel-api/src/playlist/playlist.controller.ts
@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistOrchestratorService: PlaylistOrchestratorService) {}

  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    const userId = 3;
    return this.playlistOrchestratorService.createPlaylistWithTags(createPlaylistDto, userId);
  }
}
```

### Step 3: Update Module

```typescript
// apps/admin-panel-api/src/playlist/playlist.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([PlaylistOrmEntity, UserOrmEntity])],
  controllers: [PlaylistController],
  providers: [
    PlaylistService,
    PlaylistRepositoryImpl,
    PlaylistOrchestratorService, // Add orchestrator
  ],
  exports: [PlaylistService],
})
export class PlaylistModule {}
```

---

## Quick Answer: How to Make Multiple Service Calls Rollback Together?

### ✅ **Recommended: Orchestrator Service**

```typescript
// 1. Create orchestrator service
@Injectable()
export class PlaylistOrchestratorService {
  @Transactional() // ✅ Single transaction
  async createPlaylistWithTags(dto, userId) {
    const playlist = await this.playlistService.create(dto, userId);
    await this.tagsService.associate(playlist.id);
    // If ANY fails, ALL rollback!
    return playlist;
  }
}

// 2. Use in controller
@Controller('/playlists')
export class PlaylistController {
  @Post()
  create(@Body() dto) {
    return this.orchestrator.createPlaylistWithTags(dto, userId);
  }
}
```

### ⚠️ **Alternative: Controller Transaction**

```typescript
@Controller('/playlists')
export class PlaylistController {
  @Post()
  @Transactional() // ⚠️ Transaction wraps all calls
  async create(@Body() dto) {
    const playlist = await this.playlistService.create(dto, userId);
    await this.tagsService.associate(playlist.id);
    // If ANY fails, ALL rollback!
    return playlist;
  }
}
```

**Important:** Service methods with `@Transactional()` will **automatically join** the existing transaction from the controller.

---

## Summary: Which Solution to Use?

| Solution                   | When to Use                                      | Pros                           | Cons                        |
| -------------------------- | ------------------------------------------------ | ------------------------------ | --------------------------- |
| **Orchestrator Service**   | ✅ **Recommended** - Multiple related operations | Clean, reusable, best practice | Extra service file          |
| **Controller Transaction** | ⚠️ Simple cases, quick prototypes                | Simple, direct                 | Transaction during HTTP I/O |
| **Manual QueryRunner**     | 🔧 Complex scenarios, custom logic               | Full control                   | Verbose, error-prone        |

---

## Best Practice Recommendation

**Use Orchestrator Service** for multiple service calls:

1. ✅ Keeps controllers thin
2. ✅ Reusable business logic
3. ✅ Proper transaction boundaries
4. ✅ Easy to test
5. ✅ Follows SOLID principles

**Example Structure:**

```
Controller (HTTP concerns)
  ↓
Orchestrator Service (@Transactional - coordinates multiple services)
  ↓
Individual Services (@Transactional - single operations)
  ↓
Repositories (data access)
```
