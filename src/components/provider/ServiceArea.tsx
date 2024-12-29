import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { MapPin, Navigation, DollarSign, Settings } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { EditableValue } from '../../ui/EditableValue';
import { Layout } from '../../ui/Layout';
import { useLanguage } from '../../context/LanguageContext';
import { extractCountryFromAddress } from '../../utils/address';
import { saveServiceAreaSettings } from '../../services/api';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  children?: React.ReactNode;
}

function StatCard({ icon, value, label, children }: StatCardProps) {
  return (
    <motion.div 
      variants={fadeIn}
      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all"
    >
      <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-xl text-primary-gold dark:text-white">
        {icon}
      </div>
      <div>
        {children || <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>}
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
}

export default function ServiceArea() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [isUS, setIsUS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(state.serviceLocation.mobileRadius || 50);
  const [error, setError] = useState<string | null>(null);
  const [travelFee, setTravelFee] = useState(state.serviceLocation.travelFeePerKm || 1);
  const [minTravelFee, setMinTravelFee] = useState(state.serviceLocation.minTravelFee || 15);
  const [minSpend, setMinSpend] = useState(state.serviceLocation.minimumSpend || 60);

  // Check if address is from US
  useEffect(() => {
    if (state.serviceLocation.address) {
      console.log('Checking country from address:', state.serviceLocation.address);
      const countryCode = extractCountryFromAddress(state.serviceLocation.address);
      console.log('Detected country code:', countryCode);
      setIsUS(countryCode === 'US');
    }
  }, [state.serviceLocation.address]);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    const settings = {
      mobileRadius: radius,
      travelFeePerKm: travelFee,
      minTravelFee: minTravelFee,
      minimumSpend: minSpend
    };
    console.log('Current state:', {
      address: state.serviceLocation.address,
      billingAddress: state.serviceLocation.billingAddress,
      settings
    });
    try {
      const response = await saveServiceAreaSettings(settings);
      console.log('API Response:', response);
      if (!response.success) {
        throw new Error(response.error || 'Failed to save settings');
      }
      // Update state with confirmed settings
      dispatch({
        type: 'SET_SERVICE_LOCATION',
        payload: {
          ...state.serviceLocation,
          mobileRadius: radius,
          travelFeePerKm: travelFee,
          minTravelFee: minTravelFee,
          minimumSpend: minSpend
        }
      });
      // Navigate to next step
      dispatch({ type: 'SET_STEP', payload: 9 });
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(Math.min(Math.max(newRadius, 1), 100));
  };

  return (
    <Layout maxWidth="2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{translations.serviceArea.title}</span>
          </motion.div>
        
          <Heading>{translations.serviceArea.title}</Heading>
          <Text className="max-w-3xl mx-auto mt-4">
            {translations.serviceArea.subtitle}
          </Text>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="grid gap-4 mb-12"
        >
          <StatCard
            icon={<Navigation className="w-5 h-5" />}
            label={translations.serviceArea.radius.description.replace('{address}', state.serviceLocation.address || '')}
            value=""
          >
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              <EditableValue
                value={radius}
                onChange={(value) => handleRadiusChange(parseInt(value) || 1)}
                suffix={isUS ? " mile radius" : translations.serviceArea.radius.title}
                min={1}
                max={100}
                helperText="Click to edit"
              />
            </div>
          </StatCard>
        
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label={translations.serviceArea.travelFee.description}
            value=""
          >
            <EditableValue
              value={travelFee}
              onChange={(value) => setTravelFee(parseFloat(value) || 1)}
              prefix="$"
              suffix={isUS ? "/ mile" : translations.serviceArea.travelFee.title}
              min={0.1}
              max={10}
              helperText="Click to edit"
            />
          </StatCard>
        
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label={translations.serviceArea.minimumFee.description}
            value=""
          >
            <EditableValue
              value={minTravelFee}
              onChange={(value) => setMinTravelFee(parseInt(value) || 15)}
              prefix="$"
              suffix={` ${translations.serviceArea.minimumFee.title}`}
              min={1}
              max={100}
              helperText="Click to edit"
            />
          </StatCard>
        
          <StatCard
            icon={<Settings className="w-5 h-5" />}
            label={translations.serviceArea.minimumSpend.description}
            value=""
          >
            <EditableValue
              value={minSpend}
              onChange={(value) => setMinSpend(parseInt(value) || 60)}
              prefix="$"
              suffix={` ${translations.serviceArea.minimumSpend.title}`}
              min={1}
              max={1000}
              helperText="Click to edit"
            />
          </StatCard>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleAccept}
            disabled={loading}
            className="w-full"
          >
            {loading ? translations.serviceArea.saving : translations.serviceArea.continue}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </motion.div>
    </Layout>
  );
}