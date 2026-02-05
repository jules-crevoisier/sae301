"use client";
import { Users, Mail, Phone } from "lucide-react";

const ROLE_LABELS = {
  PERE: "Père",
  MERE: "Mère",
  TUTEUR: "Tuteur / Tutrice",
};

export const ResidentParentsCard = ({ parents }) => {
  if (!parents || parents.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-bouilly-green/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-bouilly-cream/50 border-b border-gray-100">
        <h3 className="font-title font-bold text-bouilly-darkGreen">
          Responsables légaux
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Les personnes déclarées sur ce dossier
        </p>
      </div>
      <div className="p-6">
        <ul className="space-y-5">
          {parents.map((p) => (
            <li
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-bouilly-green/10 flex items-center justify-center shrink-0">
                  <Users className="text-bouilly-green" size={20} aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-bouilly-darkGreen">
                    {p.first_name} {p.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ROLE_LABELS[p.role] || p.role}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-600 sm:text-right pl-13 sm:pl-0">
                <a
                  href={`mailto:${p.email}`}
                  className="inline-flex items-center gap-1.5 text-bouilly-green hover:underline"
                >
                  <Mail size={14} aria-hidden />
                  {p.email}
                </a>
                {p.phone && (
                  <a
                    href={`tel:${p.phone}`}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Phone size={14} aria-hidden />
                    {p.phone}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
