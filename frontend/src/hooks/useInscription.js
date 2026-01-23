import { useState } from 'react';

export const STEPS = [
  { id: 1, title: 'Famille', desc: 'Coordonnées' },
  { id: 2, title: 'Parents', desc: 'Responsables' },
  { id: 3, title: 'Enfants', desc: 'Scolarité' },
  { id: 4, title: 'Santé', desc: 'Allergies' },
  { id: 5, title: 'Planning', desc: 'Cantine' },
  { id: 6, title: 'Validation', desc: 'Récapitulatif' }
];

export function useInscription() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // États pour la logique métier et API
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);
  const [pricingPreview, setPricingPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    family: { address_line1: '', address_line2: '', city: '', postal_code: '', phone_primary: '', phone_secondary: '', email: '' },
    parents: [{ first_name: '', last_name: '', role: 'PERE', email: '', phone: '', salary_monthly: '', social_coefficient: '' }],
    children: [{ 
      info: { first_name: '', last_name: '', birth_date: '', school_name: '', class_level: '' }, 
      allergies: [], 
      custom_allergies: '',
      canteen_days: [] 
    }]
  });

  // --- HELPERS VALIDATION ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(phone.replace(/[\s\-\.]/g, ''));
  const validatePostalCode = (code) => /^[0-9]{5}$/.test(code);

  // --- VALIDATION PAR ÉTAPE ---
  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.family.address_line1.trim()) newErrors.address_line1 = 'Adresse requise';
      if (!formData.family.postal_code.trim()) newErrors.postal_code = 'Code postal requis';
      else if (!validatePostalCode(formData.family.postal_code)) newErrors.postal_code = 'Code postal invalide';
      if (!formData.family.city.trim()) newErrors.city = 'Ville requise';
      if (!formData.family.phone_primary.trim()) newErrors.phone_primary = 'Téléphone requis';
      else if (!validatePhone(formData.family.phone_primary)) newErrors.phone_primary = 'Téléphone invalide';
      if (!formData.family.email.trim()) newErrors.email = 'Email requis';
      else if (!validateEmail(formData.family.email)) newErrors.email = 'Email invalide';
    }

    if (currentStep === 2) {
      formData.parents.forEach((parent, index) => {
        if (!parent.first_name.trim()) newErrors[`parent_${index}_first_name`] = 'Prénom requis';
        if (!parent.last_name.trim()) newErrors[`parent_${index}_last_name`] = 'Nom requis';
        if (!parent.email.trim()) newErrors[`parent_${index}_email`] = 'Email requis';
        else if (!validateEmail(parent.email)) newErrors[`parent_${index}_email`] = 'Email invalide';
        if (!parent.phone.trim()) newErrors[`parent_${index}_phone`] = 'Téléphone requis';
        else if (!validatePhone(parent.phone)) newErrors[`parent_${index}_phone`] = 'Téléphone invalide';
      });
    }

    if (currentStep === 3) {
      formData.children.forEach((child, index) => {
        if (!child.info.first_name.trim()) newErrors[`child_${index}_first_name`] = 'Prénom requis';
        if (!child.info.last_name.trim()) newErrors[`child_${index}_last_name`] = 'Nom requis';
        if (!child.info.birth_date) newErrors[`child_${index}_birth_date`] = 'Date naissance requise';
        if (!child.info.school_name.trim()) newErrors[`child_${index}_school_name`] = 'École requise';
        if (!child.info.class_level.trim()) newErrors[`child_${index}_class_level`] = 'Classe requise';
      });
    }

    if (currentStep === 5) {
      formData.children.forEach((child, index) => {
        if (!child.canteen_days || child.canteen_days.length === 0) {
          newErrors[`child_${index}_days`] = 'Sélectionnez au moins un jour';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- ACTIONS UPDATE ---
  const updateFamily = (field, value) => {
    setFormData(prev => ({ ...prev, family: { ...prev.family, [field]: value } }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updateParent = (index, field, value) => {
    const newParents = [...formData.parents];
    newParents[index][field] = value;
    if (field === 'salary_monthly') newParents[index].social_coefficient = '';
    if (field === 'social_coefficient') newParents[index].salary_monthly = '';
    setFormData(prev => ({ ...prev, parents: newParents }));
  };

  const addParent = () => setFormData(prev => ({ 
    ...prev, parents: [...prev.parents, { first_name: '', last_name: '', role: 'MERE', email: '', phone: '', salary_monthly: '', social_coefficient: '' }] 
  }));

  const removeParent = (idx) => {
    if (formData.parents.length > 1) {
      setFormData(prev => ({ ...prev, parents: prev.parents.filter((_, i) => i !== idx) }));
    }
  };

  const updateChildInfo = (index, field, value) => {
    const newChildren = [...formData.children];
    newChildren[index].info[field] = value;
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const addChild = () => setFormData(prev => ({
    ...prev, children: [...prev.children, { info: { first_name: '', last_name: '' }, allergies: [], canteen_days: [] }]
  }));

  const removeChild = (idx) => {
    if (formData.children.length > 1) {
      setFormData(prev => ({ ...prev, children: prev.children.filter((_, i) => i !== idx) }));
    }
  };

  // --- ACTIONS SANTÉ & PLANNING (CORRIGÉES) ---
  const toggleAllergy = (childIndex, allergyId, severity = 'LEGERE') => {
    setFormData(prev => {
      const newChildren = [...prev.children];
      // Création d'une copie profonde de l'enfant cible
      const targetChild = { ...newChildren[childIndex] };
      const currentAllergies = [...(targetChild.allergies || [])];
      
      const existsIndex = currentAllergies.findIndex(a => a.allergy_id === allergyId);

      if (existsIndex >= 0) {
        currentAllergies.splice(existsIndex, 1);
      } else {
        currentAllergies.push({ allergy_id: allergyId, severity });
      }

      targetChild.allergies = currentAllergies;
      newChildren[childIndex] = targetChild;

      return { ...prev, children: newChildren };
    });
  };

  const updateCustomAllergy = (childIndex, value) => {
    const newChildren = [...formData.children];
    newChildren[childIndex].custom_allergies = value;
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const toggleCanteenDay = (childIndex, dayValue) => {
    setFormData(prev => {
      const newChildren = [...prev.children];
      // Création d'une copie profonde de l'enfant cible
      const targetChild = { ...newChildren[childIndex] };
      const currentDays = [...(targetChild.canteen_days || [])];
      
      if (currentDays.includes(dayValue)) {
        targetChild.canteen_days = currentDays.filter(d => d !== dayValue);
      } else {
        targetChild.canteen_days = [...currentDays, dayValue];
      }
      
      newChildren[childIndex] = targetChild;
      return { ...prev, children: newChildren };
    });

    if (errors[`child_${childIndex}_days`]) {
      setErrors(prev => ({ ...prev, [`child_${childIndex}_days`]: null }));
    }
  };

  // --- API LOGIC ---
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
          if (child.custom_allergies && child.custom_allergies.trim()) {
            if (!childData.allergies) childData.allergies = [];
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

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 5) {
        calculatePricing();
      }
      setCurrentStep(p => Math.min(p + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevStep = () => {
    setCurrentStep(p => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitStatus,
    submitMessage,
    confirmationData,
    pricingPreview,
    actions: {
      updateFamily,
      updateParent, addParent, removeParent,
      updateChildInfo, addChild, removeChild,
      toggleAllergy, updateCustomAllergy,
      toggleCanteenDay,
      nextStep, prevStep, handleSubmit
    }
  };
}