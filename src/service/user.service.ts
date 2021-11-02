import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user/user.repository';
import { User } from '../domain/user/user.entity';
import { UserRole } from '../common/auth/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
  ) {}

  async findAll(params): Promise<{ list: User[]; total: number }> {
    const result = await this.repository.findUsers(params);
    if (result.total < 1) {
      throw new NotFoundException('Users not found');
    }

    return result;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id, {
      select: ['id', 'name', 'email', 'role'],
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createAdminUser(params): Promise<User> {
    await this.validateParams(params);
    return this.create(params, UserRole.ADMIN);
  }

  async createUser(params): Promise<User> {
    await this.validateParams(params);
    return this.create(params, UserRole.USER);
  }

  async updateFull(id: string, params): Promise<User> {
    const userFound = await this.findById(id);
    await this.validatePassword(params);
    const { email, name, password, role } = params;
    userFound.email = email;
    userFound.name = name;
    userFound.role = role;
    userFound.salt = await bcrypt.genSalt();
    userFound.password = await this.hashPassword(password, userFound.salt);
    await this.repository.save(userFound);
    delete userFound.password;
    delete userFound.salt;

    return userFound;
  }

  async updateIncremental(id: string, params): Promise<User> {
    const userFound = await this.findById(id);
    await this.validatePassword(params);
    const { email, name, password, role } = params;
    if (email) {
      userFound.email = email;
    }

    if (name) {
      userFound.name = name;
    }

    if (role) {
      userFound.role = role;
    }

    if (password) {
      userFound.salt = await bcrypt.genSalt();
      userFound.password = await this.hashPassword(password, userFound.salt);
    }
    await this.repository.save(userFound);
    delete userFound.password;
    delete userFound.salt;

    return userFound;
  }

  async delete(id: string): Promise<void> {
    const userFound = await this.findById(id);
    userFound.isActive = false;
    await this.repository.save(userFound);
  }

  async checkCredentials(params): Promise<User> {
    const { email, password } = params;
    const user = await this.repository.findOne({ email, isActive: true });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async create(params, role: UserRole): Promise<User> {
    const { email, name, password } = params;
    const user = this.repository.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    await this.repository.save(user);
    delete user.password;
    delete user.salt;

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validateParams(params): Promise<void> {
    await this.validatePassword(params);
    const user = await this.repository.findUserByEmail(params.email);
    if (user) {
      throw new ConflictException('Email address is already in use');
    }
  }

  private async validatePassword(params): Promise<void> {
    if (params.password != params.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    }
  }
}
