import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../user-controller/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  // Mock du ReservationService
  const mockReservationService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);

    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  // Test de base
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      // Données de test
      const createDto: CreateReservationDto = {
        seanceId: 1,
        dateReservation: '2025-02-07T14:00:00.000Z',
      };

      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      const expectedResponse = {
        message: 'Réservation créée avec succès',
        reservation: {
          id: 1,
          seanceId: 1,
          dateReservation: new Date('2025-02-07T14:00:00.000Z'),
          userId: 1,
          heureDebut: '14:00:00',
          heureFin: '16:00:00',
        },
      };

      // Configuration du mock
      mockReservationService.create.mockResolvedValue(expectedResponse);

      // Exécution du test
      const result = await controller.create(createDto, mockRequest);

      // Vérifications
      expect(mockReservationService.create).toHaveBeenCalledWith(
        createDto,
        mockRequest.user.userId,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle creation errors', async () => {
      // Données de test
      const createDto: CreateReservationDto = {
        seanceId: 1,
        dateReservation: '2025-02-07T14:00:00.000Z',
      };

      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      // Configuration du mock pour simuler une erreur
      mockReservationService.create.mockRejectedValue(new Error('Creation failed'));

      // Vérification que l'erreur est bien propagée
      await expect(controller.create(createDto, mockRequest)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return all reservations for the user', async () => {
      // Données de test
      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      const mockReservations = [
        {
          id: 1,
          seanceId: 1,
          dateReservation: new Date('2025-02-07T14:00:00.000Z'),
          userId: 1,
        },
        {
          id: 2,
          seanceId: 2,
          dateReservation: new Date('2025-02-08T15:00:00.000Z'),
          userId: 1,
        },
      ];

      // Configuration du mock
      mockReservationService.findAllByUser.mockResolvedValue(mockReservations);

      // Exécution du test
      const result = await controller.findAll(mockRequest);

      // Vérifications
      expect(mockReservationService.findAllByUser).toHaveBeenCalledWith(
        mockRequest.user.userId,
      );
      expect(result).toEqual(mockReservations);
    });

    it('should handle findAll errors', async () => {
      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      // Configuration du mock pour simuler une erreur
      mockReservationService.findAllByUser.mockRejectedValue(new Error('Find failed'));

      // Vérification que l'erreur est bien propagée
      await expect(controller.findAll(mockRequest)).rejects.toThrow('Find failed');
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      // Données de test
      const reservationId = 1;
      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      const expectedResponse = {
        message: 'Réservation supprimée avec succès',
      };

      // Configuration du mock
      mockReservationService.remove.mockResolvedValue(expectedResponse);

      // Exécution du test
      const result = await controller.remove(reservationId, mockRequest);

      // Vérifications
      expect(mockReservationService.remove).toHaveBeenCalledWith(
        reservationId,
        mockRequest.user.userId,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle remove errors', async () => {
      const reservationId = 999;
      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@example.com',
        },
      };

      // Configuration du mock pour simuler une erreur
      mockReservationService.remove.mockRejectedValue(new Error('Remove failed'));

      // Vérification que l'erreur est bien propagée
      await expect(controller.remove(reservationId, mockRequest)).rejects.toThrow('Remove failed');
    });
  });
});