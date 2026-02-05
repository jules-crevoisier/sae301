"use client";
import {
  UtensilsCrossed,
  CheckCircle,
  Clock,
  XCircle,
  Euro,
  Calendar,
  Percent,
} from "lucide-react";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Inscription confirmée",
    icon: CheckCircle,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  PENDING: {
    label: "En attente de validation",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  CANCELLED: {
    label: "Inscription annulée",
    icon: XCircle,
    className: "text-gray-500 bg-gray-50 border-gray-200",
  },
};

const formatEuro = (value) => {
  if (value == null || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(2).replace(".", ",")} €` : "—";
};

export const ResidentCanteenCard = ({ registration, children }) => {
  const hasChildrenInCanteen =
    children?.some((c) => c.canteen_days?.length > 0) ?? false;
  const pricing =
    registration?.summary?.pricing &&
    typeof registration.summary.pricing === "object"
      ? registration.summary.pricing
      : null;

  return (
    <div className="bg-white rounded-2xl border border-bouilly-green/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-bouilly-cream/50 border-b border-gray-100">
        <h3 className="font-title font-bold text-bouilly-darkGreen">
          Cantine scolaire
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Statut de votre inscription et tarifs appliqués
        </p>
      </div>
      <div className="p-6 space-y-6">
        {registration ? (
          <>
            {/* Statut */}
            <div className="flex flex-wrap items-center gap-3">
              {(() => {
                const config =
                  STATUS_CONFIG[registration.status] || STATUS_CONFIG.PENDING;
                const Icon = config.icon;
                return (
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${config.className}`}
                  >
                    <Icon size={18} aria-hidden />
                    {config.label}
                  </span>
                );
              })()}
              {registration.confirmed_at && (
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar size={16} aria-hidden />
                  Enregistrée le{" "}
                  {new Date(registration.confirmed_at).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </span>
              )}
            </div>

            {/* Tarification visuelle */}
            {pricing && (
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-sm font-semibold text-bouilly-darkGreen mb-3">
                  Tarification
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pricing.price_per_meal != null && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-bouilly-green/10 flex items-center justify-center shrink-0">
                        <Euro
                          className="text-bouilly-green"
                          size={20}
                          aria-hidden
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Prix par repas
                        </p>
                        <p className="font-bold text-bouilly-darkGreen">
                          {formatEuro(pricing.price_per_meal)}
                        </p>
                      </div>
                    </div>
                  )}
                  {pricing.estimated_monthly_price != null && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-bouilly-gold/10 flex items-center justify-center shrink-0">
                        <Euro
                          className="text-bouilly-gold"
                          size={20}
                          aria-hidden
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Estimation mensuelle
                        </p>
                        <p className="font-bold text-bouilly-darkGreen">
                          {formatEuro(pricing.estimated_monthly_price)}
                        </p>
                      </div>
                    </div>
                  )}
                  {pricing.social_coefficient_used != null && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Percent
                          className="text-blue-600"
                          size={20}
                          aria-hidden
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Quotient familial
                        </p>
                        <p className="font-bold text-bouilly-darkGreen">
                          {String(pricing.social_coefficient_used)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasChildrenInCanteen && (
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <UtensilsCrossed
                  className="shrink-0 text-bouilly-gold mt-0.5"
                  size={18}
                  aria-hidden
                />
                Les jours de cantine de chaque enfant sont indiqués dans la
                section &quot;Mes enfants&quot; ci-dessus.
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <UtensilsCrossed
              className="mx-auto text-gray-300 mb-3"
              size={40}
              aria-hidden
            />
            <p className="text-gray-600 mb-4">
              Aucune inscription cantine enregistrée pour ce dossier.
            </p>
            <a
              href="/inscription-cantine"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bouilly-green text-white font-medium text-sm hover:bg-bouilly-darkGreen transition-colors"
            >
              Faire une inscription
              <UtensilsCrossed size={16} aria-hidden />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
