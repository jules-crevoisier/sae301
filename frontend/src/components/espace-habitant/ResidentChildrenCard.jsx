"use client";
import { Baby, UtensilsCrossed, AlertCircle, School } from "lucide-react";

const formatBirthDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const DAY_LABELS = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
};

export const ResidentChildrenCard = ({ children }) => {
  if (!children || children.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-bouilly-green/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-bouilly-cream/50 border-b border-gray-100">
        <h3 className="font-title font-bold text-bouilly-darkGreen">
          Mes enfants
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Enfants du dossier — cantine et allergies
        </p>
      </div>
      <div className="p-6 space-y-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="rounded-xl border border-gray-100 p-5 bg-gray-50/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-bouilly-green/10 flex items-center justify-center shrink-0">
                <Baby
                  className="text-bouilly-green"
                  size={24}
                  aria-hidden
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-bouilly-darkGreen text-lg">
                  {child.first_name} {child.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  Né(e) le {formatBirthDate(child.birth_date)}
                </p>
                {child.school_name && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-gray-600">
                    <School size={16} className="shrink-0" aria-hidden />
                    {child.school_name}
                    {child.class_level && ` — ${child.class_level}`}
                  </p>
                )}
              </div>
            </div>

            {(child.canteen_days?.length > 0 || child.allergies?.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                {child.canteen_days?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bouilly-gold/10 flex items-center justify-center shrink-0">
                      <UtensilsCrossed
                        className="text-bouilly-gold"
                        size={16}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Jours à la cantine
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {child.canteen_days.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 rounded-md bg-bouilly-green/10 text-bouilly-darkGreen text-sm font-medium"
                          >
                            {DAY_LABELS[day] || day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {child.allergies?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <AlertCircle
                        className="text-amber-600"
                        size={16}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Allergies ou régimes alimentaires
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {child.allergies.map((a) => (
                          <li
                            key={a.id}
                            className="text-sm text-bouilly-darkGreen"
                          >
                            {a.allergy_label}
                            {a.severity && (
                              <span className="text-gray-500">
                                {" "}
                                — {a.severity}
                              </span>
                            )}
                            {a.comment && (
                              <span className="text-gray-500">
                                {" "}
                                ({a.comment})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
