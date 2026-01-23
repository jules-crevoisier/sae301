"use client";
import { CalendarEvent } from './CalendarEvent';

export const CalendarDay = ({ date, events = [], isCurrentMonth = true, isToday = false, onEventClick }) => {
  const dayNumber = date.getDate();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return (
    <div
      className={`
        min-h-[100px] border border-gray-200 p-2
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'bg-bouilly-green/5 border-bouilly-green' : ''}
        ${isWeekend ? 'bg-gray-50/50' : ''}
        transition-colors hover:bg-gray-50
      `}
    >
      <div
        className={`
          text-sm font-semibold mb-1
          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
          ${isToday ? 'text-bouilly-green font-bold' : ''}
        `}
      >
        {dayNumber}
      </div>
      <div className="space-y-1 overflow-y-auto max-h-[80px]">
        {events.map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};
