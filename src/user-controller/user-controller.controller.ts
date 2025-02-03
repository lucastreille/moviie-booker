import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';



@ApiTags('Authentification')
@Controller('user-controller')
export class UserControllerController {
    
    
    constructor(private readonly userService: UserService) {}
    



    @Post('auth/register')
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    @ApiResponse({ 
        status: 201, 
        description: 'Utilisateur créé avec succès',
        type: RegisterDto 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Données invalides ou email déjà utilisé' 
    })
    async register(@Body() registerDto: RegisterDto) {
        console.log('Données reçues:', registerDto);
        return this.userService.register(registerDto);
    }





    @Post('auth/login')
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiResponse({ 
        status: 200, 
        description: 'Connexion réussie',
        schema: {
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        username: { type: 'string' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Identifiants invalides' 
    })
    async login(@Body() loginDto: LoginDto) {
        console.log('Tentative de connexion avec:', loginDto);
        return this.userService.login(loginDto); 
    }



    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
    @ApiResponse({ 
        status: 200, 
        description: 'Profil récupéré avec succès',
        schema: {
            properties: {
                email: { type: 'string' },
                username: { type: 'string' }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Non authentifié' 
    })
    async getProfile(@Request() req) {
        return req.user; 
    }




}