import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieQueryDto, MovieSortOption } from './dto/movie-query.dto';

@Controller('movies')
export class MoviesController {
  
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    async getMovies(@Query() query: MovieQueryDto) {
        const parsedQuery = {
        page: query.page ? parseInt(query.page.toString()) : 1,
        search: query.search,
        sort: query.sort || MovieSortOption.POPULARITY_DESC
        };

        return this.moviesService.getMovies(parsedQuery);
    }


}