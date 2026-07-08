import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthData, User } from '../types/auth';
import { findAccountByEmail, createAccount } from '../services/mock-user-store';
import {
  generateMockToken,
  getExpiryTimestamp,
  isExpired,
  refreshAuthData,
} from '../utils/token-utils';
import { devLog } from '../utils/logger';

const AUTH_KEY = 'authData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      devLog('[AuthContext] Restoring session...');
      try {
        const raw = await AsyncStorage.getItem(AUTH_KEY);
        if (!raw) {
          devLog('[AuthContext] No stored session found — staying logged out');
          setLoading(false);
          return;
        }

        let authData: AuthData = JSON.parse(raw);
        devLog('[AuthContext] Stored session found for:', authData.user.email);

        if (isExpired(authData.expiresAt)) {
          devLog('[AuthContext] Session token expired — refreshing silently');
          authData = refreshAuthData(authData);
          await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
          devLog(
            '[AuthContext] Session refreshed, new expiresAt:',
            authData.expiresAt,
          );
        } else {
          devLog(
            '[AuthContext] Session still valid, expiresAt:',
            authData.expiresAt,
          );
        }

        setUser(authData.user);
        devLog('[AuthContext] User restored:', authData.user);
      } catch (err) {
        devLog(
          '[AuthContext] Failed to restore session, clearing storage:',
          err,
        );
        await AsyncStorage.removeItem(AUTH_KEY);
      } finally {
        setLoading(false);
        devLog('[AuthContext] Session restore complete');
      }
    };

    restoreSession();
  }, []);

  async function persistSession(user: User): Promise<void> {
    const authData: AuthData = {
      user,
      sessionToken: generateMockToken('access'),
      refreshToken: generateMockToken('refresh'),
      expiresAt: getExpiryTimestamp(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    devLog('[AuthContext] Session persisted for:', user.email, authData);
  }

  async function login(email: string, password: string): Promise<void> {
    devLog('[AuthContext] Login attempt:', email);
    const account = await findAccountByEmail(email);

    if (!account || account.password !== password) {
      devLog('[AuthContext] Login failed for:', email);
      throw new Error('Invalid email or password');
    }

    const loggedInUser: User = { name: account.name, email: account.email };
    await persistSession(loggedInUser);
    setUser(loggedInUser);
    devLog('[AuthContext] Login success:', loggedInUser);
  }

  async function signup(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    devLog('[AuthContext] Signup attempt:', email);
    const existing = await findAccountByEmail(email);
    if (existing) {
      devLog('[AuthContext] Signup failed — email already exists:', email);
      throw new Error('An account with this email already exists');
    }

    await createAccount({ name: name.trim(), email, password });
    devLog('[AuthContext] Account created:', email);

    const newUser: User = { name: name.trim(), email: email.trim() };
    await persistSession(newUser);
    setUser(newUser);
    devLog('[AuthContext] Signup success:', newUser);
  }

  async function logout(): Promise<void> {
    devLog('[AuthContext] Logging out:', user?.email);
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
    devLog('[AuthContext] Logout complete');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
