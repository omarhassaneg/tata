import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-background/50 hover:bg-background/80 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-primary-navy dark:text-white" />
      ) : (
        <Sun className="w-5 h-5 text-primary-navy dark:text-white" />
      )}
    </button>
  );
}