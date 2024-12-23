import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Type, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { saveWebsiteSubheadline } from '../services/api';
import { Layout } from './ui/Layout';

export default function WebsiteSubheadline() {
  const { state, dispatch } = useOnboarding();
  const [subheadline, setSubheadline] = useState('Personalized beauty services delivered with expertise and care');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Saving subheadline:', subheadline);
      const response = await saveWebsiteSubheadline(subheadline);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save subheadline');
      }

      console.log('Subheadline saved successfully:', response.data);
      
      // Update state with confirmed subheadline
      dispatch({ 
        type: 'SET_WEBSITE_HEADLINE', 
        payload: { 
          title: state.websiteHeadline?.title || '',
          subtitle: subheadline.trim()
        }
      });
      
      // Navigate to WebsitePortfolio
      dispatch({ type: 'SET_STEP', payload: 22 });
    } catch (err) {
      console.error('Error saving subheadline:', err);
      setError('Failed to save subheadline. Please try again.');
    } finally {
      setLoading(false);
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
            <Type className="w-4 h-4" />
            <span className="text-sm font-medium">Subheadline</span>
          </motion.div>
          
          <Heading className="mb-4">Add Your Subheadline</Heading>
          
          <Text className="max-w-md mx-auto">
            Your subheadline provides additional context and supports your main message. 
            Use it to highlight key benefits or unique selling points.
          </Text>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="space-y-8"
        >
        <div className="space-y-6">
          {/* Examples */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border-2 border-gray-200 dark:border-white/10">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Example Subheadlines:</Text>
            <div className="space-y-4 text-gray-600">
              <div className="text-sm text-gray-700 dark:text-gray-300">"Bringing out your natural beauty for weddings, events, and photoshoots"</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">"Creating stunning looks that make you feel confident and beautiful"</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">"Personalized beauty services delivered with expertise and care"</div>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subheadline
            </label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Enter your subheadline..."
              className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg resize-none bg-white dark:bg-primary-navy/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              rows={2}
              maxLength={120}
            />
            <Text className="text-sm text-gray-500 text-right">
              {subheadline.length}/120 characters
            </Text>
          </div>
        </div>

          <motion.div
            variants={fadeIn}
            className="grid gap-4"
          >
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
