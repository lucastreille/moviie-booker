import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user-controller/entities/user.entity';
import { Reservation } from '../src/reservation/entities/reservation.entity';

describe('Application (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './test/test.sqlite', 
          entities: [User, Reservation],
          synchronize: true,
          dropSchema: true 
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
});

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!',
      username: 'testuser'
    };

    it('/auth/register (POST) - should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-controller/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.message).toBe('Utilisateur enregistré avec succès'); 
    });

    it('/auth/login (POST) - should login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-controller/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      console.log('Token reçu:', response.body.access_token);
      authToken = response.body.access_token;
    });

    it('/profile (GET) - should get user profile', async () => {
      expect(authToken).toBeDefined(); 
      const response = await request(app.getHttpServer())
        .get('/user-controller/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
    });
  });

  describe('Reservations Flow', () => {
    it('/reservations (POST) - should create reservation', async () => {
      const reservation = {
        seanceId: 1,
        dateReservation: new Date(Date.now() + 86400000).toISOString() 
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reservation)
        .expect(201);

      expect(response.body.message).toBe('Réservation créée avec succès'); 
      expect(response.body.reservation).toBeDefined();
    });

    it('/reservations (GET) - should get all user reservations', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/reservations/:id (DELETE) - should delete a reservation', async () => {

      const createResponse = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          seanceId: 2,
          dateReservation: new Date(Date.now() + 172800000).toISOString()
        });
    
      expect(createResponse.body.reservation).toBeDefined();
      expect(createResponse.body.reservation.id).toBeDefined();
    
      await request(app.getHttpServer())
        .delete(`/reservations/${createResponse.body.reservation.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      });

  });

  describe('Movies Flow', () => {
    it('/movies (GET) - should get movies list', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);

      expect(response.body.results).toBeDefined();
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('/movies (GET) - should search movies with query', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ search: 'test', page: 1 })
        .expect(200);

      expect(response.body.results).toBeDefined();
      expect(Array.isArray(response.body.results)).toBe(true);
    });
  });

  afterAll(async () => {
    await app.close();

    const fs = require('fs');
    if (fs.existsSync('./test/test.sqlite')) {
        fs.unlinkSync('./test/test.sqlite');
    }

  });
});