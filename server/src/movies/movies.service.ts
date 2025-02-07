import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MovieQueryDto } from './dto/movie-query.dto';

@Injectable()
export class MoviesService {


  private readonly apiUrl: string;
  private readonly apiKey: string;


  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiUrl = this.configService.get<string>('TMDB_API_URL');
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!apiUrl || !apiKey) {
      throw new Error('TMDB_API_URL et TMDB_API_KEY check de la définitions.');
    }

    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }



  async getMovies(query: MovieQueryDto) {
    
    
    const params = {
      api_key: this.apiKey,
      page: query.page || 1,
      language: 'fr-FR',
    };

    
    if (query.search) {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/search/movie`, {
          params: {
            ...params,
            query: query.search,
          },
        }),
      );
      return response.data;
    }

    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/discover/movie`, {
        params: {
          ...params,
          sort_by: query.sort || 'popularity.desc',
        },
      }),
    );
    return response.data;


  }


}