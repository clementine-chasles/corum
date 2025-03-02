import supertest from 'supertest';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { app } from '../../src/app';

describe('GET `/api/health` route', () => {
  const fastify = Fastify();
  app(fastify);
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  afterEach(async () => {
    await fastify.close();
  });

  beforeAll(async () => {
    await fastify.ready();
  });

  it('should return OK', async () => {
    const response = await supertest(fastify.server)
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8');
    expect(response.text).toEqual('OK');
  });
});
