export type User = {
  name: string;
  email: string;
};

export type AuthData = {
  user: User;
  sessionToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type StoredAccount = {
  name: string;
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
