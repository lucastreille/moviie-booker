import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieQueryDto } from './dto/movie-query.dto';

describe('MoviesController', () => {

  
  let controller: MoviesController;
  let service: MoviesService;

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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies with default parameters when no query is provided', async () => {
      const emptyQuery: MovieQueryDto = {};
      const expectedParsedQuery = {
        page: 1,
        search: ''
      };
      const expectedMovies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];

      mockMoviesService.getMovies.mockResolvedValue(expectedMovies);

      const result = await controller.getMovies(emptyQuery);

      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
      expect(result).toEqual(expectedMovies);
    });

    it('should handle page parameter correctly', async () => {
      const query: MovieQueryDto = {
        page: 3,
      };
      const expectedParsedQuery = {
        page: 3,
        search: ''
      };

      mockMoviesService.getMovies.mockResolvedValue([]);

      await controller.getMovies(query);

      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
    });

    it('should handle search parameter correctly', async () => {
      const query: MovieQueryDto = {
        search: 'test',
      };
      const expectedParsedQuery = {
        page: 1,
        search: 'test'
      };

      mockMoviesService.getMovies.mockResolvedValue([]);

      await controller.getMovies(query);

      expect(mockMoviesService.getMovies).toHaveBeenCalledWith(expectedParsedQuery);
    });

    it('should handle service errors', async () => {
      const query: MovieQueryDto = {
        page: 1,
      };

      const error = new Error('Service error');
      mockMoviesService.getMovies.mockRejectedValue(error);

      await expect(controller.getMovies(query)).rejects.toThrow('Service error');
    });
    
  });

});