import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { DollarSign, Plus } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { Layout } from '../../ui/Layout';
import { saveDepositSettings } from '../../services/api';

interface DepositOptionProps {
  value: number;
  selected: boolean;
  onClick: () => void;
  isCustom?: boolean;
  customValue?: string;
  onCustomChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isNoDeposit?: boolean;
  className?: string;
}

function DepositOption({ 
  value, 
  selected, 
  onClick, 
  isCustom = false,
  customValue,
  onCustomChange,
  isNoDeposit = false
}: DepositOptionProps) {
  const { translations } = useLanguage();

  if (isCustom && selected) {
    return (
      <motion.div
        variants={fadeIn}
        className="w-24 h-24 relative"
      >
        <input
          type="text"
          value={customValue}
          onChange={onCustomChange}
          className={`w-full h-full text-center text-xl font-medium bg-primary-gold/10 
            border-2 border-primary-gold rounded-xl focus:outline-none focus:ring-0`}
          placeholder="0"
          autoFocus
        />
        <span className="absolute right-2 bottom-2 text-sm text-gray-500">%</span>
      </motion.div>
    );
  }

  return (
    <motion.button
      variants={fadeIn}
      onClick={onClick}
      className={`w-24 h-24 rounded-xl transition-all duration-300 flex flex-col items-center justify-center
        ${selected 
          ? 'bg-primary-gold/10 dark:bg-white/10 ring-2 ring-primary-gold border-transparent' 
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'}`}
    >
      {isCustom ? (
        <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-1" />
      ) : isNoDeposit ? (
        <span className="text-sm text-center font-medium text-gray-900 dark:text-white">
          {translations?.depositSettings?.options?.noDeposit || "No Deposit"}
        </span>
      ) : (
        <span className="text-2xl font-medium text-gray-900 dark:text-white">{value}%</span>
      )}
      {isCustom && <span className="text-sm text-gray-600 dark:text-gray-400">
        {translations?.depositSettings?.options?.custom || "Custom"}
      </span>}
    </motion.button>
  );
}

export default function DepositSettings() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [selectedPercentage, setSelectedPercentage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState(
    state.paymentSettings?.depositPercentage?.toString() ?? ''
  );

  const percentageOptions = [10, 20, 50];

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) <= 100)) {
      setCustomValue(value);
      if (value !== '') {
        setSelectedPercentage(parseInt(value));
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Saving deposit percentage:', selectedPercentage);
      const response = await saveDepositSettings({ depositPercentage: selectedPercentage });
      
      if (!response.success) {
        throw new Error(response.error || translations?.depositSettings?.error || 'Failed to save deposit settings');
      }

      console.log('Deposit settings saved successfully:', response.data);
      
      // Update state with confirmed deposit percentage
      dispatch({ 
        type: 'SET_PAYMENT_SETTINGS',
        payload: { depositPercentage: selectedPercentage }
      });
      
      // Navigate to BalanceReminder
      dispatch({ type: 'SET_STEP', payload: 27 });
    } catch (err) {
      console.error('Error saving deposit settings:', err);
      setError(translations?.depositSettings?.error || 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout maxWidth="md">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.depositSettings?.badge || "Deposit Settings"}</span>
        </motion.div>
        
        <Heading className="mb-4">{translations?.depositSettings?.title || "Choose Deposit Amount"}</Heading>
        
        <Text className="max-w-md mx-auto">
          {translations?.depositSettings?.subtitle || "Set the deposit percentage required for bookings. This amount will be collected upfront when clients book your services."}
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="flex flex-wrap gap-4 mb-8"
      >
        <DepositOption
          value={0}
          selected={selectedPercentage === 0 && !showCustomInput} 
          onClick={() => {
            setSelectedPercentage(0);
            setShowCustomInput(false);
          }}
          isNoDeposit
        />

        {percentageOptions.map((percentage) => (
          <DepositOption
            key={percentage}
            value={percentage}
            selected={!showCustomInput && selectedPercentage === percentage}
            onClick={() => {
              setSelectedPercentage(percentage);
              setShowCustomInput(false);
            }}
          />
        ))}

        <DepositOption
          value={0}
          selected={showCustomInput}
          customValue={customValue}
          onCustomChange={handleCustomValueChange}
          onClick={() => setShowCustomInput(true)}
          isCustom
        />
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="grid gap-4"
      >
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? (translations?.depositSettings?.saving || "Saving...") : (translations?.depositSettings?.save || "Save")}
        </Button>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </motion.div>
    </Layout>
  );
}
