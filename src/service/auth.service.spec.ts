import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

const mockUserService = () => ({
  createUser: jest.fn(),
  checkCredentials: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service;
  let userService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: mockUserService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = await module.get<AuthService>(AuthService);
    userService = await module.get<UserService>(UserService);
    jwtService = await module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('signUp', () => {
    let params;

    beforeEach(() => {
      params = {
        email: 'teste@teste.com',
        name: 'Teste User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should call signUp with params', async () => {
      userService.createUser.mockResolvedValue(params);
      const result = await service.signUp(params);
      expect(result).toEqual(params);
    });
  });

  describe('signIn', () => {
    let params;

    beforeEach(() => {
      params = {
        email: 'teste@teste.com',
        name: 'Teste User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should call signIn with params', async () => {
      jwtService.sign.mockResolvedValue('token');
      userService.checkCredentials.mockResolvedValue(params);
      const result = await service.signIn(params);
      expect(userService.checkCredentials).toHaveBeenCalledWith(params);
      expect(result).toEqual('token');
    });

    it('should call signIn with user not found', () => {
      expect(service.signIn(params)).rejects.toThrow(UnauthorizedException);
    });
  });
});
