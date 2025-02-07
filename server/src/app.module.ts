import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user-controller/user.module';
import { User } from './user-controller/entities/user.entity';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/entities/reservation.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Reservation],
        synchronize: true,
      }),
    }),
    UserModule,
    MoviesModule,
    ReservationModule,
  ],
})
export class AppModule {}