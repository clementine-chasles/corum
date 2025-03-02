import { type InferSelectModel } from 'drizzle-orm';
import { usersTable } from '../db/schema';

export type UserModel = InferSelectModel<typeof usersTable>;
