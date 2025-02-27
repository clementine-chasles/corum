import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { UserModel } from '../model/User';
import { usersTable } from '../db/schema';
import {eq} from "drizzle-orm";

interface UserToCreateOrUpdate extends Omit<UserModel, 'id'> {}

export default class UserRepository {
  constructor(private drizzle: NodePgDatabase) {}

  async getUsers(): Promise<UserModel[]> {
    const res = await this.drizzle.select().from(usersTable);
    if (res.length === 0) return [];
    return res;
  }

  async createUser(user: UserToCreateOrUpdate): Promise<UserModel> {
    const res = await this.drizzle.insert(usersTable).values(user).returning();
    return res[0];
  }

  async updateUser(id: string, user: UserToCreateOrUpdate): Promise<void> {
    await this.drizzle.update(usersTable)
        .set({ ...user })
        .where(eq(usersTable.id, id))
  }

  async deleteUser(id: string): Promise<void> {
    await this.drizzle.delete(usersTable)
        .where(eq(usersTable.id, id))
  }
}
