import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { useLanguage } from '../context/LanguageContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Globe, Check, X, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { checkSlugAvailability, saveWebsiteSlug } from '../services/api';
import { generateDefaultSlug } from '../utils/slug';
import { Layout } from './ui/Layout';

export default function WebsiteSlug() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [slug, setSlug] = useState(() => 
    state.websiteSlug || generateDefaultSlug({
      businessName: state.userData.businessName,
      instagram: state.userData.instagram,
      firstName: state.userData.firstName
    })
  );
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'web.glamic.com';

  useEffect(() => {
    if (slug) {
      console.log('Checking availability for slug:', slug);
      const timer = setTimeout(() => {
        checkAvailability();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsAvailable(null);
    }
  }, [slug]);

  const checkAvailability = async () => {
    setIsChecking(true);
    try {
      const response = await checkSlugAvailability(slug);
      console.log('Availability check response:', response);
      setIsAvailable(response.data.available);
    } catch (err) {
      console.error('Error checking slug availability:', err);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    console.log('Slug changed to:', value);
    setSlug(value);
  };

  const handleContinue = async () => {
    if (isAvailable && slug) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Saving slug:', slug);
        const response = await saveWebsiteSlug(slug);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to save slug');
        }

        console.log('Slug saved successfully:', response.data);
        
        // Update state with confirmed slug
        dispatch({ type: 'SET_WEBSITE_SLUG', payload: slug });
        
        // Navigate to WebsiteLogo
        dispatch({ type: 'SET_STEP', payload: 18 });
      } catch (err) {
        console.error('Error saving slug:', err);
        setError('Failed to save slug. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout maxWidth="xl">
      <motion.div 
        {...fadeIn}
        className="w-full mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{translations?.websiteSlug?.badge || "Website Address"}</span>
          </motion.div>
          
          <Heading className="mb-4">{translations?.websiteSlug?.title || "Choose Your URL"}</Heading>
          
          <Text className="max-w-md mx-auto">
            {translations?.websiteSlug?.subtitle || "Pick a unique address for your website. Use only letters, numbers, and hyphens."}
          </Text>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="space-y-8"
        >
        <div className="relative flex items-center gap-2">
          <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">{baseUrl}/</span>
          <div className="flex-1 flex items-center px-6 py-4 bg-white dark:bg-primary-navy/50 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 focus-within:border-primary-gold">
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder={translations?.websiteSlug?.placeholder || "your-business-name"}
              className="w-full outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 lowercase bg-transparent"
              maxLength={30}
            />
            {slug && (
              <div className="flex-shrink-0">
                {isChecking ? (
                  <motion.div 
                    className="w-5 h-5 border-2 border-gray-300 border-t-primary-gold rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : isAvailable ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          {slug && !isChecking && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-sm ${isAvailable ? 'text-green-600' : 'text-red-500'}`}
            >
              {isAvailable 
                ? translations?.websiteSlug?.available || 'This URL is available!' 
                : translations?.websiteSlug?.notAvailable || 'This URL is not available. Please try another.'}
            </motion.div>
          )}
        </div>

          <motion.div
            variants={fadeIn}
            className="grid gap-4"
          >
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={loading || !isAvailable || !slug}
              className="w-full"
            >
              {loading ? translations?.websiteSlug?.saving || 'Saving...' : translations?.websiteSlug?.save || 'Save'}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error || translations?.websiteSlug?.error}</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
