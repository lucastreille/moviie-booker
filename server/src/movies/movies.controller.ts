import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieQueryDto, MovieSortOption } from './dto/movie-query.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Movies') 
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}


    @Get()
    @ApiOperation({ summary: 'Récupérer les films avec options de recherche et de tri' })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des films récupérée avec succès',
        type: 'array' 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Paramètres de requête invalides' 
    })
    async getMovies(@Query() query: MovieQueryDto) {
        const parsedQuery = {
            page: query.page ? parseInt(query.page.toString()) : 1,
            search: query.search,
            sort: query.sort || MovieSortOption.POPULARITY_DESC
        };

        return this.moviesService.getMovies(parsedQuery);
    }


    
}
