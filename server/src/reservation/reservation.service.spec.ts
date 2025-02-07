import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: Repository<Reservation>;

  // Mock du repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));

    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reservation when no conflict exists', async () => {
      // Données de test
      const createDto = {
        seanceId: 1,
        dateReservation: '2025-02-07T14:00:00.000Z',
      };
      const userId = 1;
      const reservationDate = new Date(createDto.dateReservation);
      reservationDate.setHours(reservationDate.getHours() - 1);

      // Mock du find pour simuler qu'il n'y a pas de conflit
      mockRepository.find.mockResolvedValue([]);

      // Mock de la création et sauvegarde
      const mockReservation = {
        id: 1,
        seanceId: createDto.seanceId,
        dateReservation: reservationDate,
        userId,
      };
      mockRepository.create.mockReturnValue(mockReservation);
      mockRepository.save.mockResolvedValue(mockReservation);

      // Exécution du test
      const result = await service.create(createDto, userId);

      // Vérifications
      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        seanceId: createDto.seanceId,
        dateReservation: expect.any(Date),
        userId,
      });
      expect(result).toHaveProperty('message', 'Réservation créée avec succès');
      expect(result.reservation).toHaveProperty('heureDebut');
      expect(result.reservation).toHaveProperty('heureFin');
    });

    it('should throw ConflictException when reservation exists in time window', async () => {
      // Données de test
      const createDto = {
        seanceId: 1,
        dateReservation: '2025-02-07T14:00:00.000Z',
      };
      const userId = 1;

      // Mock pour simuler une réservation existante
      const existingReservation = {
        id: 2,
        dateReservation: new Date('2025-02-07T13:30:00.000Z'),
        userId,
        seanceId: 1,
      };
      mockRepository.find.mockResolvedValue([existingReservation]);

      // Vérification que l'exception est bien levée
      await expect(service.create(createDto, userId))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('findAllByUser', () => {
    it('should return all reservations for a user', async () => {
      // Données de test
      const userId = 1;
      const mockReservations = [
        { id: 1, userId, seanceId: 1, dateReservation: new Date() },
        { id: 2, userId, seanceId: 2, dateReservation: new Date() },
      ];

      // Configuration du mock
      mockRepository.find.mockResolvedValue(mockReservations);

      // Exécution et vérification
      const result = await service.findAllByUser(userId);
      expect(result).toEqual(mockReservations);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should handle errors in findAllByUser', async () => {
      // Configuration du mock pour simuler une erreur
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      // Vérification que l'erreur est bien propagée
      await expect(service.findAllByUser(1))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should successfully remove a reservation', async () => {
      // Données de test
      const reservationId = 1;
      const userId = 1;
      const mockReservation = { id: reservationId, userId };

      // Configuration des mocks
      mockRepository.findOne.mockResolvedValue(mockReservation);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      // Exécution du test
      const result = await service.remove(reservationId, userId);

      // Vérifications
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId, userId },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(reservationId);
      expect(result).toEqual({ message: 'Réservation supprimée avec succès' });
    });

    it('should throw NotFoundException when reservation not found', async () => {
      // Configuration du mock pour simuler une réservation non trouvée
      mockRepository.findOne.mockResolvedValue(null);

      // Vérification que l'exception est bien levée
      await expect(service.remove(1, 1))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should handle errors in remove', async () => {
      // Configuration du mock pour simuler une erreur de base de données
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Vérification que l'erreur est bien propagée
      await expect(service.remove(1, 1))
        .rejects
        .toThrow('Database error');
    });
  });
});