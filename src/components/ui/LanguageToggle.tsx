import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../utils/language';

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  tr: 'Türkçe',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский'
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.language-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative language-toggle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded bg-background/50 hover:bg-background/80 transition-colors"
        aria-label="Select language"
      >
        <span className="text-sm font-medium text-primary-navy dark:text-white">
          {language.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-40 bg-white dark:bg-primary-navy shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code as Language);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 ${
                language === code ? 'text-primary-gold' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}