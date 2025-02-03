import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user-controller/user.module';
import { User } from './user-controller/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-riviart.alwaysdata.net',
      port: 3306,
      username: 'riviart_moviiebo',
      password: 'cfJWzZVsUA2@*YQ',
      database: 'riviart_moviiebooker',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}