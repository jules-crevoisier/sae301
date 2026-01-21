import { FormInput, Card } from "../ui/FormElements";
import { User, Phone, Mail, Trash2, Plus, Euro } from "lucide-react";

export default function ParentsStep({ parents, actions, errors }) {
  return (
    <div className="space-y-6">
      {parents.map((parent, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-bouilly-darkGreen flex items-center gap-2">
              <span className="bg-bouilly-green/10 text-bouilly-darkGreen w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              Responsable légal
            </h3>
            {parents.length > 1 && (
              <button 
                onClick={() => actions.removeParent(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-bouilly-darkGreen mb-2 ml-1">Rôle</label>
              <div className="flex gap-4">
                {['PERE', 'MERE', 'TUTEUR'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => actions.updateParent(index, 'role', role)}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      parent.role === role 
                        ? 'border-bouilly-green bg-bouilly-green/10 text-bouilly-darkGreen' 
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {role === 'PERE' ? 'Père' : role === 'MERE' ? 'Mère' : 'Tuteur'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Prénom"
                value={parent.first_name}
                onChange={(e) => actions.updateParent(index, 'first_name', e.target.value)}
                icon={User}
                error={errors[`parent_${index}_first_name`]}
              />
              <FormInput
                label="Nom"
                value={parent.last_name}
                onChange={(e) => actions.updateParent(index, 'last_name', e.target.value)}
                icon={User}
                error={errors[`parent_${index}_last_name`]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email"
                type="email"
                value={parent.email}
                onChange={(e) => actions.updateParent(index, 'email', e.target.value)}
                icon={Mail}
                error={errors[`parent_${index}_email`]}
              />
              <FormInput
                label="Téléphone"
                type="tel"
                value={parent.phone}
                onChange={(e) => actions.updateParent(index, 'phone', e.target.value)}
                icon={Phone}
                error={errors[`parent_${index}_phone`]}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500">
                  <Euro size={16} />
                  <span>Information Tarifaire</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Salaire Mensuel"
                    type="number"
                    placeholder="ex: 2500"
                    value={parent.salary_monthly}
                    onChange={(e) => actions.updateParent(index, 'salary_monthly', e.target.value)}
                  />
                  <FormInput
                    label="Coef. Social"
                    type="number"
                    placeholder="ex: 1.5"
                    value={parent.social_coefficient}
                    onChange={(e) => actions.updateParent(index, 'social_coefficient', e.target.value)}
                  />
               </div>
            </div>
          </div>
        </Card>
      ))}

      <button
        onClick={actions.addParent}
        type="button"
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-bouilly-green hover:text-bouilly-green hover:bg-bouilly-green/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Ajouter un autre parent
      </button>
    </div>
  );
}