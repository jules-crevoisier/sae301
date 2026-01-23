"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/FormElements";
import { Check, Calendar, AlertCircle, Utensils } from "lucide-react";

const WEEK_DAYS = [
  { value: 'LUNDI', label: 'Lundi', short: 'Lun' },
  { value: 'MARDI', label: 'Mardi', short: 'Mar' },
  { value: 'MERCREDI', label: 'Mercredi', short: 'Mer' },
  { value: 'JEUDI', label: 'Jeudi', short: 'Jeu' },
  { value: 'VENDREDI', label: 'Vendredi', short: 'Ven' }
];

export default function PlanningStep({ childrenData, actions, errors }) {
  return (
    <div className="space-y-8">
      {/* Message d'information Contextuel */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-start gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 shrink-0">
           <Calendar size={18} />
        </div>
        <div className="mt-1">
            <p className="font-bold mb-1">Définissez la semaine type</p>
            <p className="opacity-90">Cliquez sur les jours où l'enfant mangera à la cantine. Ce planning servira de base pour la facturation.</p>
        </div>
      </div>

      {childrenData.map((child, index) => (
        <Card key={index} className="overflow-visible"> {/* overflow-visible pour les effets de pop */}
          
          {/* En-tête Enfant */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
             <div className="w-12 h-12 rounded-full bg-bouilly-green text-white flex items-center justify-center font-title font-bold text-xl shadow-lg shadow-bouilly-green/20">
               {child.info.first_name ? child.info.first_name.charAt(0) : (index + 1)}
             </div>
             <div>
                 <h3 className="text-xl font-bold text-bouilly-darkGreen">
                   {child.info.first_name || `Enfant ${index + 1}`}
                 </h3>
                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sélection des repas</p>
             </div>
          </div>

          {/* Zone de Sélection */}
          <div className={`relative transition-all duration-300 rounded-3xl p-2 sm:p-4 ${
             errors[`child_${index}_days`] ? 'bg-red-50 ring-2 ring-red-200' : 'bg-transparent'
          }`}>
             
             {/* Grille des jours */}
             <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {WEEK_DAYS.map((day) => {
                  const isSelected = (child.canteen_days || []).includes(day.value);
                  return (
                    <motion.button
                      key={day.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => actions.toggleCanteenDay(index, day.value)}
                      className={`relative flex flex-col items-center justify-between p-4 h-32 rounded-2xl border-2 transition-all duration-300 group ${
                        isSelected
                          ? 'bg-bouilly-green border-bouilly-green shadow-xl shadow-bouilly-green/30'
                          : 'bg-white border-gray-100 hover:border-bouilly-gold/50 hover:bg-gray-50'
                      }`}
                    >
                      {/* Indicateur Haut */}
                      <div className="w-full flex justify-between items-start">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                              {day.short}
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-bouilly-gold text-white' : 'bg-gray-100 text-transparent'
                          }`}>
                              <Check size={12} strokeWidth={4} />
                          </div>
                      </div>

                      {/* Icone Centrale (Visuel) */}
                      <Utensils 
                        size={24} 
                        className={`transition-all duration-300 ${
                            isSelected ? 'text-white scale-110' : 'text-gray-200 group-hover:text-bouilly-gold/50'
                        }`} 
                      />

                      {/* Label Jour */}
                      <span className={`font-title font-bold text-sm uppercase tracking-wide ${
                          isSelected ? 'text-white' : 'text-gray-600'
                      }`}>
                        {day.label}
                      </span>
                    </motion.button>
                  );
                })}
             </div>
             
             {/* Message d'erreur spécifique */}
             <AnimatePresence>
                {errors[`child_${index}_days`] && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-2 mt-4 text-red-500 bg-white/50 p-2 rounded-lg"
                    >
                        <AlertCircle size={16} />
                        <span className="text-sm font-bold">{errors[`child_${index}_days`]}</span>
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
          
          {/* Résumé Footer */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bouilly-cream rounded-full border border-bouilly-green/10">
                <span className="text-sm text-bouilly-darkGreen">Total hebdomadaire :</span>
                <span className="font-bold text-bouilly-green text-lg">
                    {(child.canteen_days || []).length} repas
                </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}