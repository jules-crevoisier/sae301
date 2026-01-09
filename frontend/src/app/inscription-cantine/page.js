"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  CheckCircle2, XCircle, Loader2, ArrowLeft, ArrowRight, 
  UtensilsCrossed, Home, Users, Baby, AlertTriangle, Calendar, 
  FileCheck, Plus, Trash2, ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const PARENT_ROLES = [
  { value: 'PERE', label: 'Père' },
  { value: 'MERE', label: 'Mère' },
  { value: 'TUTEUR', label: 'Tuteur/Tutrice' }
];

const ALLERGIES = [
  { id: 'allergy_1', label: 'Arachides' },
  { id: 'allergy_2', label: 'Gluten' },
  { id: 'allergy_3', label: 'Lactose' },
  { id: 'allergy_4', label: 'Oeufs' },
  { id: 'allergy_5', label: 'Fruits à coque' },
  { id: 'allergy_6', label: 'Soja' },
  { id: 'allergy_7', label: 'Poisson' },
  { id: 'allergy_8', label: 'Crustacés' },
  { id: 'allergy_9', label: 'Céleri' },
  { id: 'allergy_10', label: 'Moutarde' },
  { id: 'allergy_11', label: 'Sésame' },
  { id: 'allergy_12', label: 'Sulfites' },
  { id: 'allergy_13', label: 'Lupin' },
  { id: 'allergy_14', label: 'Mollusques' }
];

const SEVERITIES = [
  { value: 'LEGERE', label: 'Légère' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'SEVERE', label: 'Sévère' }
];

const DAYS = [
  { value: 'LUNDI', label: 'Lundi' },
  { value: 'MARDI', label: 'Mardi' },
  { value: 'MERCREDI', label: 'Mercredi' },
  { value: 'JEUDI', label: 'Jeudi' },
  { value: 'VENDREDI', label: 'Vendredi' }
];

const CLASSES = [
  'Petite Section',
  'Moyenne Section',
  'Grande Section',
  'CP',
  'CE1',
  'CE2',
  'CM1',
  'CM2'
];

const STEPS = [
  { id: 1, title: 'Informations famille', icon: Home },
  { id: 2, title: 'Parents', icon: Users },
  { id: 3, title: 'Enfants', icon: Baby },
  { id: 4, title: 'Allergies', icon: AlertTriangle },
  { id: 5, title: 'Planning cantine', icon: Calendar },
  { id: 6, title: 'Confirmation', icon: FileCheck }
];

export default function InscriptionCantine() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    family: {
      address_line1: '',
      address_line2: '',
      postal_code: '',
      city: '',
      phone_primary: '',
      phone_secondary: '',
      email: ''
    },
    parents: [{
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'PERE',
      salary_monthly: '',
      social_coefficient: ''
    }],
    children: [{
      info: {
        first_name: '',
        last_name: '',
        birth_date: '',
        school_name: '',
        class_level: ''
      },
      allergies: [],
      custom_allergies: '',
      canteen_days: []
    }]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);
  const [pricingPreview, setPricingPreview] = useState(null);

  // Validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\.]/g, '');
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/;
    return phoneRegex.test(cleaned);
  };

  const validatePostalCode = (code) => {
    return /^[0-9]{5}$/.test(code);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.family.address_line1.trim()) newErrors.address_line1 = 'Adresse requise';
      if (!formData.family.postal_code.trim()) newErrors.postal_code = 'Code postal requis';
      else if (!validatePostalCode(formData.family.postal_code)) newErrors.postal_code = 'Code postal invalide';
      if (!formData.family.city.trim()) newErrors.city = 'Ville requise';
      if (!formData.family.phone_primary.trim()) newErrors.phone_primary = 'Téléphone requis';
      else if (!validatePhone(formData.family.phone_primary)) newErrors.phone_primary = 'Téléphone invalide';
      if (formData.family.phone_secondary && !validatePhone(formData.family.phone_secondary)) {
        newErrors.phone_secondary = 'Téléphone invalide';
      }
      if (!formData.family.email.trim()) newErrors.email = 'Email requis';
      else if (!validateEmail(formData.family.email)) newErrors.email = 'Email invalide';
    }

    if (step === 2) {
      formData.parents.forEach((parent, index) => {
        if (!parent.first_name.trim()) newErrors[`parent_${index}_first_name`] = 'Prénom requis';
        if (!parent.last_name.trim()) newErrors[`parent_${index}_last_name`] = 'Nom requis';
        if (!parent.email.trim()) newErrors[`parent_${index}_email`] = 'Email requis';
        else if (!validateEmail(parent.email)) newErrors[`parent_${index}_email`] = 'Email invalide';
        if (!parent.phone.trim()) newErrors[`parent_${index}_phone`] = 'Téléphone requis';
        else if (!validatePhone(parent.phone)) newErrors[`parent_${index}_phone`] = 'Téléphone invalide';
        if (!parent.salary_monthly && !parent.social_coefficient) {
          newErrors[`parent_${index}_pricing`] = 'Salaire ou coefficient social requis';
        }
      });
    }

    if (step === 3) {
      formData.children.forEach((child, index) => {
        if (!child.info.first_name.trim()) newErrors[`child_${index}_first_name`] = 'Prénom requis';
        if (!child.info.last_name.trim()) newErrors[`child_${index}_last_name`] = 'Nom requis';
        if (!child.info.birth_date) newErrors[`child_${index}_birth_date`] = 'Date de naissance requise';
        if (!child.info.school_name.trim()) newErrors[`child_${index}_school_name`] = 'École requise';
        if (!child.info.class_level.trim()) newErrors[`child_${index}_class_level`] = 'Classe requise';
      });
    }

    if (step === 5) {
      formData.children.forEach((child, index) => {
        if (!child.canteen_days || child.canteen_days.length === 0) {
          newErrors[`child_${index}_days`] = 'Au moins un jour de présence requis';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (path, value) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      if (keys.length === 2) {
        // Pour family.xxx
        newData[keys[0]] = {
          ...newData[keys[0]],
          [keys[1]]: value
        };
      } else {
        // Pour les autres cas
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      }
      return newData;
    });
  };

  const addParent = () => {
    setFormData(prev => ({
      ...prev,
      parents: [...prev.parents, {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'MERE',
        salary_monthly: '',
        social_coefficient: ''
      }]
    }));
  };

  const removeParent = (index) => {
    if (formData.parents.length > 1) {
      setFormData(prev => ({
        ...prev,
        parents: prev.parents.filter((_, i) => i !== index)
      }));
    }
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, {
        info: {
          first_name: '',
          last_name: '',
          birth_date: '',
          school_name: '',
          class_level: ''
        },
        allergies: [],
        custom_allergies: '',
        canteen_days: []
      }]
    }));
  };

  const removeChild = (index) => {
    if (formData.children.length > 1) {
      setFormData(prev => ({
        ...prev,
        children: prev.children.filter((_, i) => i !== index)
      }));
    }
  };

  const addAllergy = (childIndex, allergyId, severity) => {
    setFormData(prev => {
      const newData = { ...prev };
      const existingIndex = newData.children[childIndex].allergies.findIndex(
        a => a.allergy_id === allergyId
      );
      if (existingIndex >= 0) {
        newData.children[childIndex].allergies[existingIndex].severity = severity;
      } else {
        newData.children[childIndex].allergies.push({
          allergy_id: allergyId,
          severity
        });
      }
      return newData;
    });
  };

  const removeAllergy = (childIndex, allergyId) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData.children[childIndex].allergies = newData.children[childIndex].allergies.filter(
        a => a.allergy_id !== allergyId
      );
      return newData;
    });
  };

  const toggleCanteenDay = (childIndex, day) => {
    setFormData(prev => {
      const newData = { ...prev };
      const newChildren = [...newData.children];
      const currentChild = { ...newChildren[childIndex] };
      const currentDays = currentChild.canteen_days || [];
      
      // Créer un nouveau tableau au lieu de modifier l'existant
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      newChildren[childIndex] = {
        ...currentChild,
        canteen_days: newDays
      };
      
      return {
        ...newData,
        children: newChildren
      };
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 5) {
        calculatePricing();
      }
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculatePricing = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parents: formData.parents.map(p => ({
            ...p,
            salary_monthly: p.salary_monthly ? parseFloat(p.salary_monthly) : undefined,
            social_coefficient: p.social_coefficient ? parseFloat(p.social_coefficient) : undefined
          })),
          children: formData.children.map(c => ({
            canteen_days: c.canteen_days
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setPricingPreview(data.data);
      }
    } catch (error) {
      console.error('Erreur calcul prix:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        family: formData.family,
        parents: formData.parents.map(p => ({
          ...p,
          salary_monthly: p.salary_monthly ? parseFloat(p.salary_monthly) : undefined,
          social_coefficient: p.social_coefficient ? parseFloat(p.social_coefficient) : undefined
        })),
        children: formData.children.map(child => {
          const childData = { ...child };
          // Ajouter les allergies personnalisées dans le commentaire d'une allergie spéciale
          if (child.custom_allergies && child.custom_allergies.trim()) {
            // Si l'enfant a déjà des allergies, on ajoute les allergies personnalisées
            // Sinon, on crée un tableau avec une entrée spéciale
            if (!childData.allergies) {
              childData.allergies = [];
            }
            // On ajoute les allergies personnalisées comme commentaire dans une allergie fictive
            // Le backend pourra les traiter ou les ignorer selon l'implémentation
            childData.allergies.push({
              allergy_id: 'custom',
              severity: 'MOYENNE',
              comment: child.custom_allergies.trim()
            });
          }
          return childData;
        })
      };

      const response = await fetch('http://localhost:4000/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setConfirmationData(data.data);
        setSubmitMessage('Inscription enregistrée avec succès !');
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bouilly-cream">
      <Header />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-bouilly-green hover:text-bouilly-gold transition-colors mb-6 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Retour à l'accueil</span>
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-bouilly-green/10 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="text-bouilly-green" size={24} />
              </div>
              <div>
                <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-2">
                  Inscription à la Cantine
                </h1>
                <p className="text-gray-600 text-sm">
                  Formulaire complet d'inscription pour la cantine scolaire
                </p>
              </div>
            </div>

            {/* Indicateur d'étapes */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center flex-1 min-w-[120px]">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-bouilly-gold text-white scale-110' :
                        isCompleted ? 'bg-bouilly-green text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                      </div>
                      <span className={`text-xs mt-2 text-center ${isActive ? 'font-semibold text-bouilly-green' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-bouilly-green' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Messages de statut */}
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl border-2 flex items-start gap-3 ${
                submitStatus === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
              role="alert"
            >
              {submitStatus === 'success' ? (
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="shrink-0 mt-0.5" />
              )}
              <p className="flex-1 text-sm font-medium">{submitMessage}</p>
            </motion.div>
          )}

          {/* Formulaire */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
          >
            <AnimatePresence mode="wait">
              {/* ÉTAPE 1: Informations famille */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-6">
                    Informations de la famille
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.family.address_line1}
                      onChange={(e) => handleChange('family.address_line1', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        errors.address_line1
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                      }`}
                      placeholder="Numéro et nom de rue"
                    />
                    {errors.address_line1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.address_line1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                      Complément d'adresse
                    </label>
                    <input
                      type="text"
                      value={formData.family.address_line2}
                      onChange={(e) => handleChange('family.address_line2', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20"
                      placeholder="Bâtiment, appartement, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                        Code postal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.family.postal_code}
                        onChange={(e) => handleChange('family.postal_code', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          errors.postal_code
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                        }`}
                        placeholder="10320"
                        maxLength={5}
                      />
                      {errors.postal_code && (
                        <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.family.city}
                        onChange={(e) => handleChange('family.city', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          errors.city
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                        }`}
                        placeholder="Bouilly"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                        Téléphone principal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.family.phone_primary}
                        onChange={(e) => handleChange('family.phone_primary', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          errors.phone_primary
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                        }`}
                        placeholder="0612345678"
                      />
                      {errors.phone_primary && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone_primary}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                        Téléphone secondaire
                      </label>
                      <input
                        type="tel"
                        value={formData.family.phone_secondary}
                        onChange={(e) => handleChange('family.phone_secondary', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          errors.phone_secondary
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                        }`}
                        placeholder="0687654321"
                      />
                      {errors.phone_secondary && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone_secondary}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.family.email}
                      onChange={(e) => handleChange('family.email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                      }`}
                      placeholder="famille@example.fr"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ÉTAPE 2: Parents */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen">
                      Informations des parents
                    </h2>
                    <button
                      type="button"
                      onClick={addParent}
                      className="flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors text-sm"
                    >
                      <Plus size={16} />
                      Ajouter un parent
                    </button>
                  </div>

                  {formData.parents.map((parent, index) => (
                    <div key={index} className="p-6 border-2 border-gray-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-bouilly-darkGreen">
                          Parent {index + 1}
                        </h3>
                        {formData.parents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeParent(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={parent.first_name}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].first_name = e.target.value;
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`parent_${index}_first_name`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`parent_${index}_first_name`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`parent_${index}_first_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={parent.last_name}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].last_name = e.target.value;
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`parent_${index}_last_name`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`parent_${index}_last_name`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`parent_${index}_last_name`]}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                          Rôle <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={parent.role}
                          onChange={(e) => {
                            const newParents = [...formData.parents];
                            newParents[index].role = e.target.value;
                            setFormData(prev => ({ ...prev, parents: newParents }));
                          }}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20 bg-white"
                        >
                          {PARENT_ROLES.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={parent.email}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].email = e.target.value;
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`parent_${index}_email`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`parent_${index}_email`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`parent_${index}_email`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Téléphone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={parent.phone}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].phone = e.target.value;
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`parent_${index}_phone`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`parent_${index}_phone`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`parent_${index}_phone`]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-bouilly-green/5 rounded-lg">
                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Salaire mensuel (€)
                          </label>
                          <input
                            type="number"
                            value={parent.salary_monthly}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].salary_monthly = e.target.value;
                              newParents[index].social_coefficient = '';
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20"
                            placeholder="2500"
                            min="0"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Le coefficient sera calculé automatiquement
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Coefficient social
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={parent.social_coefficient}
                            onChange={(e) => {
                              const newParents = [...formData.parents];
                              newParents[index].social_coefficient = e.target.value;
                              newParents[index].salary_monthly = '';
                              setFormData(prev => ({ ...prev, parents: newParents }));
                            }}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20"
                            placeholder="1.8"
                            min="0"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Si vous connaissez votre coefficient
                          </p>
                        </div>
                      </div>
                      {errors[`parent_${index}_pricing`] && (
                        <p className="text-sm text-red-600">{errors[`parent_${index}_pricing`]}</p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ÉTAPE 3: Enfants */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen">
                      Informations des enfants
                    </h2>
                    <button
                      type="button"
                      onClick={addChild}
                      className="flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors text-sm"
                    >
                      <Plus size={16} />
                      Ajouter un enfant
                    </button>
                  </div>

                  {formData.children.map((child, index) => (
                    <div key={index} className="p-6 border-2 border-gray-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-bouilly-darkGreen">
                          Enfant {index + 1}
                        </h3>
                        {formData.children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={child.info.first_name}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[index].info.first_name = e.target.value;
                              setFormData(prev => ({ ...prev, children: newChildren }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`child_${index}_first_name`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`child_${index}_first_name`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`child_${index}_first_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={child.info.last_name}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[index].info.last_name = e.target.value;
                              setFormData(prev => ({ ...prev, children: newChildren }));
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              errors[`child_${index}_last_name`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                            }`}
                          />
                          {errors[`child_${index}_last_name`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`child_${index}_last_name`]}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                          Date de naissance <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={child.info.birth_date}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].info.birth_date = e.target.value;
                            setFormData(prev => ({ ...prev, children: newChildren }));
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            errors[`child_${index}_birth_date`]
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                          }`}
                          max={new Date().toISOString().split('T')[0]}
                        />
                        {errors[`child_${index}_birth_date`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`child_${index}_birth_date`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                          École <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={child.info.school_name}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].info.school_name = e.target.value;
                            setFormData(prev => ({ ...prev, children: newChildren }));
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            errors[`child_${index}_school_name`]
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                          }`}
                          placeholder="École Primaire Victor Hugo"
                        />
                        {errors[`child_${index}_school_name`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`child_${index}_school_name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                          Classe <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={child.info.class_level}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].info.class_level = e.target.value;
                            setFormData(prev => ({ ...prev, children: newChildren }));
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white ${
                            errors[`child_${index}_class_level`]
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
                          }`}
                        >
                          <option value="">Sélectionnez une classe</option>
                          {CLASSES.map(classe => (
                            <option key={classe} value={classe}>{classe}</option>
                          ))}
                        </select>
                        {errors[`child_${index}_class_level`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`child_${index}_class_level`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ÉTAPE 4: Allergies */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-6">
                    Allergies des enfants
                  </h2>

                  {formData.children.map((child, childIndex) => (
                    <div key={childIndex} className="p-6 border-2 border-gray-200 rounded-xl space-y-4">
                      <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">
                        {child.info.first_name || `Enfant ${childIndex + 1}`}
                      </h3>

                      {ALLERGIES.map(allergy => {
                        const existingAllergy = child.allergies.find(a => a.allergy_id === allergy.id);
                        return (
                          <div key={allergy.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!existingAllergy}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      addAllergy(childIndex, allergy.id, 'LEGERE');
                                    } else {
                                      removeAllergy(childIndex, allergy.id);
                                    }
                                  }}
                                  className="w-4 h-4 text-bouilly-gold focus:ring-bouilly-gold"
                                />
                                <span className="font-medium">{allergy.label}</span>
                              </label>
                            </div>
                            {existingAllergy && (
                              <select
                                value={existingAllergy.severity}
                                onChange={(e) => addAllergy(childIndex, allergy.id, e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
                              >
                                {SEVERITIES.map(sev => (
                                  <option key={sev.value} value={sev.value}>{sev.label}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        );
                      })}

                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
                          Autres allergies (champ libre)
                        </label>
                        <textarea
                          value={child.custom_allergies || ''}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[childIndex].custom_allergies = e.target.value;
                            setFormData(prev => ({ ...prev, children: newChildren }));
                          }}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20 resize-none"
                          rows={3}
                          placeholder="Indiquez ici d'autres allergies ou intolérances non listées ci-dessus..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Vous pouvez indiquer d'autres allergies ou intolérances alimentaires non présentes dans la liste ci-dessus
                        </p>
                      </div>

                      {(child.allergies.length > 0 || child.custom_allergies) && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Allergies déclarées :</strong>{' '}
                            {child.allergies.map(a => {
                              const allergy = ALLERGIES.find(al => al.id === a.allergy_id);
                              const severity = SEVERITIES.find(s => s.value === a.severity);
                              return `${allergy?.label} (${severity?.label})`;
                            }).join(', ')}
                            {child.allergies.length > 0 && child.custom_allergies && ', '}
                            {child.custom_allergies && (
                              <span className="italic">{child.custom_allergies}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ÉTAPE 5: Planning cantine */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-6">
                    Jours de présence à la cantine
                  </h2>

                  {formData.children.map((child, childIndex) => (
                    <div key={childIndex} className="p-6 border-2 border-gray-200 rounded-xl space-y-4">
                      <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">
                        {child.info.first_name || `Enfant ${childIndex + 1}`}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {DAYS.map(day => {
                          const isSelected = (child.canteen_days || []).includes(day.value);
                          return (
                            <label
                              key={day.value}
                              className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-bouilly-gold text-white border-bouilly-gold'
                                  : 'bg-white border-gray-200 hover:border-bouilly-green/50'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleCanteenDay(childIndex, day.value);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleCanteenDay(childIndex, day.value)}
                                className="sr-only"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="font-medium text-sm">{day.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {errors[`child_${childIndex}_days`] && (
                        <p className="text-sm text-red-600">{errors[`child_${childIndex}_days`]}</p>
                      )}

                      {(child.canteen_days || []).length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          {(child.canteen_days || []).length} jour{(child.canteen_days || []).length > 1 ? 's' : ''} sélectionné{(child.canteen_days || []).length > 1 ? 's' : ''} par semaine
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ÉTAPE 6: Confirmation */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-6">
                    Récapitulatif et confirmation
                  </h2>

                  {/* Récapitulatif famille */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">Famille</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Adresse :</strong> {formData.family.address_line1}</p>
                      {formData.family.address_line2 && <p><strong>Complément :</strong> {formData.family.address_line2}</p>}
                      <p><strong>Code postal :</strong> {formData.family.postal_code} {formData.family.city}</p>
                      <p><strong>Téléphone :</strong> {formData.family.phone_primary}</p>
                      {formData.family.phone_secondary && <p><strong>Téléphone secondaire :</strong> {formData.family.phone_secondary}</p>}
                      <p><strong>Email :</strong> {formData.family.email}</p>
                    </div>
                  </div>

                  {/* Récapitulatif parents */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">Parents</h3>
                    {formData.parents.map((parent, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <p className="font-medium">{parent.first_name} {parent.last_name}</p>
                        <p className="text-sm text-gray-600">{PARENT_ROLES.find(r => r.value === parent.role)?.label} • {parent.email} • {parent.phone}</p>
                        {(parent.salary_monthly || parent.social_coefficient) && (
                          <p className="text-sm text-gray-600">
                            {parent.salary_monthly ? `Salaire: ${formatPrice(parseFloat(parent.salary_monthly))}` : `Coefficient: ${parent.social_coefficient}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif enfants */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">Enfants</h3>
                    {formData.children.map((child, index) => (
                      <div key={index} className="mb-4 last:mb-0 pb-4 border-b border-gray-200 last:border-0">
                        <p className="font-medium">{child.info.first_name} {child.info.last_name}</p>
                        <p className="text-sm text-gray-600">
                          Né(e) le {new Date(child.info.birth_date).toLocaleDateString('fr-FR')} • {child.info.school_name} • {child.info.class_level}
                        </p>
                        {(child.allergies.length > 0 || child.custom_allergies) && (
                          <p className="text-sm text-yellow-700 mt-1">
                            <strong>Allergies :</strong>{' '}
                            {child.allergies.map(a => {
                              const allergy = ALLERGIES.find(al => al.id === a.allergy_id);
                              const severity = SEVERITIES.find(s => s.value === a.severity);
                              return `${allergy?.label} (${severity?.label})`;
                            }).join(', ')}
                            {child.allergies.length > 0 && child.custom_allergies && ', '}
                            {child.custom_allergies && (
                              <span className="italic">{child.custom_allergies}</span>
                            )}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Jours cantine :</strong> {child.canteen_days.map(d => DAYS.find(day => day.value === d)?.label).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tarification */}
                  {pricingPreview && (
                    <div className="p-6 bg-bouilly-green/10 border-2 border-bouilly-green rounded-xl">
                      <h3 className="font-semibold text-lg text-bouilly-darkGreen mb-4">Tarification</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Coefficient social utilisé :</span>
                          <span className="font-semibold">{pricingPreview.social_coefficient_used}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Prix par repas :</span>
                          <span className="font-semibold">{formatPrice(pricingPreview.price_per_meal)}</span>
                        </div>
                        {pricingPreview.children_pricing && pricingPreview.children_pricing.map((childPricing, index) => (
                          <div key={index} className="mt-3 pt-3 border-t border-bouilly-green/20">
                            <p className="font-medium text-sm mb-2">{childPricing.first_name}</p>
                            <div className="flex justify-between text-sm">
                              <span>{childPricing.meals_per_month} repas/mois</span>
                              <span className="font-semibold">{formatPrice(childPricing.monthly_price)}</span>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t-2 border-bouilly-green flex justify-between items-center">
                          <span className="font-semibold text-lg">Total mensuel estimé :</span>
                          <span className="font-bold text-xl text-bouilly-green">{formatPrice(pricingPreview.estimated_monthly_price)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {confirmationData && (
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                      <h3 className="font-semibold text-lg text-green-800 mb-2">Inscription confirmée !</h3>
                      <p className="text-sm text-green-700">
                        <strong>Numéro de référence :</strong> {confirmationData.reference_number}
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        Vous recevrez un email de confirmation sous peu.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft size={18} />
                Précédent
              </button>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-all font-semibold"
                >
                  Suivant
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-bouilly-green text-white hover:bg-bouilly-darkGreen'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirmer l'inscription
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
