import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn  } from 'typeorm';
import { User } from './../../user-controller/entities/user.entity';


@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seanceId: number;

    @Column()
    dateReservation: Date;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;
}