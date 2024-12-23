import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  icon?: LucideIcon;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  icon: Icon,
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'w-full flex items-center justify-center gap-3 px-8 py-4 rounded transition-colors text-lg font-medium';
  const variants = {
    primary: 'bg-primary-navy text-white hover:bg-opacity-90 dark:bg-primary-gold dark:hover:bg-primary-gold/90',
    outline: 'border-2 border-gray-200 dark:border-gray-700 hover:border-primary-gold dark:hover:border-primary-gold text-gray-900 dark:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 ${
        checked ? 'bg-primary-gold' : 'bg-gray-200'
      }`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded bg-white transition-transform`}
      />
    </button>
  );
}