"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class UserRepository {
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    async getUsers() {
        const res = await this.drizzle.select().from(schema_1.usersTable);
        if (res.length === 0)
            return [];
        return res;
    }
    async createUser(user) {
        const res = await this.drizzle.insert(schema_1.usersTable).values(user).returning();
        return res[0];
    }
    async updateUser(id, user) {
        await this.drizzle.update(schema_1.usersTable)
            .set(Object.assign({}, user))
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
    }
    async deleteUser(id) {
        await this.drizzle.delete(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
    }
}
exports.default = UserRepository;
