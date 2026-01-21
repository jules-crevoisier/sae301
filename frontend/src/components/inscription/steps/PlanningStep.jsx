import { Card } from "../ui/FormElements";
import { Check, Calendar, AlertCircle } from "lucide-react"; // Ajout de AlertCircle

const WEEK_DAYS = [
  { value: 'LUNDI', label: 'Lu', full: 'Lundi' },
  { value: 'MARDI', label: 'Ma', full: 'Mardi' },
  { value: 'MERCREDI', label: 'Me', full: 'Mercredi' },
  { value: 'JEUDI', label: 'Je', full: 'Jeudi' },
  { value: 'VENDREDI', label: 'Ve', full: 'Vendredi' }
];

export default function PlanningStep({ childrenData, actions, errors }) {
  return (
    <div className="space-y-8">
      {/* Message d'information avec icône Calendar */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-4 flex items-start gap-3">
        <Calendar size={20} className="shrink-0 mt-0.5" /> 
        <p>Sélectionnez les jours de présence type. Une erreur s'affichera si aucun jour n'est choisi.</p>
      </div>

      {childrenData.map((child, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-full bg-bouilly-gold/20 flex items-center justify-center text-bouilly-darkGreen font-bold">
               {child.info.first_name ? child.info.first_name.charAt(0) : (index + 1)}
             </div>
             <h3 className="text-xl font-bold text-bouilly-darkGreen">
               Planning de {child.info.first_name || `Enfant ${index + 1}`}
             </h3>
          </div>

          <div className={`bg-gray-50 rounded-3xl p-6 border transition-colors duration-300 shadow-inner ${
             errors[`child_${index}_days`] ? 'border-red-300 bg-red-50' : 'border-gray-100'
          }`}>
             <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {WEEK_DAYS.map((day) => {
                  const isSelected = (child.canteen_days || []).includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => actions.toggleCanteenDay(index, day.value)}
                      className={`group relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-bouilly-darkGreen text-white shadow-lg shadow-bouilly-green/40 scale-105'
                          : 'bg-white text-gray-400 hover:text-bouilly-darkGreen hover:bg-white shadow-sm border border-gray-200'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-bouilly-gold rounded-full flex items-center justify-center border-2 border-white">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      
                      <span className="text-xl sm:text-2xl font-title font-bold">{day.label}</span>
                      <span className={`text-[10px] uppercase tracking-wide mt-1 ${isSelected ? 'text-bouilly-green/40' : 'text-gray-300'}`}>
                        {day.full}
                      </span>
                    </button>
                  );
                })}
             </div>
             
             {/* Message d'erreur avec icône AlertCircle */}
             {errors[`child_${index}_days`] && (
                <div className="flex items-center justify-center gap-2 mt-4 text-red-500 animate-pulse">
                    <AlertCircle size={18} />
                    <span className="text-sm font-bold">{errors[`child_${index}_days`]}</span>
                </div>
             )}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {(child.canteen_days || []).length} repas par semaine sélectionnés
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}