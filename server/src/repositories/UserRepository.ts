import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';

import { asc, desc, eq, like, or } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';
import { UserModel } from '../model/User';
import { usersTable } from '../db/schema';

const SALT_ROUNDS = 10;

interface UserLogin {
  email: string;
  password: string;
}

interface UserToCreate extends Omit<UserModel, 'id'> {}
interface UserToUpdate extends Omit<UserModel, 'id' | 'password'> {}

interface User extends Omit<UserModel, 'password'> {}
interface GetUsersProps {
  search?: string;
  orderBy?: string;
  order?: string;
}

export default class UserRepository {
  constructor(private drizzle: NodePgDatabase) {}

  async getUsers(props?: GetUsersProps): Promise<UserModel[]> {
    const { search, order, orderBy } = props || {};
    const likeQuery = `%${search}%`;
    const sortFunction = order === 'desc' ? desc : asc;
    const sortAttribute: PgColumn = orderBy
      ? (usersTable[orderBy as keyof typeof usersTable] as PgColumn)
      : usersTable.email;
    const res = await this.drizzle
      .select()
      .from(usersTable)
      .where(
        or(
          ...[
            ...(search ? [like(usersTable.email, likeQuery)] : []),
            ...(search ? [like(usersTable.firstName, likeQuery)] : []),
            ...(search ? [like(usersTable.lastName, likeQuery)] : []),
          ],
        ),
      )
      .orderBy(sortFunction(sortAttribute));
    if (res.length === 0) return [];
    return res;
  }

  async createUser(user: UserToCreate): Promise<User> {
    const hashedPassword = user.password ? await bcrypt.hash(user.password, SALT_ROUNDS) : undefined;
    const res = await this.drizzle
      .insert(usersTable)
      .values({ ...user, password: hashedPassword })
      .returning();
    const { password: _pwd, ...createdUser } = res[0];
    return createdUser;
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    const res = await this.drizzle.select().from(usersTable).where(eq(usersTable.email, email));
    return res?.[0];
  }

  async getUserById(id: string): Promise<UserModel> {
    const res = await this.drizzle.select().from(usersTable).where(eq(usersTable.id, id));
    return res?.[0];
  }

  async updateUser(id: string, user: UserToUpdate): Promise<void> {
    await this.drizzle
      .update(usersTable)
      .set({ ...user })
      .where(eq(usersTable.id, id));
  }

  async deleteUser(id: string): Promise<void> {
    await this.drizzle.delete(usersTable).where(eq(usersTable.id, id));
  }

  async login(user: UserLogin): Promise<User> {
    const userInDb = await this.getUserByEmail(user.email);
    if (!user.password || !userInDb.password) {
      throw new Error('Wrong credentials');
    }
    const passwordsMatch = await bcrypt.compare(user.password, userInDb.password);
    if (!passwordsMatch) {
      throw new Error('Wrong credentials');
    }
    const { password: _pwd, ...userWithoutPassword } = userInDb;
    return userWithoutPassword;
  }
}
