import {
  generateMockToken,
  getExpiryTimestamp,
  isExpired,
  refreshAuthData,
} from './token-utils';
import { AuthData } from '../types/auth';

describe('generateMockToken', () => {
  it('includes the given prefix', () => {
    expect(generateMockToken('access')).toMatch(/^access_/);
  });

  it('produces unique values on repeated calls', () => {
    const tokens = new Set(
      Array.from({ length: 100 }, () => generateMockToken('access')),
    );
    expect(tokens.size).toBe(100);
  });
});

describe('getExpiryTimestamp', () => {
  it('offsets from Date.now() by the given number of minutes', () => {
    const now = 1_700_000_000_000;
    jest.spyOn(Date, 'now').mockReturnValue(now);

    expect(getExpiryTimestamp(15)).toBe(now + 15 * 60 * 1000);

    jest.restoreAllMocks();
  });

  it('defaults to a 15 minute offset', () => {
    const now = 1_700_000_000_000;
    jest.spyOn(Date, 'now').mockReturnValue(now);

    expect(getExpiryTimestamp()).toBe(now + 15 * 60 * 1000);

    jest.restoreAllMocks();
  });
});

describe('isExpired', () => {
  const now = 1_700_000_000_000;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns false at the exact expiry timestamp', () => {
    expect(isExpired(now)).toBe(false);
  });

  it('returns false just before expiry', () => {
    expect(isExpired(now + 1)).toBe(false);
  });

  it('returns true just after expiry', () => {
    expect(isExpired(now - 1)).toBe(true);
  });
});

describe('refreshAuthData', () => {
  it('returns a new sessionToken and expiresAt, keeping refreshToken unchanged', () => {
    const now = 1_700_000_000_000;
    jest.spyOn(Date, 'now').mockReturnValue(now);

    const authData: AuthData = {
      user: { name: 'john', email: 'john@example.com' },
      sessionToken: 'access_old',
      refreshToken: 'refresh_stable',
      expiresAt: now - 1000,
    };

    const result = refreshAuthData(authData);

    expect(result.sessionToken).not.toBe(authData.sessionToken);
    expect(result.sessionToken).toMatch(/^access_/);
    expect(result.expiresAt).toBe(now + 15 * 60 * 1000);
    expect(result.refreshToken).toBe(authData.refreshToken);
    expect(result.user).toEqual(authData.user);

    jest.restoreAllMocks();
  });
});
