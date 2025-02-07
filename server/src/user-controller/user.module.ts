import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserControllerController } from './user-controller.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'qgr55UIYgg65g4G5UIYGIO',
            signOptions: { expiresIn: '1h' },
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserControllerController],
    providers: [UserService, JwtStrategy]
})
export class UserModule {}