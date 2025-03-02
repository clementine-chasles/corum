import supertest from 'supertest';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import jwt from 'jsonwebtoken';
import { app } from '../../src/app';
import { clearDatabase } from '../test-utils';

describe('GET `/api/users` routes', () => {
  const fastify = Fastify();
  app(fastify);
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  const token = jwt.sign({}, process.env.JWT_SECRET!, { expiresIn: '1h' });

  beforeAll(async () => {
    await fastify.ready();
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await fastify.close();
  });

  let userId: string;

  it('should create user', async () => {
    const response = await supertest(fastify.server)
      .post('/api/users')
      .send({
        email: 'test@test.com',
        password: '12345678',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2020-01-01T00:00:00.000Z',
      })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.body).toEqual(
      expect.objectContaining({
        dateOfBirth: '2020-01-01',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        id: expect.any(String),
      }),
    );
    userId = response.body.id;
  });

  it('should reject login if credentials are wrong', async () => {
    await supertest(fastify.server)
      .post('/api/login')
      .send({ email: 'test@test.com', password: '123456789' })
      .expect(500)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should allow login', async () => {
    const response = await supertest(fastify.server)
      .post('/api/login')
      .send({ email: 'test@test.com', password: '12345678' })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
    const decodedToken = jwt.decode(response.body.jwt);
    expect(decodedToken).toEqual(
      expect.objectContaining({
        firstName: 'John',
      }),
    );
  });

  it('should reject with unauthorized for GET users/:id', async () => {
    await supertest(fastify.server).get(`/api/users/${userId}`).expect(401);
  });

  it('should return user', async () => {
    const response = await supertest(fastify.server)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.body).toEqual(
      expect.objectContaining({
        dateOfBirth: '2020-01-01',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        id: userId,
      }),
    );
  });

  it('should reject with unauthorized for PATCH users/:id', async () => {
    await supertest(fastify.server).patch(`/api/users/${userId}`).send({}).expect(401);
  });

  it('should update user', async () => {
    await supertest(fastify.server)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test2@test.com', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '2020-02-02T00:00:00.000Z' })
      .expect(204);
  });

  it('should reject with unauthorized for DELETE users/:id', async () => {
    await supertest(fastify.server).delete(`/api/users/${userId}`).send({}).expect(401);
  });

  it('should delete user', async () => {
    const response = await supertest(fastify.server)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    expect(response.body).toEqual({});
  });

  it('should not return user', async () => {
    await supertest(fastify.server).get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`).expect(404);
  });
});
