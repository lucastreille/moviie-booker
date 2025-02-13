import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../user-controller/guards/jwt-auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';



@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard) 
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}



    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle réservation' })
    @ApiResponse({ 
        status: 201, 
        description: 'Réservation créée avec succès',
        type: CreateReservationDto 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Données invalides' 
    })
    @ApiBearerAuth() 
    async create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
        console.log('User from request:', req.user);
        return await this.reservationService.create(createReservationDto, req.user.userId);
    }



    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les réservations de l\'utilisateur connecté' })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des réservations récupérées avec succès',
        type: [CreateReservationDto] 
    })
    @ApiBearerAuth() 
    async findAll(@Request() req) {
        return await this.reservationService.findAllByUser(req.user.userId);
    }



    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une réservation' })
    @ApiResponse({ 
        status: 200, 
        description: 'Réservation supprimée avec succès' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Réservation non trouvée' 
    })
    @ApiBearerAuth()
    async remove(@Param('id') id: number, @Request() req) {
        return await this.reservationService.remove(id, req.user.userId);
    }


}
