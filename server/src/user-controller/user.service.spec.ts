import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  // Mocks pour le repository et JwtService
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  // Test de base
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests pour la méthode register
  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Données de test
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const hashedPassword = 'hashedPassword123';
      const savedUser = {
        id: 1,
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
      };

      // Configuration des mocks
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      // Exécution du test
      const result = await service.register(registerDto);

      // Vérifications
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual({
        message: 'Utilisateur enregistré avec succès',
        user: {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
        },
      });
    });

    it('should handle registration errors', async () => {
      // Configuration du mock pour simuler une erreur
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      // Données de test
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      // Vérification que l'erreur est bien propagée
      await expect(service.register(registerDto)).rejects.toThrow('Database error');
    });
  });

  // Tests pour la méthode login
  describe('login', () => {
    it('should successfully login a user', async () => {
      // Données de test
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
        username: 'testuser',
      };

      const token = 'jwt_token';

      // Configuration des mocks
      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(token);

      // Exécution du test
      const result = await service.login(loginDto);

      // Vérifications
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({
        message: 'Login successful',
        access_token: token,
        user: {
          email: user.email,
          username: user.username,
        },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Configuration du mock pour simuler un utilisateur non trouvé
      mockRepository.findOne.mockResolvedValue(null);

      // Données de test
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Vérification que l'exception est bien levée
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Données de test
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
        username: 'testuser',
      };

      // Configuration des mocks
      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Vérification que l'exception est bien levée
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});