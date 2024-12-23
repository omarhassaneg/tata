import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Palette, Scissors, Droplets, Bath, User, Sparkles, Eye, Crown, Loader } from 'lucide-react';
import { fadeIn, staggerChildren, scaleIn } from './ui/animations';
import { Layout } from './ui/Layout';
import { saveServices } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  selected: boolean;
  onClick: () => void;
}

function ServiceCard({ icon, name, selected, onClick }: ServiceCardProps) {
  return (
    <motion.button
      {...scaleIn}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all backdrop-blur-sm ${
        selected
          ? 'bg-white/10 dark:bg-white/5 ring-2 ring-primary-gold shadow-lg'
          : 'bg-white/80 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10'
      }`}
    >
      <div className={`w-10 h-10 mb-2 flex items-center justify-center ${
        selected ? 'text-primary-gold' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {icon}
      </div>
      <Text className={`text-sm font-medium ${
        selected 
          ? 'text-primary-gold dark:text-primary-gold' 
          : 'text-gray-600 dark:text-gray-300'
      }`}>
        {name}
      </Text>
    </motion.button>
  );
}

export default function ServicesSelection() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (id: string) => {
    const updatedServices = state.services.map(service =>
      service.id === id ? { ...service, selected: !service.selected } : service
    );
    console.log('Service toggled:', { id, services: updatedServices });
    dispatch({ type: 'SET_SERVICES', payload: updatedServices });
  };

  const handleContinue = async () => {
    const selectedServices = state.services.filter(service => service.selected);
    console.log('Selected services:', selectedServices);
    
    setLoading(true);
    setError(null);

    try {
      const response = await saveServices(selectedServices);
      console.log('API Response:', response);

      if (response.success) {
        dispatch({ type: 'SET_STEP', payload: 6 });
      } else {
        setError(response.error || 'Failed to save services');
      }
    } catch (err) {
      console.error('Error saving services:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasSelectedServices = state.services.some(service => service.selected);

  const services = [
    { id: '1', name: translations.services.categories.makeup, icon: <Palette className="w-8 h-8" /> },
    { id: '2', name: translations.services.categories.nails, icon: <Scissors className="w-8 h-8" /> },
    { id: '3', name: translations.services.categories.sprayTan, icon: <Droplets className="w-8 h-8" /> },
    { id: '4', name: translations.services.categories.hair, icon: <Scissors className="w-8 h-8" /> },
    { id: '5', name: translations.services.categories.waxing, icon: <Bath className="w-8 h-8" /> },
    { id: '6', name: translations.services.categories.esthetics, icon: <User className="w-8 h-8" /> },
    { id: '7', name: translations.services.categories.henna, icon: <Sparkles className="w-8 h-8" /> },
    { id: '8', name: translations.services.categories.eyelashes, icon: <Eye className="w-8 h-8" /> },
    { id: '9', name: translations.services.categories.eyelashesEyebrows, icon: <Eye className="w-8 h-8" /> },
    { id: '10', name: translations.services.categories.hairstyling, icon: <Scissors className="w-8 h-8" /> },
    { id: '11', name: translations.services.categories.barber, icon: <Scissors className="w-8 h-8" /> },
    { id: '12', name: translations.services.categories.wedding, icon: <Crown className="w-8 h-8" /> },
  ];

  return (
    <Layout maxWidth="xl">
      <Heading className="text-center mb-4 dark:text-white">
        {translations.services.title}
      </Heading>
      
      <Text className="text-center mb-16 max-w-2xl mx-auto dark:text-gray-300">
        {translations.services.subtitle}
      </Text>
      
      <motion.div {...staggerChildren} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            name={service.name}
            selected={state.services.find(s => s.id === service.id)?.selected || false}
            onClick={() => toggleService(service.id)}
          />
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hasSelectedServices ? 1 : 0, y: hasSelectedServices ? 0 : 20 }}
        className="space-y-4"
      >
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={loading || !hasSelectedServices}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              {translations.services.saving}
            </span>
          ) : (
            translations.services.continue
          )}
        </Button>
        
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </motion.div>
    </Layout>
  );
}