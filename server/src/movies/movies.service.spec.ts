import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockApiKey = 'd31ff541c77cbc091d4deb05c55f831e';
  const mockApiUrl = 'http://api.themoviedb.org/3';

  // Modification du mock ConfigService pour garantir le retour des valeurs
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'TMDB_API_URL') return mockApiUrl;
      if (key === 'TMDB_API_KEY') return mockApiKey;
      return undefined;
    })
  };

  const mockHttpService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // S'assurer que le mock retourne toujours les bonnes valeurs au début de chaque test
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'TMDB_API_URL') return mockApiUrl;
      if (key === 'TMDB_API_KEY') return mockApiKey;
      return undefined;
    });

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

  // Test de vérification de la configuration
  it('should throw error if API URL is not defined', async () => {
    // Mock uniquement pour ce test
    const testConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TMDB_API_KEY') return mockApiKey;
        return undefined;
      })
    };

    const testModule = Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: testConfigService,
        },
      ],
    });

    await expect(testModule.compile()).rejects.toThrow('TMDB_API_URL et TMDB_API_KEY check de la définitions.');
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
        `${mockApiUrl}/discover/movie`,  
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: mockApiKey,
            page: 1,
            language: 'fr-FR',
            sort_by: 'popularity.desc' 
          })
        })
      );
    });

    it('should handle HTTP errors', async () => {
      const errorMessage = 'API Error';
      mockHttpService.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      await expect(service.getMovies({
        page: 1
      })).rejects.toThrow(errorMessage);
    });
  });
});