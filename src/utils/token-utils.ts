import { AuthData } from '../types/auth';

const SESSION_TTL_MINUTES = 15;

export function generateMockToken(prefix: string): string {
  const random = Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${random}`;
}

export function getExpiryTimestamp(minutesFromNow: number = SESSION_TTL_MINUTES): number {
  return Date.now() + minutesFromNow * 60 * 1000;
}

export function isExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

// Returns a fresh sessionToken + expiresAt, keeping the same refreshToken.
// Simulates what a POST /auth/refresh call would return in a real backend.
export function refreshAuthData(authData: AuthData): AuthData {
  return {
    ...authData,
    sessionToken: generateMockToken('access'),
    expiresAt: getExpiryTimestamp(),
  };
}
