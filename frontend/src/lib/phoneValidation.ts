// Phone number validation utilities

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

// Common country codes and their validation patterns
const COUNTRY_PATTERNS: Record<string, { pattern: RegExp; minLength: number; maxLength: number; example: string }> = {
  '+1': { pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/, minLength: 10, maxLength: 10, example: '5551234567' }, // US/Canada
  '+52': { pattern: /^[2-9]\d{9}$/, minLength: 10, maxLength: 10, example: '5512345678' }, // Mexico
  '+44': { pattern: /^[1-9]\d{8,9}$/, minLength: 9, maxLength: 10, example: '2012345678' }, // UK
  '+33': { pattern: /^[1-9]\d{8}$/, minLength: 9, maxLength: 9, example: '123456789' }, // France
  '+49': { pattern: /^[1-9]\d{10,11}$/, minLength: 11, maxLength: 12, example: '30123456789' }, // Germany
  '+81': { pattern: /^[1-9]\d{9,10}$/, minLength: 10, maxLength: 11, example: '9012345678' }, // Japan
  '+86': { pattern: /^1[3-9]\d{9}$/, minLength: 11, maxLength: 11, example: '13812345678' }, // China
  '+91': { pattern: /^[6-9]\d{9}$/, minLength: 10, maxLength: 10, example: '9876543210' }, // India
  '+61': { pattern: /^[2-9]\d{8}$/, minLength: 9, maxLength: 9, example: '412345678' }, // Australia
  '+55': { pattern: /^[1-9]\d{10}$/, minLength: 11, maxLength: 11, example: '11987654321' }, // Brazil
  '+7': { pattern: /^[3-9]\d{9}$/, minLength: 10, maxLength: 10, example: '9123456789' }, // Russia
};

// Generic phone number pattern (digits only)
const GENERIC_PHONE_PATTERN = /^\d{7,15}$/;

/**
 * Validates a phone number with country code
 */
export function validatePhoneNumber(phoneNumber: string, countryCode: string): PhoneValidationResult {
  // Remove all non-digit characters except +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

  // If empty, it's valid (optional field)
  if (!cleanPhone) {
    return { isValid: true };
  }

  // Check if country code is valid
  if (!countryCode || !countryCode.startsWith('+')) {
    return {
      isValid: false,
      error: 'Please enter a valid country code (e.g., +1, +44)'
    };
  }

  // Get validation pattern for the country code
  const countryPattern = COUNTRY_PATTERNS[countryCode];

  if (countryPattern) {
    // Use specific country pattern
    if (!countryPattern.pattern.test(cleanPhone)) {
      return {
        isValid: false,
        error: `Invalid phone number format for ${countryCode}. Example: ${countryPattern.example}`
      };
    }

    if (cleanPhone.length < countryPattern.minLength || cleanPhone.length > countryPattern.maxLength) {
      return {
        isValid: false,
        error: `Phone number must be ${countryPattern.minLength}-${countryPattern.maxLength} digits for ${countryCode}`
      };
    }
  } else {
    // Use generic pattern for unknown country codes
    if (!GENERIC_PHONE_PATTERN.test(cleanPhone)) {
      return {
        isValid: false,
        error: 'Phone number must contain 7-15 digits'
      };
    }
  }

  return {
    isValid: true,
    formatted: formatPhoneNumber(cleanPhone, countryCode)
  };
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  if (!cleanPhone) return '';

  // Format based on country code
  switch (countryCode) {
    case '+1': // US/Canada format: (XXX) XXX-XXXX
      if (cleanPhone.length === 10) {
        return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
      }
      break;
    case '+52': // Mexico format: XX XXXX XXXX
      if (cleanPhone.length === 10) {
        return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
    case '+44': // UK format: XXXX XXX XXX
      if (cleanPhone.length >= 9) {
        return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
      }
      break;
    case '+33': // France format: XX XX XX XX XX
      if (cleanPhone.length === 9) {
        return cleanPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})/, '$1 $2 $3 $4 $5');
      }
      break;
    case '+49': // Germany format: XXX XXXXXXXX
      if (cleanPhone.length >= 11) {
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
      }
      break;
    case '+86': // China format: XXX XXXX XXXX
      if (cleanPhone.length === 11) {
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
      }
      break;
    case '+91': // India format: XXXXX XXXXX
      if (cleanPhone.length === 10) {
        return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
      }
      break;
    default:
      // Generic formatting: add spaces every 3 digits
      return cleanPhone.replace(/(\d{3})(?=\d)/g, '$1 ');
  }

  return cleanPhone;
}

/**
 * Validates country code format
 */
export function validateCountryCode(countryCode: string): PhoneValidationResult {
  if (!countryCode) {
    return { isValid: false, error: 'Country code is required' };
  }

  // Must start with + and contain only digits
  if (!/^\+\d{1,3}$/.test(countryCode)) {
    return {
      isValid: false,
      error: 'Country code must start with + and contain 1-3 digits (e.g., +1, +44, +123)'
    };
  }

  return { isValid: true };
}

/**
 * Gets available country codes for dropdown
 */
export function getAvailableCountryCodes(): Array<{ code: string; name: string; flag: string }> {
  return [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
  ];
}

/**
 * Auto-formats phone number as user types
 */
export function formatPhoneNumberAsTyped(value: string, countryCode: string): string {
  const cleanValue = value.replace(/\D/g, '');

  if (!cleanValue) return '';

  // Limit length based on country
  const countryPattern = COUNTRY_PATTERNS[countryCode];
  const maxLength = countryPattern?.maxLength || 15;

  const limitedValue = cleanValue.slice(0, maxLength);

  // Apply formatting based on country
  switch (countryCode) {
    case '+1': // US/Canada: (XXX) XXX-XXXX
      if (limitedValue.length <= 3) return limitedValue;
      if (limitedValue.length <= 6) return `(${limitedValue.slice(0, 3)}) ${limitedValue.slice(3)}`;
      return `(${limitedValue.slice(0, 3)}) ${limitedValue.slice(3, 6)}-${limitedValue.slice(6)}`;

    case '+52': // Mexico: XX XXXX XXXX
      if (limitedValue.length <= 2) return limitedValue;
      if (limitedValue.length <= 6) return `${limitedValue.slice(0, 2)} ${limitedValue.slice(2)}`;
      return `${limitedValue.slice(0, 2)} ${limitedValue.slice(2, 6)} ${limitedValue.slice(6)}`;

    case '+44': // UK: XXXX XXX XXX
      if (limitedValue.length <= 4) return limitedValue;
      if (limitedValue.length <= 7) return `${limitedValue.slice(0, 4)} ${limitedValue.slice(4)}`;
      return `${limitedValue.slice(0, 4)} ${limitedValue.slice(4, 7)} ${limitedValue.slice(7)}`;

    case '+91': // India: XXXXX XXXXX
      if (limitedValue.length <= 5) return limitedValue;
      return `${limitedValue.slice(0, 5)} ${limitedValue.slice(5)}`;

    default:
      // Generic: add spaces every 3 digits
      return limitedValue.replace(/(\d{3})(?=\d)/g, '$1 ');
  }
}
