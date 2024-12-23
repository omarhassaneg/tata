import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Settings, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium bg-primary-navy text-white rounded-lg">
            Today
          </button>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">Sat 21 Dec</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <span className="text-sm font-medium">Scheduled team</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}