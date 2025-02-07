import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString } from 'class-validator';

export class CreateReservationDto {
    
    @ApiProperty({ example: 1 })
    @IsNumber()
    seanceId: number;

    @ApiProperty({ example: '2025-02-05T14:00:00Z' })
    @IsDateString()
    dateReservation: string;

}
