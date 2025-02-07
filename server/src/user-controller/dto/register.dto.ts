import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    
    
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email de l\'utilisateur',
        format: 'email'
    })
    @IsEmail({}, { message: 'Veuillez fournir un email valide' })
    email: string;



    @ApiProperty({
        example: 'Password123!',
        description: 'Mot de passe de l\'utilisateur (minimum 6 caractères)',
        minLength: 6
    })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password: string;



    @ApiProperty({
        example: 'johndoe',
        description: 'Nom d\'utilisateur',
        minLength: 3
    })
    @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
    @MinLength(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' })
    username: string;


}