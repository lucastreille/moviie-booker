import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../user-controller/guards/jwt-auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';



@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post()
    async create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
        console.log('User from request:', req.user);
        return await this.reservationService.create(createReservationDto, req.user.userId);
    }

    @Get()
    async findAll(@Request() req) {
        return await this.reservationService.findAllByUser(req.user.userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        return await this.reservationService.remove(id, req.user.userId);
    }
}