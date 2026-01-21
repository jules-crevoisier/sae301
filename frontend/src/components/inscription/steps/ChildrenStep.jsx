import { FormInput, Card } from "../ui/FormElements";
import { Baby, School, Trash2, Plus, Calendar } from "lucide-react";

const CLASSES = ['Petite Section', 'Moyenne Section', 'Grande Section', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export default function ChildrenStep({ childrenData, actions, errors }) {
  return (
    <div className="space-y-6">
      {childrenData.map((child, index) => (
        <Card key={index}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-bouilly-darkGreen flex items-center gap-2">
              <Baby className="text-bouilly-gold" />
              Enfant {index + 1}
            </h3>
            {childrenData.length > 1 && (
              <button onClick={() => actions.removeChild(index)} className="text-red-400 hover:text-red-600">
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Prénom"
                value={child.info.first_name}
                onChange={(e) => actions.updateChildInfo(index, 'first_name', e.target.value)}
                error={errors[`child_${index}_first_name`]}
              />
              <FormInput
                label="Nom"
                value={child.info.last_name}
                onChange={(e) => actions.updateChildInfo(index, 'last_name', e.target.value)}
                error={errors[`child_${index}_last_name`]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Date de naissance"
                type="date"
                value={child.info.birth_date}
                onChange={(e) => actions.updateChildInfo(index, 'birth_date', e.target.value)}
                icon={Calendar}
                error={errors[`child_${index}_birth_date`]}
              />
              <div>
                <label className="block text-sm font-bold text-bouilly-darkGreen mb-2 ml-1">Classe</label>
                <div className="relative">
                    <select
                        value={child.info.class_level}
                        onChange={(e) => actions.updateChildInfo(index, 'class_level', e.target.value)}
                        className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none focus:border-bouilly-gold focus:bg-white appearance-none font-medium text-gray-700 ${
                            errors[`child_${index}_class_level`] ? 'border-red-200 bg-red-50' : 'border-transparent'
                        }`}
                    >
                        <option value="">Sélectionner...</option>
                        {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                </div>
              </div>
            </div>

            <FormInput
              label="École"
              value={child.info.school_name}
              onChange={(e) => actions.updateChildInfo(index, 'school_name', e.target.value)}
              icon={School}
              placeholder="ex: École Victor Hugo"
              error={errors[`child_${index}_school_name`]}
            />
          </div>
        </Card>
      ))}

      <button
        onClick={actions.addChild}
        type="button"
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-bouilly-green hover:text-bouilly-green hover:bg-bouilly-green/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Inscrire un autre enfant
      </button>
    </div>
  );
}