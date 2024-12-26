import React from 'react';
import { Home, Calendar, Tag, Users, Book, Bell, BarChart, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home' },
  { icon: Calendar, label: 'Calendar', active: true },
  { icon: Tag, label: 'Services' },
  { icon: Users, label: 'Clients' },
  { icon: Book, label: 'Bookings' },
  { icon: Bell, label: 'Notifications' },
  { icon: BarChart, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-16 bg-primary-navy flex flex-col items-center py-6 space-y-8 fixed left-0 top-0 h-full z-50">
      {menuItems.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          className={`p-3 rounded-xl transition-colors ${
            active 
              ? 'bg-primary-gold text-white' 
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </aside>
  );
}