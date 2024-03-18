import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock AuthService
    const mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const dto: SignInDto = { email: 'test@example.com', password: 'password123' };
      await controller.signIn(dto);
      expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with correct parameters', async () => {
      const dto: SignUpDto = { email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' };
      await controller.signUp(dto);
      expect(authService.signUp).toHaveBeenCalledWith(dto);
    });
  });
});