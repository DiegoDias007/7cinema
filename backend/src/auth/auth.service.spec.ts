import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should return an access token when signing up with valid user data', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const accessToken = 'mockAccessToken';
      (usersService.getUser as jest.Mock).mockResolvedValueOnce(null);
      (usersService.createUser as jest.Mock).mockResolvedValueOnce({ id: 'mockId', ...user });
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(accessToken);

      const result = await service.signUp(user);

      expect(result.access_token).toBe(accessToken);
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const user = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
      };
      (usersService.getUser as jest.Mock).mockResolvedValueOnce({} as any);

      await expect(service.signUp(user)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return an access token when signing in with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 'mockId',
        email,
        password: await bcrypt.hash(password, 10),
        firstName: 'John',
      };
      const accessToken = 'mockAccessToken';
      (usersService.getUser as jest.Mock).mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(accessToken);

      const result = await service.signIn(email, password);

      expect(result.access_token).toBe(accessToken);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 'mockId',
        email,
        password: await bcrypt.hash(password, 10),
        firstName: 'John',
      };
      (usersService.getUser as jest.Mock).mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const email = 'nonexisting@example.com';
      const password = 'password123';
      (usersService.getUser as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});