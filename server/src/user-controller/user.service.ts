import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';


import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class UserService {


    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}


    async register(registerDto: RegisterDto) {
        try {

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);

            const user = this.usersRepository.create({
                email: registerDto.email,
                username: registerDto.username,
                password: hashedPassword,
            });

            const savedUser = await this.usersRepository.save(user);

            const { password, ...result } = savedUser;
            return {
                message: 'Utilisateur enregistré avec succès',
                user: result
            };
        } catch (error) {
            console.error('Erreur dans l\'enregsitrement:', error);  
            throw error;
        }
    }




    async login(loginDto: LoginDto) {

        
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user) {
            throw new UnauthorizedException('TOken Invalide');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('TOken Invalide');
        }

        const payload = { email: user.email, sub: user.id };
        const token = await this.jwtService.signAsync(payload);

        return {
            message: 'Login successful',
            access_token: token,
            user: {
                email: user.email,
                username: user.username
            }
        };
    }



}