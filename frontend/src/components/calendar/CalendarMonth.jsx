"use client";
import { CalendarDay } from './CalendarDay';

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const CalendarMonth = ({ currentDate, events = [], onEventClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(lastDay);
  const daysToAdd = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);

  const calendarDays = [];
  const currentDateObj = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (currentDateObj <= endDate) {
    const dateCopy = new Date(currentDateObj);
    
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start_date);
      eventStart.setHours(0, 0, 0, 0);
      const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
      eventEnd.setHours(0, 0, 0, 0);
      return dateCopy >= eventStart && dateCopy <= eventEnd;
    });

    calendarDays.push({
      date: dateCopy,
      events: dayEvents,
      isCurrentMonth: dateCopy.getMonth() === month,
      isToday: dateCopy.getTime() === today.getTime()
    });

    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-bouilly-green/5 border border-bouilly-green/10 overflow-hidden">
      {/* En-tête des jours */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-bouilly-cream/30">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="py-4 text-center font-title font-bold text-xs uppercase tracking-widest text-bouilly-gold"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px border-b border-gray-100">
        {calendarDays.map((dayData, index) => (
          <CalendarDay
            key={index}
            {...dayData}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};