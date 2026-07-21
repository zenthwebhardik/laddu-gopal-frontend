/* Validation Patterns */

export const VALIDATORS = {
  email: {
    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address (e.g., user@example.com)',
  },
  phone: {
    pattern: /^\+?[1-9]\d{6,14}$/,
    message: 'Please enter a valid phone number (7–15 digits, optional leading +)',
  },
  name: {
    pattern: /^[a-zA-Z\s'-]{2,50}$/,
    message: 'Name must be 2–50 characters (letters, spaces, hyphens, apostrophes only)',
  },
  message: {
    min: 10,
    max: 2000,
    message: 'Message must be between 10 and 2000 characters',
  },
  subject: {
    min: 3,
    max: 100,
    message: 'Subject must be between 3 and 100 characters',
  },
};

export function validateField(type, value) {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'This field is required' };
  }

  const validator = VALIDATORS[type];
  if (!validator) return { valid: true, error: '' };

  if (validator.pattern) {
    const isValid = validator.pattern.test(value.trim());
    return { valid: isValid, error: isValid ? '' : validator.message };
  }

  if (validator.min !== undefined) {
    const trimmed = value.trim();
    if (trimmed.length < validator.min || trimmed.length > validator.max) {
      return { valid: false, error: validator.message };
    }
    return { valid: true, error: '' };
  }

  return { valid: true, error: '' };
}

export function validateForm(fields) {
  const errors = {};
  let isValid = true;

  for (const [key, { type, value }] of Object.entries(fields)) {
    const result = validateField(type, value);
    if (!result.valid) {
      errors[key] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}
