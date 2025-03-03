import { date, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  dateOfBirth: date().notNull(),
});
