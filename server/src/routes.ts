import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { FastifyInstance } from 'fastify/types/instance';

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

const userSchemaIn = z.object({
  ...userSchema.shape,
  dateOfBirth: z.string(),
});

const userSchemaOut = z.object({
  ...userSchema.shape,
  id: z.string(),
  dateOfBirth: z.string(),
});

export const routes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    handler: (req, res) => {
      res.send('OK');
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    schema: {
      response: {
        200: z.array(userSchemaOut),
      },
    },
    handler: async (req, res) => {
      const users = await fastify.userRepository.getUsers();
      res.send(users);
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/users',
    schema: {
      body: userSchemaIn,
      response: {
        201: userSchemaOut,
      },
    },
    handler: async (req, res) => {
      const user = await fastify.userRepository.createUser(req.body);
      res.send(user);
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:id',
    schema: {
      params: z.object({ id: z.string() }),
      body: userSchemaIn,
      response: {
        204: z.undefined(),
      },
    },
    handler: async (req, res) => {
      await fastify.userRepository.updateUser(req.params.id, req.body);
      res.send({});
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/users/:id',
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        204: z.undefined(),
      },
    },
    handler: async (req, res) => {
      await fastify.userRepository.deleteUser(req.params.id);
      res.send({});
    },
  });
};
