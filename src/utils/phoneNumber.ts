import { parsePhoneNumber as parseLibPhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export function parsePhoneNumber(value: string) {
  try {
    const phoneNumber = parseLibPhoneNumber(value);
    if (phoneNumber) {
      return {
        country: phoneNumber.country || 'US',
        nationalNumber: phoneNumber.nationalNumber
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function formatPhoneNumber(value: string, countryCode: string = 'US'): string {
  try {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // If empty, return empty string
    if (!numericValue) return '';

    // Format the phone number based on country
    const phoneNumber = parseLibPhoneNumber(numericValue, countryCode);
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    }
    
    return numericValue;
  } catch (error) {
    return value;
  }
}

export function validatePhoneNumber(value: string, countryCode: string = 'US'): boolean {
  try {
    return isValidPhoneNumber(value, countryCode);
  } catch (error) {
    return false;
  }
}

export function normalizePhoneNumber(value: string, countryCode: string = 'US'): string {
  try {
    const phoneNumber = parseLibPhoneNumber(value, countryCode);
    if (phoneNumber) {
      // Returns format like +16476863366
      return phoneNumber.format('E.164');
    }
    return value;
  } catch (error) {
    return value;
  }
}