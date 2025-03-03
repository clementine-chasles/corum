import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { FastifyInstance } from 'fastify/types/instance';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

const userSchemaPatchIn = z.object({
  ...userSchema.shape,
  dateOfBirth: z.string(),
});

const userSchemaIn = z.object({
  ...userSchemaPatchIn.shape,
  password: z.string().nullable(),
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
    method: 'POST',
    url: '/login',
    schema: {
      body: loginSchema,
      response: {
        200: z.object({
          jwt: z.string(),
        }),
      },
    },
    handler: async (req, res) => {
      const user = await fastify.userRepository.login(req.body);
      const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.code(200).send({ jwt: token });
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    onRequest: [fastify.authenticate],
    schema: {
      querystring: z.object({
        search: z.string().optional(),
        order: z.string().optional(),
        orderBy: z.string().optional(),
      }),
      response: {
        200: z.array(userSchemaOut),
      },
    },
    handler: async (req, res) => {
      const users = await fastify.userRepository.getUsers(req.query);
      res.send(users);
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users/:id',
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: userSchemaOut,
        404: z.undefined(),
      },
    },
    handler: async (req, res) => {
      const user = await fastify.userRepository.getUserById(req.params.id);
      if (user) {
        res.send(user);
      } else {
        res.code(404).send(undefined);
      }
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
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string() }),
      body: userSchemaPatchIn,
      response: {
        204: z.undefined(),
      },
    },
    handler: async (req, res) => {
      await fastify.userRepository.updateUser(req.params.id, req.body);
      res.code(204).send();
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/users/:id',
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        204: z.undefined(),
      },
    },
    handler: async (req, res) => {
      await fastify.userRepository.deleteUser(req.params.id);
      res.code(204).send(undefined);
    },
  });
};
