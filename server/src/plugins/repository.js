"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
exports.repositoryPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
    const userRepository = new UserRepository_1.default(db);
    fastify.decorate('userRepository', userRepository);
});
