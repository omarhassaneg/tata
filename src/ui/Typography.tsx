import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Heading({ children, className = '' }: TextProps) {
  return (
    <h1 className={`text-3xl font-bold text-primary dark:text-white ${className}`}>
      {children}
    </h1>
  );
}

export function Text({ children, className = '', as = 'p' }: TextProps) {
  const Component = as;
  return (
    <Component className={`text-secondary dark:text-gray-300 text-lg ${className}`}>
      {children}
    </Component>
  );
}