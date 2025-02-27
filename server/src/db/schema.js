"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    firstName: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    dateOfBirth: (0, pg_core_1.date)().notNull(),
});
