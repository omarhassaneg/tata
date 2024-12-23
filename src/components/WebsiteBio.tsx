import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button'; 
import { FileText, AlertCircle, X, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { Layout } from './ui/Layout';
import { saveWebsiteBio } from '../services/api';

const MAX_CHARS = 500;
const DEFAULT_BIO = "With over 8 years of experience in professional makeup artistry, I specialize in creating stunning looks for weddings, special events, and photo shoots. My approach combines classic techniques with current trends to enhance your natural beauty. Whether you're planning your dream wedding or preparing for an important photo session, I'm here to help you look and feel your absolute best";

export default function WebsiteBio() {
  const { dispatch } = useOnboarding();
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setBio(text);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Saving bio:', bio);
      const response = await saveWebsiteBio(bio);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save bio');
      }

      console.log('Bio saved successfully:', response.data);
      
      // Update state with confirmed bio
      dispatch({ type: 'SET_WEBSITE_BIO', payload: bio.trim() });
      
      // Navigate to MarketplaceVerification
      dispatch({ type: 'SET_STEP', payload: 24 });
    } catch (err) {
      console.error('Error saving bio:', err);
      setError('Failed to save bio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const charsLeft = MAX_CHARS - bio.length;
  const isNearLimit = charsLeft < 50;

  return (
    <Layout maxWidth="xl">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Professional Bio</span>
        </motion.div>
        
        <Heading className="mb-4">Tell Your Story</Heading>
        
        <Text className="max-w-md mx-auto">
          Write a compelling bio that showcases your expertise and connects with potential clients.
        </Text>
      </div>

      <motion.div className="space-y-6">
        
<div className="max-w-4xl mx-auto bg-white dark:bg-white/5 p-6 rounded-2xl border-2 border-gray-200 dark:border-white/10">
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Example Bio:</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 italic">
            "With over 8 years of experience in professional makeup artistry, I specialize in creating 
            stunning looks for weddings, special events, and photo shoots. My approach combines classic 
            techniques with current trends to enhance your natural beauty. Whether you're planning your dream 
            wedding or preparing for an important photo session, I'm here to help you look and feel your 
            absolute best."
          </Text>
        </div>
        {/* Bio Input */}
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your professional bio here..."
              className="w-full h-64 px-8 py-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg resize-none bg-white dark:bg-primary-navy/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              rows={8}
              maxLength={MAX_CHARS}
            />
            <div 
              className={`absolute bottom-4 right-4 text-sm transition-colors
                ${isNearLimit 
                  ? charsLeft === 0 
                    ? 'text-red-500' 
                    : 'text-yellow-500' 
                  : 'text-gray-400'
                }`}
            >
              {charsLeft} characters remaining
            </div>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="max-w-4xl mx-auto grid gap-4 pt-4"
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
    </Layout>
  );
}
