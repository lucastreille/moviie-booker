import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockApiUrl = 'http://api.example.com';
  const mockApiKey = 'test-api-key';

  // Mock des services
  const mockHttpService = {
    get: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'TMDB_API_URL':
            return 'http://api.themoviedb.org/3';
        case 'TMDB_API_KEY':
            return 'd31ff541c77cbc091d4deb05c55f831e';
        default:
          return undefined;
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if API URL or KEY is not defined', async () => {
    // Mock ConfigService pour retourner undefined
    jest.spyOn(mockConfigService, 'get').mockReturnValue(undefined);

    expect(() => {
      const moduleRef = Test.createTestingModule({
        providers: [
          MoviesService,
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();
    }).rejects.toThrow('TMDB_API_URL et TMDB_API_KEY doivent être définis');
  });

  describe('getMovies', () => {
    it('should fetch search movies when search query is provided', async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: 'Searched Movie' }
          ]
        }
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getMovies({
        page: 1,
        search: 'test movie'
      });

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockApiUrl}/search/movie`,
        {
          params: {
            api_key: mockApiKey,
            page: 1,
            language: 'fr-FR',
            query: 'test movie'
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should use default page 1 when no page is provided', async () => {
      const mockResponse = {
        data: {
          results: []
        }
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      await service.getMovies({});

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 1
          })
        })
      );
    });

    it('should handle HTTP errors', async () => {
      const errorMessage = 'API Error';
      mockHttpService.get.mockReturnValue(
        new Promise((_, reject) => reject(new Error(errorMessage)))
      );

      await expect(service.getMovies({
        page: 1
      })).rejects.toThrow();
    });
  });
});