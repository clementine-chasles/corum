import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';
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

export default class UserRepository {
  constructor(private drizzle: NodePgDatabase) {}

  async getUsers(): Promise<UserModel[]> {
    const res = await this.drizzle.select().from(usersTable);
    if (res.length === 0) return [];
    return res;
  }

  async createUser(user: UserToCreate): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
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
    const passwordsMatch = await bcrypt.compare(user.password, userInDb.password);
    if (!passwordsMatch) {
      throw new Error('Wrong password');
    }
    const { password: _pwd, ...userWithoutPassword } = userInDb;
    return userWithoutPassword;
  }
}
