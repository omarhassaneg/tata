import React, { useState, useRef, useEffect } from 'react';

interface EditableValueProps {
  value: string | number;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  helperText?: string;
}

export function EditableValue({ value, onChange, prefix, suffix, min, max, helperText }: EditableValueProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    let newValue = localValue;
    
    if (min !== undefined || max !== undefined) {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) newValue = min.toString();
        if (max !== undefined && numValue > max) newValue = max.toString();
      }
    }
    
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-32 text-2xl font-semibold bg-primary-gold/10 dark:bg-white/10 rounded-lg focus:outline-none text-center text-primary-gold dark:text-white"
      />
    );
  }

  return (
    <div className="inline-flex flex-col items-center">
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
        {prefix}
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 rounded-lg bg-primary-gold/10 dark:bg-white/10 text-primary-gold dark:text-white text-2xl transition-colors"
        >
          {value}
        </button>
        {suffix}
      </span>
    </div>
  );
}