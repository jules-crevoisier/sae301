"use client";
import { CalendarEvent } from './CalendarEvent';

export const CalendarDay = ({ date, events = [], isCurrentMonth = true, isToday = false, onEventClick, reserveBarSpace = false, barHeight = 0 }) => {
  const dayNumber = date.getDate();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return (
    <div
      className={`
        min-h-[120px] p-3 flex flex-col gap-2 transition-colors relative group h-full
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/50'}
        ${isWeekend && isCurrentMonth ? 'bg-bouilly-cream/10' : ''}
        hover:bg-gray-50
      `}
      style={reserveBarSpace && barHeight ? { paddingTop: barHeight + 8 } : undefined}
    >
      <div className="flex justify-between items-start">
        <span
          className={`
            text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-all
            ${isToday 
              ? 'bg-bouilly-green text-white shadow-md shadow-bouilly-green/30 font-bold' 
              : isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}
          `}
        >
          {dayNumber}
        </span>
        {events.length > 0 && (
           <span className="w-1.5 h-1.5 rounded-full bg-bouilly-gold mt-2 mr-1"></span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {events.slice(0, 3).map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
        {events.length > 3 && (
          <div className="text-[10px] text-gray-400 pl-1">
            + {events.length - 3} autres...
          </div>
        )}
      </div>
    </div>
  );
};