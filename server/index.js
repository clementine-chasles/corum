"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const app_1 = require("./src/app");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const server = (0, fastify_1.default)();
server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
server.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'SampleApi',
            description: 'Sample backend service',
            version: '1.0.0',
        },
        servers: [],
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform
});
server.register(swagger_ui_1.default, {
    routePrefix: '/documentation',
});
server.setErrorHandler((err, req, reply) => {
    console.log('???', err);
    if ((0, fastify_type_provider_zod_1.hasZodFastifySchemaValidationErrors)(err)) {
        return reply.code(400).send({
            error: 'Response Validation Error',
            message: "Request doesn't match the schema",
            statusCode: 400,
            details: {
                issues: err.validation,
                method: req.method,
                url: req.url,
            },
        });
    }
    return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Something went wrong',
        statusCode: 500,
    });
});
server.register(app_1.app);
server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
