import { Card } from "../ui/FormElements";
import { CheckCircle2, User, MapPin, Baby, Coins } from "lucide-react";

export default function ValidationStep({ formData, pricingPreview }) {
  const formatPrice = (price) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4 items-start">
        <CheckCircle2 className="text-green-600 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-bold text-green-800 text-lg">Tout est prêt !</h3>
          <p className="text-green-700 text-sm mt-1">
            Veuillez relire attentivement les informations ci-dessous avant de valider l'inscription définitive.
          </p>
        </div>
      </div>

      {pricingPreview && (
        <Card className="!border-bouilly-green/30 !bg-bouilly-green/5">
           <div className="flex items-center gap-2 mb-4 pb-2 border-b border-bouilly-green/20">
              <Coins className="text-bouilly-darkGreen" size={20} />
              <h3 className="text-bouilly-darkGreen uppercase text-xs font-bold tracking-wider">Estimation Tarifaire</h3>
           </div>
           
           <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Coefficient social utilisé :</span>
                 <span className="font-bold text-bouilly-darkGreen">{pricingPreview.social_coefficient_used}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Prix unitaire repas :</span>
                 <span className="font-bold text-bouilly-darkGreen">{formatPrice(pricingPreview.price_per_meal)}</span>
              </div>
              
              {pricingPreview.children_pricing && pricingPreview.children_pricing.map((cp, idx) => (
                 <div key={idx} className="flex justify-between items-center text-sm pl-4 border-l-2 border-bouilly-green/20 my-2">
                    <span className="text-gray-600">{cp.first_name} ({cp.meals_per_month} repas)</span>
                    <span className="font-medium">{formatPrice(cp.monthly_price)}</span>
                 </div>
              ))}

              <div className="mt-4 pt-4 border-t border-bouilly-green/20 flex justify-between items-center">
                 <span className="font-bold text-lg text-bouilly-darkGreen">Total Mensuel Estimé</span>
                 <span className="font-title font-bold text-2xl text-bouilly-green">{formatPrice(pricingPreview.estimated_monthly_price)}</span>
              </div>
           </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 border-b pb-2">Famille</h3>
           <div className="flex gap-4 items-start mb-2">
                <MapPin size={18} className="text-bouilly-gold mt-1" />
                <div>
                    <p className="font-bold text-gray-800">{formData.family.address_line1}</p>
                    <p className="text-gray-500">{formData.family.postal_code} {formData.family.city}</p>
                    <p className="text-gray-500 text-sm mt-1">{formData.family.email} <br/> {formData.family.phone_primary}</p>
                </div>
            </div>
        </Card>

        <Card>
           <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 border-b pb-2">Parents</h3>
           <div className="space-y-4">
              {formData.parents.map((p, i) => (
                  <div key={i} className="flex gap-3">
                      <User size={18} className="text-bouilly-gold mt-1" />
                      <div>
                          <p className="font-bold text-gray-800">{p.first_name} {p.last_name}</p>
                          <p className="text-xs text-gray-500 uppercase">{p.role}</p>
                      </div>
                  </div>
              ))}
           </div>
        </Card>
      </div>

      <Card>
           <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 border-b pb-2">Enfants & Allergies</h3>
           <div className="space-y-4">
              {formData.children.map((c, i) => (
                  <div key={i} className="flex gap-3 pb-4 last:pb-0 border-b border-gray-100 last:border-0">
                      <Baby size={18} className="text-bouilly-gold mt-1" />
                      <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-bold text-gray-800">{c.info.first_name} {c.info.last_name}</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">{c.info.class_level}</span>
                          </div>
                          
                          {(c.allergies.length > 0 || c.custom_allergies) && (
                            <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded-lg">
                                <strong>⚠️ Allergies : </strong>
                                {c.allergies.length > 0 && "Déclarées via liste"}
                                {c.custom_allergies && (c.allergies.length > 0 ? " + " : "") + c.custom_allergies}
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap gap-1">
                             {c.canteen_days.map(d => (
                                <span key={d} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-bouilly-green/10 text-bouilly-darkGreen rounded-full">
                                    {d.substring(0, 3)}
                                </span>
                             ))}
                          </div>
                      </div>
                  </div>
              ))}
           </div>
        </Card>
    </div>
  );
}