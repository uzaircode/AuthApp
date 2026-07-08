const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export type LoginFormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function validateLoginForm(
  email: string,
  password: string,
): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export type SignupFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

export function validateSignupForm(
  name: string,
  email: string,
  password: string,
): SignupFormErrors {
  const errors: SignupFormErrors = {};

  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password.trim()) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password.trim())) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}
