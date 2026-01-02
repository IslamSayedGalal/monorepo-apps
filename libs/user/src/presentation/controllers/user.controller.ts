import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { ActivateUserUseCase } from '../../application/use-cases/activate-user.usecase';
import { SuspendUserUseCase } from '../../application/use-cases/suspend-user.usecase';
import { BanUserUseCase } from '../../application/use-cases/ban-user.usecase';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { UserStatus } from '../../domain/enums/user-status.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly suspendUserUseCase: SuspendUserUseCase,
    private readonly banUserUseCase: BanUserUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get()
  async findAll(
    @Query('status') status?: UserStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page && limit) {
      return this.userRepository.findPaginated(page, limit);
    }
    if (status) {
      return this.userRepository.findByStatus(status);
    }
    return this.userRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Get('login/:login')
  async findByLogin(@Param('login') login: string) {
    const user = await this.userRepository.findByLogin(login);
    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.activateUserUseCase.execute(id);
  }

  @Patch(':id/suspend')
  async suspend(@Param('id') id: string) {
    return this.suspendUserUseCase.execute(id);
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: string) {
    return this.banUserUseCase.execute(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userRepository.delete(id);
  }
}

