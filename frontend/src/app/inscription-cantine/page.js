"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { useInscription, STEPS } from '@/hooks/useInscription';
import StepLayout from '@/components/inscription/StepLayout';
import { ActionButton } from '@/components/inscription/ui/FormElements';

import FamilyStep from '@/components/inscription/steps/FamilyStep';
import ParentsStep from '@/components/inscription/steps/ParentsStep';
import ChildrenStep from '@/components/inscription/steps/ChildrenStep';
import AllergiesStep from '@/components/inscription/steps/AllergiesStep';
import PlanningStep from '@/components/inscription/steps/PlanningStep';
import ValidationStep from '@/components/inscription/steps/ValidationStep';

export default function InscriptionCantine() {
  const { 
    currentStep, formData, errors, isSubmitting, 
    submitStatus, submitMessage, confirmationData, pricingPreview,
    actions 
  } = useInscription();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FamilyStep data={formData.family} errors={errors} onChange={actions.updateFamily} />;
      case 2:
        return <ParentsStep parents={formData.parents} actions={actions} errors={errors} />;
      case 3:
        return <ChildrenStep childrenData={formData.children} actions={actions} errors={errors} />;
      case 4:
        return <AllergiesStep childrenData={formData.children} actions={actions} />;
      case 5:
        return <PlanningStep childrenData={formData.children} actions={actions} errors={errors} />;
      case 6:
        return <ValidationStep formData={formData} pricingPreview={pricingPreview} />;
      default:
        return null;
    }
  };

  const currentStepInfo = STEPS.find(s => s.id === currentStep);

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
        <div className="flex gap-2 mb-12 px-2 max-w-lg mx-auto md:mx-0">
          {STEPS.map((s) => (
            <div 
              key={s.id} 
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                s.id <= currentStep ? 'bg-bouilly-green flex-1' : 'bg-gray-200 w-2'
              }`} 
            />
          ))}
        </div>

        <AnimatePresence>
            {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-8 p-4 rounded-xl border-2 flex items-start gap-3 max-w-4xl mx-auto ${
                    submitStatus === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {submitStatus === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  <p className="font-medium">{submitMessage}</p>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!confirmationData ? (
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
             >
                <StepLayout stepNumber={currentStep} title={currentStepInfo.title} description={currentStepInfo.desc}>
                
                {renderStep()}

                <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                    <ActionButton variant="ghost" onClick={actions.prevStep} disabled={currentStep === 1} icon={ArrowLeft}>
                    Retour
                    </ActionButton>

                    {currentStep < STEPS.length ? (
                        <ActionButton variant="primary" onClick={actions.nextStep}>
                            Étape suivante <ArrowRight size={20} />
                        </ActionButton>
                    ) : (
                        <ActionButton variant="primary" onClick={actions.handleSubmit} loading={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Confirmer l'inscription"}
                            {!isSubmitting && <CheckCircle2 size={20} />}
                        </ActionButton>
                    )}
                </div>
                </StepLayout>
            </motion.div>
          ) : (
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-gray-100 max-w-2xl mx-auto"
             >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-title font-bold text-bouilly-darkGreen mb-4">Inscription Confirmée !</h2>
                <p className="text-gray-600 mb-8">
                    Votre dossier a bien été transmis aux services de la mairie. <br/>
                    Référence : <span className="font-mono font-bold text-black">{confirmationData.reference_number}</span>
                </p>
                <ActionButton variant="secondary" onClick={() => window.location.href = '/'}>
                    Retour à l'accueil
                </ActionButton>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </main>
  );
}