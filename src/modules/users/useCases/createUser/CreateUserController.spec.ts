import supertest from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { connectToDatabase } from '@shared/infra/typeorm';

const server = supertest(app);

let connection: Connection;

describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await connectToDatabase();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await server.post('/users').send({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', async () => {
    await server.post('/users').send({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    const response = await server.post('/users').send({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });
});
