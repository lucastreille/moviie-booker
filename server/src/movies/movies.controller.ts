import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Movies') 
@Controller('movies')
export class MoviesController {
   constructor(private readonly moviesService: MoviesService) {}



    @Get()
    @ApiOperation({ 
        summary: 'Récupérer les films avec options de recherche' 
    })
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
        return this.moviesService.getMovies({
            page: query.page || 1,
            search: query.search || ''
        });
    }


    
}