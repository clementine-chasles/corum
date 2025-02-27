"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const zod_1 = __importDefault(require("zod"));
const userSchema = zod_1.default.object({
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    email: zod_1.default.string(),
});
const userSchemaIn = zod_1.default.object(Object.assign(Object.assign({}, userSchema.shape), { dateOfBirth: zod_1.default.string() }));
const userSchemaOut = zod_1.default.object(Object.assign(Object.assign({}, userSchema.shape), { id: zod_1.default.string(), dateOfBirth: zod_1.default.string() }));
const routes = async (fastify) => {
    // fastify.route({
    //   method: 'GET',
    //   url: '/health',
    //   handler: (req, res) => {
    //     res.send('OK');
    //   },
    // });
    fastify.withTypeProvider().route({
        method: 'GET',
        url: '/users',
        schema: {
            response: {
                200: zod_1.default.array(userSchemaOut),
            },
        },
        handler: async (req, res) => {
            const users = await fastify.userRepository.getUsers();
            res.send(users);
        },
    });
    fastify.withTypeProvider().route({
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
    fastify.withTypeProvider().route({
        method: 'PATCH',
        url: '/users/:id',
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            body: userSchemaIn,
            response: {
                204: zod_1.default.undefined(),
            },
        },
        handler: async (req, res) => {
            await fastify.userRepository.updateUser(req.params.id, req.body);
            res.send({});
        },
    });
    fastify.withTypeProvider().route({
        method: 'DELETE',
        url: '/users/:id',
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            response: {
                204: zod_1.default.undefined(),
            },
        },
        handler: async (req, res) => {
            await fastify.userRepository.deleteUser(req.params.id);
            res.send({});
        },
    });
};
exports.routes = routes;
