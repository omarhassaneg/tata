import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        className={`px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded focus:border-primary-gold focus:ring-0 text-lg bg-white dark:bg-primary-navy/50 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
          error ? 'border-red-500' : ''
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}