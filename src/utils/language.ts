import { detectCountry } from '../utils/geolocation';

export type Language = 'en' | 'tr' | 'fr' | 'es' | 'ru';

const LANGUAGE_MAPPINGS: Record<string, Language> = {
  // Turkish
  'TR': 'tr', // Turkey
  'AZ': 'tr', // Azerbaijan

  // French
  'FR': 'fr', // France

  // Russian
  'RU': 'ru', // Russia
  'KZ': 'ru', // Kazakhstan
  'KG': 'ru', // Kyrgyzstan
  'TJ': 'ru', // Tajikistan
  'UZ': 'ru', // Uzbekistan
  'TM': 'ru', // Turkmenistan

  // Spanish (all Spanish-speaking countries)
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  // Add more Spanish-speaking countries as needed
};

export async function detectUserLanguage(): Promise<Language> {
  try {
    // First try to get country from IP
    let country = await detectCountry();
    console.log('Detected country:', country);

    // Convert to uppercase to match our mappings
    country = country.toUpperCase();

    // Check if we have a mapping for this country
    if (LANGUAGE_MAPPINGS[country]) {
      console.log('Found language mapping for country:', country, LANGUAGE_MAPPINGS[country]);
      return LANGUAGE_MAPPINGS[country];
    }

    // Fall back to browser language
    const browserLang = navigator.language.split('-')[0];
    console.log('Falling back to browser language:', browserLang);
    if (['en', 'tr', 'fr', 'es', 'ru'].includes(browserLang)) {
      return browserLang as Language;
    }

    // Default to English
    console.log('No matching language found, defaulting to English');
    return 'en';
  } catch (error) {
    console.warn('Failed to detect language:', error);
    return 'en';
  }
}