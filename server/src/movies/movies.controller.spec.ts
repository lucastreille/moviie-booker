import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieQueryDto, MovieSortOption } from './dto/movie-query.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  // Mock du MoviesService
  const mockMoviesService = {
    getMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);

    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies with default parameters when no query is provided', async () => {
      // Données de test
      const emptyQuery: MovieQueryDto = {};
      const expectedParsedQuery = {
        page: 1,
        search: undefined,
        sort: MovieSortOption.POPULARITY_DESC,
      };
      const expectedMovies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];

      // Configuration du mock
      mockMoviesService.getMovies.mockResolvedValue(expectedMovies);

      // Exécution du test
      const result = await controller.getMovies(emptyQuery);

      // Vérifications
      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
      expect(result).toEqual(expectedMovies);
    });

    it('should handle string page numbers correctly', async () => {
      // Données de test
      const query: MovieQueryDto = {
        page: 3,
      };
      const expectedParsedQuery = {
        page: 3,
        search: undefined,
        sort: MovieSortOption.POPULARITY_DESC,
      };

      // Configuration du mock
      mockMoviesService.getMovies.mockResolvedValue([]);

      // Exécution du test
      await controller.getMovies(query);

      // Vérifications
      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
    });

    it('should use default sort option when none is provided', async () => {
      // Données de test
      const query: MovieQueryDto = {
        search: 'test',
      };
      const expectedParsedQuery = {
        page: 1,
        search: 'test',
        sort: MovieSortOption.POPULARITY_DESC,
      };

      // Configuration du mock
      mockMoviesService.getMovies.mockResolvedValue([]);

      // Exécution du test
      await controller.getMovies(query);

      // Vérifications
      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
    });

    it('should handle service errors', async () => {
      // Données de test
      const query: MovieQueryDto = {
        page: 1,
      };

      // Configuration du mock pour simuler une erreur
      const error = new Error('Service error');
      mockMoviesService.getMovies.mockRejectedValue(error);

      // Vérification que l'erreur est bien propagée
      await expect(controller.getMovies(query)).rejects.toThrow('Service error');
    });
  });
});