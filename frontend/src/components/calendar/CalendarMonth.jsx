"use client";
import { useMemo } from "react";
import { CalendarDay } from "./CalendarDay";
import { CalendarEventBar } from "./CalendarEventBar";
import {
  isMultiDayEvent,
  isDateInEventRange,
  getMultiDaySegmentInWeek,
} from "./calendarUtils";

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const BAR_ROW_HEIGHT = 32;

const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const CalendarMonth = ({ currentDate, events = [], onEventClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { singleDayEventsByDay, weeks } = useMemo(() => {
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
      calendarDays.push({
        date: dateCopy,
        isCurrentMonth: dateCopy.getMonth() === month,
        isToday: dateCopy.getTime() === today.getTime(),
      });
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    const singleDay = [];
    const multiDay = [];
    events.forEach((event) => {
      if (isMultiDayEvent(event)) {
        multiDay.push(event);
      } else {
        singleDay.push(event);
      }
    });

    const byDay = calendarDays.map((dayData) =>
      singleDay.filter((ev) => isDateInEventRange(dayData.date, ev))
    );

    const weekChunks = chunk(calendarDays, 7);
    const weeksWithBars = weekChunks.map((days) => {
      const weekStart = days[0].date;
      const weekEnd = days[6].date;
      const bars = multiDay
        .map((event) => {
          const seg = getMultiDaySegmentInWeek(event, weekStart, weekEnd);
          return seg ? { event, ...seg } : null;
        })
        .filter(Boolean);
      return { days, bars };
    });

    return {
      singleDayEventsByDay: byDay,
      weeks: weeksWithBars,
    };
  }, [year, month, events]);

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-bouilly-green/5 border border-bouilly-green/10 overflow-hidden">
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

      <div className="flex flex-col">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-7 bg-gray-100 gap-px border-b border-gray-100 last:border-b-0"
            style={{ gridAutoRows: "minmax(120px, 1fr)" }}
          >
            {/* Cases des jours (ligne 1) */}
            {week.days.map((dayData, dayIndex) => {
              const globalIndex = weekIndex * 7 + dayIndex;
              return (
                <div
                  key={globalIndex}
                  className="min-h-0"
                  style={{ gridColumn: dayIndex + 1, gridRow: 1 }}
                >
                  <CalendarDay
                    date={dayData.date}
                    events={singleDayEventsByDay[globalIndex] || []}
                    isCurrentMonth={dayData.isCurrentMonth}
                    isToday={dayData.isToday}
                    onEventClick={onEventClick}
                    reserveBarSpace={week.bars.length > 0}
                    barHeight={BAR_ROW_HEIGHT}
                  />
                </div>
              );
            })}
            {/* Barres multi-jours : ligne 1, en haut des cases */}
            {week.bars.map(({ event, startCol, span }) => (
              <CalendarEventBar
                key={event.id}
                event={event}
                startCol={startCol}
                span={span}
                onClick={onEventClick}
                style={{
                  gridColumn: `${startCol + 1} / span ${span}`,
                  gridRow: 1,
                  alignSelf: "start",
                  minHeight: BAR_ROW_HEIGHT,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
