import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserService } from '../../service/user/user.service';
import { Role } from '../../common/auth/role.decorator';
import { UserRole } from '../../common/auth/user-role.enum';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/user/user.entity';
import { GetUser } from '../../common/auth/get-user.decorator';
import { FindUsersQueryDto } from '../dtos/find-users-query.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserApi {
  constructor(private service: UserService) {}

  @Get()
  @Role(UserRole.ADMIN)
  async findAll(@Query() queryDto: FindUsersQueryDto): Promise<{ list: User[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findOne(@Param('id') id): Promise<User> {
    return this.service.findById(id);
  }

  @Post()
  @Role(UserRole.ADMIN)
  async create(@Body(ValidationPipe) userDto: CreateUserDto): Promise<User> {
    return this.service.createAdminUser(userDto);
  }

  @Put(':id')
  async fullUpdate(@Body(ValidationPipe) userDto: UpdateUserDto, @GetUser() user: User, @Param('id') id: string) {
    this.validationAuthorization(user, id);
    return this.service.updateFull(id, user);
  }

  @Patch(':id')
  async incrementalUpdate(@Body(ValidationPipe) userDto: UpdateUserDto, @GetUser() user: User, @Param('id') id: string) {
    this.validationAuthorization(user, id);
    return this.service.updateIncremental(id, user);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  private validationAuthorization(user: User, id: string) {
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException('You are not authorized to access this feature');
    }
  }
}
