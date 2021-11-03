import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../domain/user/user.repository';
import { FindUsersQueryDto } from '../api/dtos/user/find-users-query.dto';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRole } from '../common/auth/user-role.enum';

const mockRepository = () => ({
  findUsers: jest.fn(),
  findOne: jest.fn(),
  findUserByEmail: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('UserService', () => {
  let repository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockRepository },
      ],
    }).compile();

    repository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    let mockQuery: FindUsersQueryDto;

    beforeEach(() => {
      mockQuery = {
        name: '',
        email: '',
        limit: 1,
        page: 1,
        role: '',
        sort: '',
        isActive: true,
      };
    });

    it('should call the findAll method', async () => {
      repository.findUsers.mockResolvedValue('resultOfSearch');
      const result = await service.findAll(mockQuery);
      expect(repository.findUsers).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual('resultOfSearch');
    });

    it('should call the findAll method with not found users', () => {
      repository.findUsers.mockResolvedValue({ total: 0 });
      expect(service.findAll(mockQuery)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    let select;

    beforeEach(() => {
      select = { select: ['id', 'name', 'email', 'role'] };
    });

    it('should call the findById method', async () => {
      repository.findOne.mockResolvedValue('result');
      const result = await service.findById('1');
      expect(repository.findOne).toHaveBeenCalledWith('1', select);
      expect(result).toEqual('result');
    });

    it('should call the findById method with not found user', () => {
      expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createAdminUser', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        email: 'teste@teste.com',
        name: 'Teste User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
        role: UserRole.ADMIN,
      };
    });

    it('should call createAdminUser an user', async () => {
      repository.save.mockResolvedValue(mockParams);
      repository.create.mockResolvedValue(mockParams);
      const result = await service.createAdminUser(mockParams);
      expect(result).toEqual(mockParams);
    });

    it('should call createAdminUser with an user exists', () => {
      repository.findUserByEmail.mockResolvedValue(mockParams);
      expect(service.createAdminUser(mockParams)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should call createAdminUser an user if passwords doesnt match', () => {
      mockParams.passwordConfirmation = 'wrongPassword';
      expect(service.createAdminUser(mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('createUser', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        email: 'teste@teste.com',
        name: 'Teste User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
        role: UserRole.USER,
      };
    });

    it('should call createUser an user', async () => {
      repository.save.mockResolvedValue(mockParams);
      repository.create.mockResolvedValue(mockParams);
      const result = await service.createUser(mockParams);
      expect(result).toEqual(mockParams);
    });

    it('should call createUser with an user exists', () => {
      repository.findUserByEmail.mockResolvedValue(mockParams);
      expect(service.createUser(mockParams)).rejects.toThrow(ConflictException);
    });

    it('should call createUser an user if passwords doesnt match', () => {
      mockParams.passwordConfirmation = 'wrongPassword';
      expect(service.createUser(mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updateFull', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        email: 'teste@teste.com',
        name: 'Teste User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
        role: UserRole.USER,
      };
    });

    it('should call updateFull an user', async () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.email = 'teste2@teste.com';
      const result = await service.updateFull('1', mockParams);
      expect(result.email).toEqual(mockParams.email);
    });

    it('should call updateFull an user if passwords doesnt match', () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.passwordConfirmation = 'wrongPassword';
      expect(service.updateFull('1', mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should call updateFull an user if user not found', () => {
      expect(service.updateFull('1', mockParams)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateIncremental', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        email: 'teste@teste.com',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should call updateIncremental an user', async () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.email = 'teste2@teste.com';
      const result = await service.updateIncremental('1', mockParams);
      expect(result.email).toEqual(mockParams.email);
    });

    it('should call updateIncremental an user if passwords doesnt match', () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.passwordConfirmation = 'wrongPassword';
      expect(service.updateIncremental('1', mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should call updateIncremental an user if user not found', () => {
      expect(service.updateIncremental('1', mockParams)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should call delete an user', async () => {
      const mockUser = { isActive: true };
      repository.findOne.mockResolvedValue(mockUser);
      await service.delete('1');
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should call delete an user if user not found', () => {
      expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkCredentials', () => {
    let mockUser;

    beforeEach(() => {
      mockUser = {
        email: 'teste@teste.com',
        isActive: true,
        password: 'password',
        salt: 'salt',
        checkPassword: (password: string) => {
          return true;
        },
      };
    });

    it('should call checkCredentials an user', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const result = await service.checkCredentials(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        isActive: true,
      });
      expect(result).toEqual(mockUser);
    });

    it('should call checkCredentials an user not found', async () => {
      const result = await service.checkCredentials(mockUser);
      expect(result).toEqual(null);
    });
  });
});
