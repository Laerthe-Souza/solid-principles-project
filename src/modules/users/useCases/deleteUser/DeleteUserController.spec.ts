import supertest from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { connectToDatabase } from '@shared/infra/typeorm';

const server = supertest(app);

let connection: Connection;

let tokenTeste: string;

describe('DeleteUserController', () => {
  beforeAll(async () => {
    connection = await connectToDatabase();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should be able to delete a user', async () => {
    await server.post('/users').send({
      name: 'John Doe',
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    const authResponse = await server.post('/authentications').send({
      email: 'johndoe@teste.com.br',
      password: '123456',
    });

    tokenTeste = authResponse.body.token;

    const response = await server
      .delete('/users')
      .set('Authorization', `Bearer ${authResponse.body.token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a user with non existing id', async () => {
    const response = await server
      .delete('/users')
      .set('Authorization', `Bearer ${tokenTeste}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User does not exists');
  });

  it('should not be able to delete a user with invalid token', async () => {
    const response = await server
      .delete('/users')
      .set('Authorization', `Bearer invalid-token`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  it('should not be able to delete a user with missing token', async () => {
    const response = await server.delete('/users');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token not provided');
  });
});
