import React from 'react';

interface TimeSlot {
  time: string;
  format: string;
}

const timeSlots: TimeSlot[] = Array.from({ length: 13 }, (_, i) => ({
  time: `${i + 2}:00`,
  format: 'pm'
}));

const team = [
  { id: 'DK', name: 'Didar Kursun', initials: 'DK', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'OH', name: 'Omarov Hassanov', initials: 'OH', color: 'bg-purple-100 text-purple-600' },
  { id: 'WS', name: 'Wendy Smith', initials: 'WS', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }
];

export function Calendar() {
  return (
    <div className="relative min-w-[800px]">
      {/* Team Header */}
      <div className="grid grid-cols-[auto_repeat(3,1fr)] border-b border-gray-200">
        <div className="w-20 py-4 px-4 text-sm text-gray-500" />
        {team.map((member) => (
          <div key={member.id} className="py-4 px-6 flex justify-center">
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center font-medium`}>
                {member.initials}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Team Names */}
      <div className="grid grid-cols-[auto_repeat(3,1fr)] border-b border-gray-200">
        <div className="w-20" />
        {team.map((member) => (
          <div key={member.id} className="py-2 px-6 text-sm text-center">
            {member.name}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="relative">
        {/* Current Time Indicator */}
        <div className="absolute left-0 right-0 border-t-2 border-red-400 top-[200px] z-10">
          <div className="absolute -top-3 -left-20 text-xs text-red-400">4:55</div>
        </div>

        {timeSlots.map((slot, i) => (
          <div key={i} className="grid grid-cols-[auto_repeat(3,1fr)] group">
            <div className="w-20 py-8 px-4 text-right text-sm text-gray-500 -mt-4">
              {slot.time}
              <span className="text-xs">{slot.format}</span>
            </div>
            {team.map((member) => (
              <div 
                key={member.id} 
                className="border-l border-gray-200 group-hover:bg-gray-50"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}