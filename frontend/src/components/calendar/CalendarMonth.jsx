"use client";
import { CalendarDay } from './CalendarDay';

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const CalendarMonth = ({ currentDate, events = [], onEventClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Premier jour du mois
  const firstDay = new Date(year, month, 1);
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0);
  
  // Premier jour à afficher (peut être du mois précédent)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Dernier jour à afficher (peut être du mois suivant)
  const endDate = new Date(lastDay);
  const daysToAdd = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);

  // Générer tous les jours du calendrier
  const calendarDays = [];
  const currentDateObj = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (currentDateObj <= endDate) {
    const dateCopy = new Date(currentDateObj);
    const dateKey = dateCopy.toISOString().split('T')[0];
    
    // Trouver les événements pour ce jour
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête des jours de la semaine */}
      <div className="grid grid-cols-7 bg-bouilly-green/5 border-b border-gray-200">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-sm text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7">
        {calendarDays.map((dayData, index) => (
          <CalendarDay
            key={index}
            date={dayData.date}
            events={dayData.events}
            isCurrentMonth={dayData.isCurrentMonth}
            isToday={dayData.isToday}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};
