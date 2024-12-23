import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import ru from '../locales/ru.json';
import { detectUserLanguage, Language } from '../utils/language';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Translations = DeepPartial<typeof en>;
const DEFAULT_LANGUAGE: Language = 'en';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const translations: Record<Language, Translations> = { en, tr, es, fr, ru };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || DEFAULT_LANGUAGE;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Only detect if no language is saved
        if (!localStorage.getItem('language')) {
          console.log('No saved language found, detecting...');
          const detectedLang = await detectUserLanguage();
          console.log('Detected language:', detectedLang);
          setLanguage(detectedLang);
          localStorage.setItem('language', detectedLang);
        } else {
          console.log('Using saved language:', language);
        }
      } catch (error) {
        console.error('Language detection failed:', error);
        if (!localStorage.getItem('language')) {
          setLanguage(DEFAULT_LANGUAGE);
          localStorage.setItem('language', DEFAULT_LANGUAGE);
        }
      } finally {
        setIsLoading(false);
      }
    };

    detectLanguage();
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider 
      value={{ 
        language,
        translations: translations[language],
        setLanguage: handleSetLanguage,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

type TranslationKey = keyof typeof en;
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object
        ? `.${NestedKeys<T[K]> & string}`
        : ''}`;
    }[keyof T]
  : never;

type DotNotationKey = NestedKeys<typeof en>;

export function useTranslation() {
  const { translations, language } = useLanguage();
  
  return {
    t: (key: DotNotationKey) => {
      const keys = key.split('.');
      let value: any = translations;
      let fallback: any = en;
      
      for (const k of keys) {
        value = value?.[k];
        fallback = fallback?.[k];
      }
      
      return value || fallback || key;
    }
  };
}
