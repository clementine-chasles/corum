import fastifyPlugin from 'fastify-plugin';
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

export const jwtPlugin = fastifyPlugin<FastifyJWTOptions>(
  async (fastify: FastifyInstance, options: FastifyJWTOptions) => {
    fastify.register(fastifyJwt, options);
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        console.log(error);
        reply.status(401).send({});
      }
    });
  },
);
