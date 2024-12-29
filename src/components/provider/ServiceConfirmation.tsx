import React from 'react';
import { Service } from '../../types/onboarding'; // Import the Service type
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Sparkles, Scissors, Clock, DollarSign } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { useLanguage } from '../../context/LanguageContext';
import { Layout } from '../../ui/Layout';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <motion.div 
      variants={fadeIn} 
      className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-2xl p-6 flex items-center gap-4"
    >
      <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-xl text-primary-gold dark:text-white">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
}

export default function ServiceConfirmation() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const selectedServices: Service[] = state.services.filter((s: Service) => s.selected);

  const getServicesDisplay = () => {
    const names = selectedServices.map(s => s.name);
    if (names.length === 0) return '0 Services';
    if (names.length === 1) return `${names[0]} Services`;
    if (names.length === 2) {
      return `${names[0]} and ${names[1]} Services`;
    }
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} Services`;
  };

  const handleAccept = () => {
    dispatch({ type: 'SET_STEP', payload: 11 });
  };

  return (
    <Layout maxWidth="2xl" showBackButton={false}>
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{translations.serviceConfirmation?.badge || 'Badge'}</span>
          </motion.div>
        
          <Heading>{translations.serviceConfirmation?.title || 'Service Confirmation'}</Heading>
        </div>

        <motion.div
          variants={staggerChildren}
          className="grid gap-4 mb-12"
          style={{ pointerEvents: 'none' }}
        >
          <StatCard
            icon={<Scissors className="w-5 h-5" />}
            value={getServicesDisplay()}
            label={translations.serviceConfirmation?.addedToProfile || 'Added to Profile'}
          />
        
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            value={translations.serviceConfirmation?.pricing?.value || 'Pricing Value'}
            label={translations.serviceConfirmation?.pricing?.label || 'Pricing Label'}
          />
        
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            value={translations.serviceConfirmation?.addons?.value || 'Addons Value'}
            label={translations.serviceConfirmation?.addons?.label || 'Addons Label'}
          />
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleAccept}
            className="w-full"
          >
            {translations.serviceConfirmation?.continue || 'Continue'}
          </Button>
        </motion.div>
    </Layout>
  );
}
