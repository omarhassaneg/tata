import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Phone, Mail, Instagram, Eye, EyeOff } from 'lucide-react';
import { Layout } from './ui/Layout';
import { fadeIn, staggerChildren } from './ui/animations';
import { saveContactSettings } from '../services/api';

export default function ContactDisplaySettings() {
  const { state, dispatch } = useOnboarding();
  const { userData } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (value: string) => {
    dispatch({
      type: 'SET_USER_DATA',
      payload: { [field]: value }
    });
  };

  const handleToggle = (setting: keyof typeof userData.displaySettings) => {
    dispatch({
      type: 'SET_USER_DATA',
      payload: {
        displaySettings: {
          ...userData.displaySettings,
          [setting]: !userData.displaySettings?.[setting]
        }
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const settings = {
      displaySettings: {
        showPhone: userData.displaySettings?.showPhone ?? false,
        showEmail: userData.displaySettings?.showEmail ?? false,
        showInstagram: userData.displaySettings?.showInstagram ?? true
      },
      phone: userData.phone,
      email: userData.email,
      instagram: userData.instagram
    };

    try {
      const response = await saveContactSettings(settings);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save settings');
      }

      dispatch({ type: 'SET_STEP', payload: 16 });
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout maxWidth="2xl">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">Contact Display</span>
        </motion.div>
        
        <Heading className="mb-4">Contact Information</Heading>
        
        <Text className="max-w-md mx-auto">
          Choose which contact information to display on your website. You can change these settings anytime.
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-4 mb-12"
      >
        {/* Contact options here */}
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </motion.div>
    </Layout>
  );
}
