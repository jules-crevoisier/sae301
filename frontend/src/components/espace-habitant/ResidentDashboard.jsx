"use client";
import { LogOut, Info } from "lucide-react";
import { ResidentFamilyCard } from "./ResidentFamilyCard";
import { ResidentParentsCard } from "./ResidentParentsCard";
import { ResidentChildrenCard } from "./ResidentChildrenCard";
import { ResidentCanteenCard } from "./ResidentCanteenCard";

export const ResidentDashboard = ({ data, onLogout }) => {
  if (!data) return null;

  const { family, parents, children, registration } = data;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen">
            Mon espace citoyen
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Résumé de votre dossier et de vos démarches
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors shrink-0"
          aria-label="Changer d'email"
        >
          <LogOut size={18} aria-hidden />
          Changer d&apos;email
        </button>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/80 border border-blue-100">
        <Info
          className="shrink-0 text-blue-600 mt-0.5"
          size={20}
          aria-hidden
        />
        <p className="text-sm text-blue-900">
          Vous retrouvez ici les informations enregistrées pour votre foyer :
          coordonnées, responsables légaux, enfants inscrits à la cantine et
          tarification.
        </p>
      </div>

      <ResidentFamilyCard family={family} />
      <ResidentParentsCard parents={parents} />
      <ResidentChildrenCard children={children} />
      <ResidentCanteenCard registration={registration} children={children} />
    </div>
  );
};
