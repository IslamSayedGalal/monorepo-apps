import axios from 'axios';
import { createTestUser, cleanupTestData } from '../support/test-helpers';
import { UserOrmEntity } from '@my-workspace/user';

describe('Playlists E2E', () => {
  let testUser: UserOrmEntity;
  const createdPlaylistIds: number[] = [];

  beforeAll(async () => {
    // Create a test user for playlist tests
    testUser = await createTestUser();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData({
      playlistIds: createdPlaylistIds,
      userIds: testUser.id ? [testUser.id] : [],
    });
  });

  describe('POST /playlists', () => {
    it('should create a playlist with name and description', async () => {
      const createDto = {
        name: 'Summer Vibes',
        description: 'My favorite summer songs',
      };

      const response = await axios.post('/playlists', createDto, {
        headers: { 'x-user-id': testUser.id.toString() },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(createDto.name);
      expect(response.data.description).toBe(createDto.description);
      expect(response.data.slug).toBeDefined();
      expect(response.data.code).toBeDefined();
      expect(response.data.code).toMatch(/^PL-/);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.id).toBe(testUser.id);

      if (response.data.id) {
        createdPlaylistIds.push(response.data.id);
      }
    });

    it('should auto-generate slug and code via database triggers', async () => {
      const createDto = {
        name: 'Winter Collection',
        description: 'Cold weather playlist',
      };

      const response = await axios.post('/playlists', createDto, {
        headers: { 'x-user-id': testUser.id.toString() },
      });

      expect(response.status).toBe(201);
      expect(response.data.slug).toBeDefined();
      expect(response.data.slug).toMatch(/^winter-collection/);
      expect(response.data.code).toBeDefined();
      expect(response.data.code).toMatch(/^PL-/);

      if (response.data.id) {
        createdPlaylistIds.push(response.data.id);
      }
    });

    it('should return created playlist with user relation', async () => {
      const createDto = {
        name: 'Test Playlist',
      };

      const response = await axios.post('/playlists', createDto, {
        headers: { 'x-user-id': testUser.id.toString() },
      });

      expect(response.status).toBe(201);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.id).toBe(testUser.id);
      expect(response.data.user.email).toBe(testUser.email);

      if (response.data.id) {
        createdPlaylistIds.push(response.data.id);
      }
    });

    it('should validate required fields (name)', async () => {
      try {
        await axios.post('/playlists', {});
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number; data: { message: string } } }).response.status).toBe(400);
        expect((error as { response: { status: number; data: { message: string } } }).response.data.message).toBeDefined();
      }
    });

    it('should validate name length (max 100 chars)', async () => {
      const createDto = {
        name: 'a'.repeat(101), // 101 characters
      };

      try {
        await axios.post('/playlists', createDto);
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(400);
      }
    });
  });

  describe('GET /playlists', () => {
    it('should return array of playlists', async () => {
      const response = await axios.get('/playlists');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should include user relations', async () => {
      const response = await axios.get('/playlists');

      expect(response.status).toBe(200);
      if (response.data.length > 0) {
        expect(response.data[0].user).toBeDefined();
      }
    });

    it('should be ordered by createdAt DESC', async () => {
      // Create two playlists with a small delay
      const playlist1 = await axios.post(
        '/playlists',
        { name: 'First Playlist' },
        { headers: { 'x-user-id': testUser.id.toString() } }
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      const playlist2 = await axios.post(
        '/playlists',
        { name: 'Second Playlist' },
        { headers: { 'x-user-id': testUser.id.toString() } }
      );

      if (playlist1.data.id) createdPlaylistIds.push(playlist1.data.id);
      if (playlist2.data.id) createdPlaylistIds.push(playlist2.data.id);

      const response = await axios.get('/playlists');

      expect(response.status).toBe(200);
      const firstPlaylist = response.data.find(
        (p: { id: number }) => p.id === playlist2.data.id
      );
      const secondPlaylist = response.data.find(
        (p: { id: number }) => p.id === playlist1.data.id
      );

      if (firstPlaylist && secondPlaylist) {
        const firstIndex = response.data.indexOf(firstPlaylist);
        const secondIndex = response.data.indexOf(secondPlaylist);
        expect(firstIndex).toBeLessThan(secondIndex);
      }
    });
  });

  describe('GET /playlists/:id', () => {
    let playlistId: number;

    beforeAll(async () => {
      const response = await axios.post(
        '/playlists',
        {
          name: 'Get Test Playlist',
          description: 'Test description',
        },
        { headers: { 'x-user-id': testUser.id.toString() } }
      );
      playlistId = response.data.id;
      if (playlistId) createdPlaylistIds.push(playlistId);
    });

    it('should return playlist by id', async () => {
      const response = await axios.get(`/playlists/${playlistId}`);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(playlistId);
      expect(response.data.name).toBe('Get Test Playlist');
      expect(response.data.description).toBe('Test description');
    });

    it('should include user relation', async () => {
      const response = await axios.get(`/playlists/${playlistId}`);

      expect(response.status).toBe(200);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.id).toBe(testUser.id);
    });

    it('should return 404 for non-existent playlist', async () => {
      try {
        await axios.get('/playlists/999999');
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });

  describe('PATCH /playlists/:id', () => {
    let playlistId: number;

    beforeAll(async () => {
      const response = await axios.post(
        '/playlists',
        { name: 'Update Test Playlist' },
        { headers: { 'x-user-id': testUser.id.toString() } }
      );
      playlistId = response.data.id;
      if (playlistId) createdPlaylistIds.push(playlistId);
    });

    it('should update playlist name', async () => {
      const updateDto = {
        name: 'Updated Playlist Name',
      };

      const response = await axios.patch(`/playlists/${playlistId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateDto.name);
    });

    it('should update playlist description', async () => {
      const updateDto = {
        description: 'Updated description',
      };

      const response = await axios.patch(`/playlists/${playlistId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateDto.description);
    });

    it('should update both name and description', async () => {
      const updateDto = {
        name: 'Final Updated Name',
        description: 'Final updated description',
      };

      const response = await axios.patch(`/playlists/${playlistId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateDto.name);
      expect(response.data.description).toBe(updateDto.description);
    });

    it('should return 404 for non-existent playlist', async () => {
      try {
        await axios.patch('/playlists/999999', { name: 'Test' });
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });

  describe('DELETE /playlists/:id', () => {
    let playlistId: number;

    beforeEach(async () => {
      const response = await axios.post(
        '/playlists',
        { name: 'Delete Test Playlist' },
        { headers: { 'x-user-id': testUser.id.toString() } }
      );
      playlistId = response.data.id;
    });

    it('should soft delete playlist', async () => {
      const response = await axios.delete(`/playlists/${playlistId}`);

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Playlist deleted successfully');

      // Verify it's soft deleted (should not be found)
      try {
        await axios.get(`/playlists/${playlistId}`);
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });

    it('should return success message', async () => {
      const response = await axios.delete(`/playlists/${playlistId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data.message).toContain('deleted successfully');
    });

    it('should return 404 for non-existent playlist', async () => {
      try {
        await axios.delete('/playlists/999999');
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });
});
