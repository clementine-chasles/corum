"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const repository_1 = require("./plugins/repository");
const routes_1 = require("./routes");
const app = async (fastify) => {
    fastify.register(repository_1.repositoryPlugin);
    fastify.register(routes_1.routes, { prefix: '/api' });
};
exports.app = app;
