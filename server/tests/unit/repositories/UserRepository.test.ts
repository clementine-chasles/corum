import { NodePgDatabase , drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { UserModel } from '../../../src/model/User';
import { usersTable } from '../../../src/db/schema';
import UserRepository from '../../../src/repositories/UserRepository';

const user: UserModel = {
  id: '',
  firstName: 'John',
  lastName: 'Doe',
  password: '12345678',
  email: 'test@test.com',
  dateOfBirth: '2020-01-01T00:00:00.000Z',
};

const userToCreate = {
  firstName: 'John',
  lastName: 'Doe',
  password: '12345678',
  email: 'test@test.com',
  dateOfBirth: '2020-01-01T00:00:00.000Z',
};

describe('UsersRepository', () => {
  let repo: UserRepository; let db: NodePgDatabase;
  beforeEach(() => {
    db = drizzle('');
    repo = new UserRepository(db);
  });
  describe('getUsers', () => {
    it('should return empty array if no users are found', async () => {
      const select = jest.spyOn(db, 'select');
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue([]),
      });
      const users = await repo.getUsers();
      expect(users).toEqual([]);
    });
    it('should return users', async () => {
      const select = jest.spyOn(db, 'select');
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue([user]),
      });
      const users = await repo.getUsers();
      expect(users).toEqual([user]);
    });
  });
  describe('createUser', () => {
    it('should create a user without returning the password', async () => {
      const insert = jest.spyOn(db, 'insert');
      // @ts-ignore
      insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockReturnValue([user]),
        }),
      });
      const createdUser = await repo.createUser(userToCreate);
      expect(createdUser).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        dateOfBirth: '2020-01-01T00:00:00.000Z',
        id: expect.any(String),
      });
    });
  });
  describe('getUserById', () => {
    it('should return user', async () => {
      const select = jest.spyOn(db, 'select');
      const where = jest.fn().mockReturnValue([user]);
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where,
        }),
      });
      const foundUser = await repo.getUserById('id1');
      expect(foundUser).toEqual(user);
      expect(where).toHaveBeenCalledWith(eq(usersTable.id, 'id1'));
    });
  });
  describe('getUserByEmail', () => {
    it('should return user', async () => {
      const select = jest.spyOn(db, 'select');
      const where = jest.fn().mockReturnValue([user]);
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where,
        }),
      });
      const foundUser = await repo.getUserByEmail('test@test.com');
      expect(foundUser).toEqual(user);
      expect(where).toHaveBeenCalledWith(eq(usersTable.email, 'test@test.com'));
    });
  });
  describe('updateUser', () => {
    it('should update user', async () => {
      const update = jest.spyOn(db, 'update');
      const where = jest.fn().mockReturnValue({});
      // @ts-ignore
      update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where,
        }),
      });
      await repo.updateUser('id1', userToCreate);
      expect(where).toHaveBeenCalledWith(eq(usersTable.id, 'id1'));
    });
  });
  describe('deleteUser', () => {
    it('should delete user', async () => {
      const deleteMock = jest.spyOn(db, 'delete');
      const where = jest.fn().mockReturnValue({});
      // @ts-ignore
      deleteMock.mockReturnValue({
        where,
      });
      await repo.deleteUser('id1');
      expect(where).toHaveBeenCalledWith(eq(usersTable.id, 'id1'));
    });
  });
  describe('login', () => {
    it('should accept login and return user without the password', async () => {
      const select = jest.spyOn(db, 'select');
      const hashPassword = await bcrypt.hash(user.password, 10);
      const where = jest.fn().mockReturnValue([{ ...user, password: hashPassword }]);
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where,
        }),
      });
      const foundUser = await repo.login({ email: 'test@test.com', password: '12345678' });
      const { password: _pwd, ...rest } = user;
      expect(foundUser).toEqual(rest);
    });
    it('should reject login with wrong credentials', async () => {
      const select = jest.spyOn(db, 'select');
      const hashPassword = await bcrypt.hash(user.password, 10);
      const where = jest.fn().mockReturnValue([{ ...user, password: hashPassword }]);
      // @ts-ignore
      select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where,
        }),
      });
      await expect(repo.login({ email: 'test@test.com', password: '123' })).rejects.toThrow('Wrong password');
    });
  });
});
