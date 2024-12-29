import React from 'react';

interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">{text}</span>
        </div>
      )}
    </div>
  );
}