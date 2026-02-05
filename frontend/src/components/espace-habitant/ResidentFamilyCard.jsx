"use client";
import { MapPin, Phone, Mail, FileText } from "lucide-react";

export const ResidentFamilyCard = ({ family }) => {
  if (!family) return null;

  const address = [family.address_line1, family.address_line2]
    .filter(Boolean)
    .join(", ");
  const cityLine = [family.postal_code, family.city].filter(Boolean).join(" ");

  return (
    <div className="bg-white rounded-2xl border border-bouilly-green/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-bouilly-cream/50 border-b border-gray-100">
        <h3 className="font-title font-bold text-bouilly-darkGreen">
          Coordonnées du foyer
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Adresse et moyens de contact de votre dossier
        </p>
      </div>
      <div className="p-6 space-y-5">
        {family.reference_number && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bouilly-green/5 border border-bouilly-green/20">
            <FileText
              className="shrink-0 text-bouilly-green"
              size={22}
              aria-hidden
            />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro de dossier
              </p>
              <p className="font-mono font-bold text-bouilly-darkGreen text-lg">
                {family.reference_number}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                À indiquer dans vos échanges avec la mairie
              </p>
            </div>
          </div>
        )}

        {address && (
          <div className="flex gap-3">
            <MapPin
              className="shrink-0 text-bouilly-gold mt-0.5"
              size={20}
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-gray-500">Adresse</p>
              <p className="text-bouilly-darkGreen">{address}</p>
              {cityLine && (
                <p className="text-bouilly-darkGreen">{cityLine}</p>
              )}
            </div>
          </div>
        )}
        {family.phone_primary && (
          <div className="flex gap-3">
            <Phone
              className="shrink-0 text-bouilly-gold mt-0.5"
              size={20}
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-gray-500">Téléphone</p>
              <p className="text-bouilly-darkGreen">{family.phone_primary}</p>
              {family.phone_secondary && (
                <p className="text-sm text-gray-600 mt-0.5">
                  Second : {family.phone_secondary}
                </p>
              )}
            </div>
          </div>
        )}
        {family.email && (
          <div className="flex gap-3">
            <Mail
              className="shrink-0 text-bouilly-gold mt-0.5"
              size={20}
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a
                href={`mailto:${family.email}`}
                className="text-bouilly-green hover:underline"
              >
                {family.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
