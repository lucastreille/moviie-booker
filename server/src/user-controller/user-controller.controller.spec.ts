import { Test, TestingModule } from '@nestjs/testing';
import { UserControllerController } from './user-controller.controller';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('UserControllerController', () => {
  let controller: UserControllerController;
  let userService: UserService;

  // Mock du UserService
  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserControllerController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserControllerController>(UserControllerController);
    userService = module.get<UserService>(UserService);
  });

  // Test de base pour vérifier que le contrôleur est défini
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests pour la méthode register
  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Données de test
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      };

      const expectedResponse = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
      };

      // Configuration du mock
      mockUserService.register.mockResolvedValue(expectedResponse);

      // Exécution du test
      const result = await controller.register(registerDto);

      // Vérifications
      expect(mockUserService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser'
      };

      // Simulation d'une erreur
      mockUserService.register.mockRejectedValue(new Error('Email already exists'));

      // Vérification que l'erreur est bien propagée
      await expect(controller.register(registerDto)).rejects.toThrow('Email already exists');
    });
  });

  // Tests pour la méthode login
  describe('login', () => {
    it('should successfully login a user', async () => {
      // Données de test
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedResponse = {
        access_token: 'jwt_token',
        user: {
          email: 'test@example.com',
          username: 'testuser'
        }
      };

      // Configuration du mock
      mockUserService.login.mockResolvedValue(expectedResponse);

      // Exécution du test
      const result = await controller.login(loginDto);

      // Vérifications
      expect(mockUserService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle login failures', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      // Simulation d'une erreur d'authentification
      mockUserService.login.mockRejectedValue(new Error('Invalid credentials'));

      // Vérification que l'erreur est bien propagée
      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  // Tests pour la méthode getProfile
  describe('getProfile', () => {
    it('should return the user profile from request', async () => {
      const mockRequest = {
        user: {
          email: 'test@example.com',
          username: 'testuser'
        }
      };

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});