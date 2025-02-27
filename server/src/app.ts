import { FastifyInstance } from 'fastify/types/instance';
import { repositoryPlugin } from './plugins/repository';
import { routes } from './routes';

export const app = async (fastify: FastifyInstance) => {
  fastify.register(repositoryPlugin);
  fastify.register(routes, { prefix: '/api' });
};
