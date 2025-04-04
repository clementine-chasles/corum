import fp from 'fastify-plugin';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { FastifyInstance } from 'fastify/types/instance';
import { FastifyReply, FastifyRequest } from 'fastify';
import UserRepository from '../repositories/UserRepository';

declare module 'fastify' {
  interface FastifyInstance {
    userRepository: UserRepository;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => void;
  }
}

export const repositoryPlugin = fp(async (fastify: FastifyInstance) => {
  const db = drizzle(process.env.DATABASE_URL!);
  const userRepository = new UserRepository(db);
  fastify.decorate('userRepository', userRepository);
});
