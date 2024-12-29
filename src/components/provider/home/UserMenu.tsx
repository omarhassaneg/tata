import React from 'react';
import { ChevronDown } from 'lucide-react';

interface UserMenuProps {
  name: string;
  avatar?: string;
}

export function UserMenu({ name, avatar }: UserMenuProps) {
  return (
    <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg">
      {avatar ? (
        <img 
          src={avatar} 
          alt={name}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary-gold/10 text-primary-gold flex items-center justify-center font-medium">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      )}
      <span className="text-sm font-medium">{name}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}