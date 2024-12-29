import React from 'react';
import { motion } from 'framer-motion';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ isOpen, onClose, children, className = '' }: DropdownProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute z-10 w-full mt-2 bg-white dark:bg-primary-navy/95 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface DropdownItemProps {
  onClick: () => void;
  selected?: boolean;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function DropdownItem({ onClick, selected, children, description, className = '' }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/10 transition-colors
        ${selected ? 'bg-primary-gold/10 dark:bg-white/10' : ''} ${className}`}
    >
      <div className="font-medium text-gray-900 dark:text-white">{children}</div>
      {description && (
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      )}
    </button>
  );
}
