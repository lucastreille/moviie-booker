import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../user-controller/entities/user.entity';



@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>
    ) {}

    async create(createReservationDto: CreateReservationDto, userId: number) {
        
        
        try {

            const reservationDate = new Date(createReservationDto.dateReservation);
            reservationDate.setHours(reservationDate.getHours() - 1);

            const startWindow = new Date(reservationDate.getTime() - 2 * 60 * 60 * 1000);
            const endWindow = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

            const existingReservations = await this.reservationRepository.find({
                where: {
                    userId: userId,
                    dateReservation: Between(startWindow, endWindow)
                }
            });

            if (existingReservations.length > 0) {
                const conflictingReservation = existingReservations[0];
                const endTime = new Date(conflictingReservation.dateReservation.getTime() + 2 * 60 * 60 * 1000);
                
                throw new ConflictException(
                    `Vous avez déjà une réservation active de ${conflictingReservation.dateReservation.toLocaleTimeString()} à ${endTime.toLocaleTimeString()}. Veuillez réserver une séance où vous êtes disponibles.`
                );

            }

            const reservation = this.reservationRepository.create({
                seanceId: createReservationDto.seanceId,
                dateReservation: reservationDate,
                userId: userId
            });

            const savedReservation = await this.reservationRepository.save(reservation);
            
            const endTime = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

            return {

                message: 'Réservation créée avec succès',
                reservation: {
                    ...savedReservation,
                    heureDebut: reservationDate.toLocaleTimeString(),
                    heureFin: endTime.toLocaleTimeString()
                }

            };


        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.error('Erreur dans create reservation:', error);
            throw error;
        }

        

    }

    async findAllByUser(userId: number) {

        try {
            return await this.reservationRepository.find({
                where: { userId: userId }
            });
        } catch (error) {
            console.error('Erreur dans findAllByUser:', error);
            throw error;
        }

    }

    
    async remove(id: number, userId: number) {

        try {
            
            const reservation = await this.reservationRepository.findOne({
                where: { id: id, userId: userId }
            });

            if (!reservation) {
                throw new NotFoundException('Réservation non trouvée');
            }

            await this.reservationRepository.delete(id);
            return {
                message: 'Réservation supprimée avec succès'
            };
            
        } catch (error) {
            console.error('Erreur dans remove reservation:', error);
            throw error;
        }

    }

}