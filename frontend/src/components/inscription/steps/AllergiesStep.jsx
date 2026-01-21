import { Card } from "../ui/FormElements";
import { AlertTriangle, Check } from "lucide-react";

const ALLERGIES_LIST = [
  { id: 'allergy_1', label: 'Arachides' },
  { id: 'allergy_2', label: 'Gluten' },
  { id: 'allergy_3', label: 'Lactose' },
  { id: 'allergy_4', label: 'Oeufs' },
  { id: 'allergy_5', label: 'Fruits à coque' },
  { id: 'allergy_7', label: 'Poisson' },
];

export default function AllergiesStep({ childrenData, actions }) {
  return (
    <div className="space-y-8">
      {childrenData.map((child, index) => (
        <Card key={index}>
          <h3 className="text-xl font-bold text-bouilly-darkGreen mb-6 flex items-center gap-2">
            <span className="text-bouilly-gold"><AlertTriangle size={24} /></span>
            Santé : {child.info.first_name || `Enfant ${index + 1}`}
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3">Allergies courantes</label>
            <div className="flex flex-wrap gap-3">
              {ALLERGIES_LIST.map((allergy) => {
                const isSelected = child.allergies.some(a => a.allergy_id === allergy.id);
                return (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => actions.toggleAllergy(index, allergy.id)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-bouilly-darkGreen border-bouilly-darkGreen text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-bouilly-green'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {allergy.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Précisions ou autres régimes</label>
            <textarea
              value={child.custom_allergies || ''}
              onChange={(e) => actions.updateCustomAllergy(index, e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-bouilly-gold focus:bg-white transition-all text-gray-700 font-medium"
              rows={3}
              placeholder="Décrivez ici les spécificités (ex: PAI, régime sans porc, intolérance grave...)"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}