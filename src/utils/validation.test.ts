import {
  isValidEmail,
  isValidPassword,
  validateLoginForm,
  validateSignupForm,
} from './validation';

describe('isValidEmail', () => {
  it.each([
    'user@example.com',
    'a.b+c@sub.example.co.uk',
    '  user@example.com  ',
  ])('accepts valid email: %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    '',
    'not-an-email',
    'user@',
    '@example.com',
    'user@example',
    'user example.com',
  ])('rejects invalid email: %s', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('rejects passwords shorter than 6 characters', () => {
    expect(isValidPassword('12345')).toBe(false);
  });

  it('accepts passwords of exactly 6 characters', () => {
    expect(isValidPassword('123456')).toBe(true);
  });

  it('accepts passwords longer than 6 characters', () => {
    expect(isValidPassword('a-very-long-password')).toBe(true);
  });
});

describe('validateLoginForm', () => {
  it('returns no errors for valid input', () => {
    expect(validateLoginForm('user@example.com', 'password')).toEqual({});
  });

  it('flags an empty email as required', () => {
    expect(validateLoginForm('', 'password').email).toBe('Email is required');
  });

  it('flags a malformed email', () => {
    expect(validateLoginForm('not-an-email', 'password').email).toBe(
      'Enter a valid email address',
    );
  });

  it('flags an empty password as required', () => {
    expect(validateLoginForm('user@example.com', '').password).toBe(
      'Password is required',
    );
  });
});

describe('validateSignupForm', () => {
  it('returns no errors for valid input', () => {
    expect(
      validateSignupForm('John Doe', 'john@example.com', 'password'),
    ).toEqual({});
  });

  it('flags an empty name as required', () => {
    expect(validateSignupForm('', 'john@example.com', 'password').name).toBe(
      'Name is required',
    );
  });

  it('flags an empty email as required', () => {
    expect(validateSignupForm('John', '', 'password').email).toBe(
      'Email is required',
    );
  });

  it('flags a malformed email', () => {
    expect(validateSignupForm('John', 'not-an-email', 'password').email).toBe(
      'Enter a valid email address',
    );
  });

  it('flags an empty password as required', () => {
    expect(validateSignupForm('John', 'john@example.com', '').password).toBe(
      'Password is required',
    );
  });

  it('flags a password below 6 characters', () => {
    expect(
      validateSignupForm('John', 'john@example.com', '12345').password,
    ).toBe('Password must be at least 6 characters');
  });
});
