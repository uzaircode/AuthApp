import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredAccount } from '../types/auth';

const ACCOUNTS_KEY = 'mockAccounts';

// NOTE: This simulates a backend user table using AsyncStorage.
// Passwords are stored as-is only because this is a mock with no real
// backend — in production, passwords are hashed server-side and never
// touch the client in plain text.
async function getAccounts(): Promise<StoredAccount[]> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function findAccountByEmail(email: string): Promise<StoredAccount | null> {
  const accounts = await getAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  return accounts.find((a) => a.email.toLowerCase() === normalizedEmail) ?? null;
}

export async function createAccount(account: StoredAccount): Promise<void> {
  const accounts = await getAccounts();
  accounts.push({ ...account, email: account.email.trim() });
  await saveAccounts(accounts);
}
