import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-[7.5px] sm:px-4 md:px-6 py-3 flex justify-end gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}