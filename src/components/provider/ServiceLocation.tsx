import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { MapPin, Home, Loader } from 'lucide-react';
import { fadeIn, staggerChildren, slideIn } from '../../ui/animations';
import { saveServiceLocation } from '../../services/api';
import { Layout } from '../../ui/Layout';
import { useLanguage } from '../../context/LanguageContext';

interface LocationOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function LocationOption({ icon, title, description, selected, onClick }: LocationOptionProps) {
  return (
    <motion.button
      {...slideIn}
      onClick={onClick}
      className={`w-full p-6 rounded-xl transition-all duration-300 border
        ${selected 
          ? 'bg-primary-gold/10 dark:bg-white/10 ring-2 ring-primary-gold border-transparent' 
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-gray-200 dark:border-white/20'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
          ${selected ? 'text-primary-gold' : 'text-gray-600 dark:text-gray-400'}`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className={`text-lg font-semibold mb-1 ${selected ? 'text-primary-gold' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h3>
          <Text className={`text-sm ${selected ? 'text-primary-gold/80' : 'text-gray-600 dark:text-gray-400'}`}>
            {description}
          </Text>
        </div>
      </div>
    </motion.button>
  );
}

export default function ServiceLocation() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLocationType = (type: 'mobile' | 'studio' | 'both') => {
    let newType = state.serviceLocation.type;
    
    if (type === 'mobile') {
      if (['mobile', 'both'].includes(state.serviceLocation.type)) {
        newType = state.serviceLocation.type === 'both' ? 'studio' : '';
      } else {
        newType = state.serviceLocation.type === 'studio' ? 'both' : 'mobile';
      }
    } else if (type === 'studio') {
      if (['studio', 'both'].includes(state.serviceLocation.type)) {
        newType = state.serviceLocation.type === 'both' ? 'mobile' : '';
      } else {
        newType = state.serviceLocation.type === 'mobile' ? 'both' : 'studio';
      }
    }

    dispatch({
      type: 'SET_SERVICE_LOCATION',
      payload: { ...state.serviceLocation, type: newType as 'mobile' | 'studio' | 'both' | '' },
    });
  };

  const handleNext = async () => {
    if (state.serviceLocation.type) {
      setLoading(true);
      setError(null);

      try {
        const response = await saveServiceLocation({
          type: state.serviceLocation.type,
          mobileRadius: state.serviceLocation.mobileRadius || 50,
          travelFeePerKm: state.serviceLocation.travelFeePerKm || 1,
          minimumSpend: state.serviceLocation.minimumSpend || 60
        });

        console.log('API Response:', response);
        dispatch({ type: 'SET_STEP', payload: 7 });
      } catch (err) {
        console.error('Error saving service location:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout maxWidth="lg">
      <Heading className="text-center mb-4 dark:text-white">
        {translations.location.title}
      </Heading>

      <Text className="text-center mb-8 max-w-xl mx-auto dark:text-gray-300">
        {translations.location.subtitle}
      </Text>
      
      <motion.div {...staggerChildren} className="grid gap-4 mb-12">
        <LocationOption
          icon={<MapPin className="w-6 h-6" />}
          title={translations.location.mobile.title}
          description={translations.location.mobile.description}
          selected={['mobile', 'both'].includes(state.serviceLocation.type)}
          onClick={() => setLocationType('mobile')}
        />
        
        <LocationOption
          icon={<Home className="w-6 h-6" />}
          title={translations.location.studio.title}
          description={translations.location.studio.description}
          selected={['studio', 'both'].includes(state.serviceLocation.type)}
          onClick={() => setLocationType('studio')}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: state.serviceLocation.type ? 1 : 0, y: state.serviceLocation.type ? 0 : 20 }}
        className="grid gap-4"
      >
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={loading || !state.serviceLocation.type}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              {translations.location.saving}
            </span>
          ) : (
            translations.location.continue
          )}
        </Button>
        
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </motion.div>
    </Layout>
  );
}