import { FastifyInstance } from 'fastify/types/instance';
import { repositoryPlugin } from './plugins/repository';
import { jwtPlugin } from './plugins/jwt';
import { routes } from './routes';

export const app = async (fastify: FastifyInstance) => {
  fastify.register(repositoryPlugin);
  fastify.register(jwtPlugin, {
    secret: process.env.JWT_SECRET as string,
  });
  fastify.register(routes, { prefix: '/api' });
};
