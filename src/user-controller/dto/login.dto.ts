import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class LoginDto {


    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email de l\'utilisateur',
        format: 'email'
    })
    @IsEmail({}, { message: 'Veuillez fournir un email valide' })
    email: string;



    @ApiProperty({
        example: 'Password123!',
        description: 'Mot de passe de l\'utilisateur',
        minLength: 1
    })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    password: string;


}