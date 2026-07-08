import AsyncStorage from '@react-native-async-storage/async-storage';
import { findAccountByEmail, createAccount } from './mock-user-store';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('createAccount + findAccountByEmail', () => {
  it('returns null when no account exists for the email', async () => {
    expect(await findAccountByEmail('nobody@example.com')).toBeNull();
  });

  it('finds a created account by exact email', async () => {
    await createAccount({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });

    expect(await findAccountByEmail('john@example.com')).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });
  });

  it('finds an account case-insensitively', async () => {
    await createAccount({
      name: 'John Doe',
      email: 'john@Example.com',
      password: 'password',
    });

    expect(await findAccountByEmail('john@example.com')).not.toBeNull();
    expect(await findAccountByEmail('JOHN@EXAMPLE.COM')).not.toBeNull();
  });

  it('trims whitespace from the stored email', async () => {
    await createAccount({
      name: 'John Doe',
      email: '  john@example.com  ',
      password: 'password',
    });

    const found = await findAccountByEmail('john@example.com');
    expect(found?.email).toBe('john@example.com');
  });

  it('stores multiple accounts independently', async () => {
    await createAccount({
      name: 'John',
      email: 'John@example.com',
      password: 'pw1',
    });
    await createAccount({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'pw2',
    });

    expect((await findAccountByEmail('john@example.com'))?.name).toBe('John');
    expect((await findAccountByEmail('bob@example.com'))?.name).toBe('Bob');
  });
});
