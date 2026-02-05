"use client";
import { motion } from "framer-motion";

const EVENT_STYLES = {
  GENERAL: "bg-gray-100 text-gray-600 border-gray-200",
  CULTURE: "bg-purple-50 text-purple-700 border-purple-100",
  "FESTIVITÉS": "bg-amber-50 text-amber-700 border-amber-100",
  SANTÉ: "bg-rose-50 text-rose-700 border-rose-100",
  TRAVAUX: "bg-orange-50 text-orange-700 border-orange-100",
  CITOYENNETÉ: "bg-blue-50 text-blue-700 border-blue-100",
  ENVIRONNEMENT: "bg-emerald-50 text-emerald-700 border-emerald-100",
  URBANISME: "bg-slate-50 text-slate-700 border-slate-100",
  SPORT: "bg-indigo-50 text-indigo-700 border-indigo-100",
  EDUCATION: "bg-pink-50 text-pink-700 border-pink-100",
};

export const CalendarEventBar = ({ event, startCol, span, onClick, style: styleProp }) => {
  const style = EVENT_STYLES[event.category] || EVENT_STYLES.GENERAL;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={`
        ${style}
        text-left px-2 py-1.5 rounded-md border
        text-[10px] font-semibold truncate leading-tight
        shadow-sm hover:shadow transition-all
        min-w-0 w-full box-border relative z-10
      `}
      style={styleProp}
      aria-label={`Événement: ${event.title}`}
    >
      {event.title}
    </motion.button>
  );
};
