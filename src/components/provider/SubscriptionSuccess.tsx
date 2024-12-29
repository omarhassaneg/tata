import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { ExternalLink, Copy, Instagram } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

export default function SubscriptionSuccess() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [hasPreviewedWebsite, setHasPreviewedWebsite] = useState(false);
  const websiteUrl = `https://web.glamic.com/${state.websiteSlug}`;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewWebsite = () => {
    window.open(websiteUrl, '_blank');
    setHasPreviewedWebsite(true);
  };

  const handleGoToAccount = () => {
    dispatch({ type: 'SET_STEP', payload: 32 });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#B8977E', '#0F1C2E', '#FFD700', '#FFF']}
        />
      )}
      
      <motion.div 
        className="w-full max-w-xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Heading className="mb-4">
            {translations?.subscriptionSuccess?.title || "Welcome to Glamic! 🎉"}
          </Heading>
          <Text>
            {translations?.subscriptionSuccess?.subtitle || "Your professional website is ready. Share it with your clients and start accepting bookings!"}
          </Text>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 mb-8"
        >
          <div className="flex items-center justify-between gap-4 mb-6 overflow-hidden">
            <Text className="font-medium flex-1 text-left text-gray-900 dark:text-white">{websiteUrl}</Text>
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-colors"
              title={translations?.subscriptionSuccess?.websiteUrl?.copyTooltip || "Copy link"}
            >
              {copied ? (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-primary-gold"
                >
                  {translations?.subscriptionSuccess?.websiteUrl?.copied || "✓"}
                </motion.span>
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
            <Instagram className="w-4 h-4 flex-shrink-0" />
            <span>{translations?.subscriptionSuccess?.websiteUrl?.instagramHint || "Add this link to your Instagram bio to start accepting bookings directly from your profile"}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <Button
            variant="primary"
            onClick={handlePreviewWebsite}
            className="w-full group"
          >
            <span>{translations?.subscriptionSuccess?.actions?.previewWebsite || "Preview Your Website"}</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            onClick={handleGoToAccount}
            className={`w-full transition-all duration-300 ${!hasPreviewedWebsite ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasPreviewedWebsite}
          >
            {translations?.subscriptionSuccess?.actions?.goToAccount || "Go to Account"}
          </Button>

          <Text className="text-sm text-gray-500">
            {hasPreviewedWebsite 
              ? translations?.subscriptionSuccess?.actions?.accountHint?.ready || 'Access your calendar and manage your business'
              : translations?.subscriptionSuccess?.actions?.accountHint?.preview || 'Preview your website first to enable account access'}
          </Text>
        </motion.div>
      </motion.div>
    </div>
  );
}
