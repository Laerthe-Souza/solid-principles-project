import supertest from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { connectToDatabase } from '@shared/infra/typeorm';

const server = supertest(app);

let connection: Connection;

describe('AuthenticateUserController', () => {
  beforeAll(async () => {
    connection = await connectToDatabase();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should be able to authenticate a user', async () => {
    await server.post('/users').send({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    const response = await server.post('/authentications').send({
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate a user with non existing email', async () => {
    const response = await server.post('/authentications').send({
      email: 'invalid-email@teste.com.br',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    const response = await server.post('/authentications').send({
      email: 'johndoe@teste.com.br',
      password: 'wrong-password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
