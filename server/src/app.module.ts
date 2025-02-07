import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user-controller/user.module';
import { User } from './user-controller/entities/user.entity';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/entities/reservation.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-riviart.alwaysdata.net',
      port: 3306,
      username: 'riviart_moviiebo',
      password: 'cfJWzZVsUA2@*YQ',
      database: 'riviart_moviiebooker',
      entities: [User, Reservation],
      synchronize: true,
    }),
    UserModule,
    MoviesModule,
    ReservationModule,
  ],
})
export class AppModule {}