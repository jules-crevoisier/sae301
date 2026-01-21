"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Users, Home, Baby, 
  AlertTriangle, Calendar, Euro, Mail, Phone, MapPin,
  Edit2, Trash2, X
} from 'lucide-react';

const DAYS_LABELS = {
  'LUNDI': 'Lundi',
  'MARDI': 'Mardi',
  'MERCREDI': 'Mercredi',
  'JEUDI': 'Jeudi',
  'VENDREDI': 'Vendredi'
};

const SEVERITY_LABELS = {
  'LEGERE': 'Légère',
  'MOYENNE': 'Moyenne',
  'SEVERE': 'Sévère'
};

const ROLE_LABELS = {
  'PERE': 'Père',
  'MERE': 'Mère',
  'TUTEUR': 'Tuteur/Tutrice'
};

export default function AdminRegistrationCard({ registration, onDelete, formatDate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = registration.summary || {};
  const isOld = registration.isOld || false;
  const oldData = registration.oldData;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price || 0);
  };

  // Affichage pour les anciennes inscriptions
  if (isOld && oldData) {
    return (
      <div className="bg-white rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-all overflow-hidden">
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="text-yellow-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-bouilly-darkGreen">
                    {oldData.prenom} {oldData.nom}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {oldData.email_parent}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                <span>{oldData.classe}</span>
                <span>•</span>
                <span>{oldData.regime_alimentaire}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ANCIEN FORMAT
              </span>
              {isExpanded ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-yellow-200"
            >
              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-bouilly-darkGreen mb-3">Informations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Nom :</span>
                      <p className="font-medium">{oldData.nom}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Prénom :</span>
                      <p className="font-medium">{oldData.prenom}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Classe :</span>
                      <p className="font-medium">{oldData.classe}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email parent :</span>
                      <p className="font-medium">{oldData.email_parent}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Régime alimentaire :</span>
                      <p className="font-medium">{oldData.regime_alimentaire}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date de création :</span>
                      <p className="font-medium">{formatDate(oldData.created_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="font-medium mb-1">Note :</p>
                  <p>Cette inscription utilise l'ancien format simplifié. Pour migrer vers le nouveau format complet, veuillez recréer l'inscription via le formulaire complet.</p>
                </div>
                <div className="text-sm text-gray-500 text-center pt-2 border-t border-gray-200">
                  ID: {oldData.id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Affichage pour les nouvelles inscriptions
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-bouilly-green/50 transition-all overflow-hidden">
      {/* En-tête de la carte */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-bouilly-green/10 rounded-full flex items-center justify-center">
                <Users className="text-bouilly-green" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-bouilly-darkGreen">
                  {summary.family?.reference_number || `Famille #${registration.family_id?.substring(0, 8)}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {summary.family?.email || 'Aucun email'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {summary.parents?.length || 0} parent{summary.parents?.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Baby size={14} />
                {summary.children?.length || 0} enfant{summary.children?.length > 1 ? 's' : ''}
              </span>
              {summary.pricing && (
                <span className="flex items-center gap-1">
                  <Euro size={14} />
                  {formatPrice(summary.pricing.estimated_monthly_price)}/mois
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              registration.status === 'CONFIRMED' 
                ? 'bg-green-100 text-green-800'
                : registration.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {registration.status || 'CONFIRMED'}
            </span>
            {isExpanded ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Détails expandables */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-6 space-y-6">
              
              {/* Informations de la famille */}
              {summary.family && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-bouilly-darkGreen mb-3 flex items-center gap-2">
                    <Home size={18} />
                    Informations de la famille
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Numéro de référence :</span>
                      <p className="font-medium">{summary.family.reference_number || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Adresse :</span>
                      <p className="font-medium">
                        {summary.family.address_line1}
                        {summary.family.address_line2 && `, ${summary.family.address_line2}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Code postal / Ville :</span>
                      <p className="font-medium">{summary.family.postal_code} {summary.family.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Téléphone principal :</span>
                      <p className="font-medium">{summary.family.phone_primary}</p>
                    </div>
                    {summary.family.phone_secondary && (
                      <div>
                        <span className="text-gray-600">Téléphone secondaire :</span>
                        <p className="font-medium">{summary.family.phone_secondary}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Email :</span>
                      <p className="font-medium">{summary.family.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Parents */}
              {summary.parents && summary.parents.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-bouilly-darkGreen mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Parents ({summary.parents.length})
                  </h4>
                  <div className="space-y-3">
                    {summary.parents.map((parent, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-bouilly-darkGreen">
                              {parent.first_name} {parent.last_name}
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <span className="font-medium">Rôle :</span>
                                {ROLE_LABELS[parent.role] || parent.role}
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail size={14} />
                                {parent.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone size={14} />
                                {parent.phone}
                              </p>
                              {(parent.salary_monthly || parent.social_coefficient) && (
                                <p className="flex items-center gap-2">
                                  <Euro size={14} />
                                  {parent.salary_monthly 
                                    ? `Salaire: ${formatPrice(parent.salary_monthly)}`
                                    : `Coefficient: ${parent.social_coefficient}`
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enfants */}
              {summary.children && summary.children.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-bouilly-darkGreen mb-3 flex items-center gap-2">
                    <Baby size={18} />
                    Enfants ({summary.children.length})
                  </h4>
                  <div className="space-y-4">
                    {summary.children.map((child, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-lg text-bouilly-darkGreen">
                              {child.first_name} {child.last_name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Né(e) le {new Date(child.birth_date).toLocaleDateString('fr-FR')} • 
                              {child.school_name} • {child.class_level}
                            </p>
                          </div>
                        </div>

                        {/* Allergies */}
                        {child.allergies && child.allergies.length > 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                              <AlertTriangle size={16} />
                              Allergies ({child.allergies.length})
                            </p>
                            <div className="space-y-1">
                              {child.allergies.map((allergy, allergyIndex) => (
                                <p key={allergyIndex} className="text-sm text-yellow-700">
                                  • {allergy.allergy_label || allergy.allergy_id} 
                                  {allergy.severity && ` (${SEVERITY_LABELS[allergy.severity] || allergy.severity})`}
                                  {allergy.comment && ` - ${allergy.comment}`}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Jours de cantine */}
                        {child.canteen_days && child.canteen_days.length > 0 && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                              <Calendar size={16} />
                              Jours de cantine ({child.canteen_days.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {child.canteen_days.map((day, dayIndex) => (
                                <span 
                                  key={dayIndex}
                                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                >
                                  {DAYS_LABELS[day] || day}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tarification */}
              {summary.pricing && (
                <div className="bg-bouilly-green/10 rounded-lg p-4 border border-bouilly-green/20">
                  <h4 className="font-semibold text-bouilly-darkGreen mb-3 flex items-center gap-2">
                    <Euro size={18} />
                    Tarification
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coefficient social utilisé :</span>
                      <span className="font-medium">{summary.pricing.social_coefficient_used || summary.pricing.social_coefficient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix par repas :</span>
                      <span className="font-medium">{formatPrice(summary.pricing.price_per_meal)}</span>
                    </div>
                    {summary.pricing.children_pricing && summary.pricing.children_pricing.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-bouilly-green/20">
                        <p className="font-medium mb-2">Détail par enfant :</p>
                        {summary.pricing.children_pricing.map((childPricing, index) => (
                          <div key={index} className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{childPricing.first_name} ({childPricing.meals_per_month} repas/mois) :</span>
                            <span className="font-medium">{formatPrice(childPricing.monthly_price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t-2 border-bouilly-green flex justify-between items-center">
                      <span className="font-semibold text-lg">Total mensuel estimé :</span>
                      <span className="font-bold text-xl text-bouilly-green">
                        {formatPrice(summary.pricing.estimated_monthly_price)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Date de confirmation */}
              <div className="text-sm text-gray-500 text-center pt-2 border-t border-gray-200">
                Inscription confirmée le {formatDate(registration.confirmed_at || registration.created_at)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
