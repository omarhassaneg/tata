import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Smartphone, QrCode, CheckCircle, CreditCard } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { Layout } from '../../ui/Layout';

export default function AppDownload() {
  const { translations } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const qrCodeUrl = 'https://groomee-storage.s3.us-east-2.amazonaws.com/glamic-qr-code-website-download.png';
  const onelinkUrl = 'https://onelink.to/glamic_website';
  const manageSubscriptionUrl = '#'; // Replace with actual subscription management URL

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    window.location.href = onelinkUrl;
  };

  const handleManageSubscription = () => {
    window.location.href = manageSubscriptionUrl;
  };

  return (
    <Layout maxWidth="md">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
        >
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </motion.div>
        <Text className="font-medium text-green-800 dark:text-green-200 mb-1">
          {translations?.appDownload?.subscriptionSuccess || "Subscription Activated Successfully!"}
        </Text>
        <Text className="text-sm text-green-600 dark:text-green-300">
          {translations?.appDownload?.subscriptionMessage || "Your premium features are now unlocked"}
        </Text>
      </motion.div>

      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.appDownload?.badge || "Mobile App"}</span>
        </motion.div>
        
        <Heading className="mb-4">{translations?.appDownload?.title || "Download Glamic"}</Heading>
        
        <Text className="max-w-md mx-auto">
          {translations?.appDownload?.subtitle || "Experience the future of beauty business management on your mobile device. Our web experience is coming soon!"}
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-4"
      >
        {isMobile ? (
          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={handleDownload}
              className="w-full"
            >
              {translations?.appDownload?.downloadButton || "Download App"}
            </Button>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {translations?.appDownload?.manageSubscription || "Manage Subscription"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div 
              onClick={handleDownload}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-sm cursor-pointer transition-transform hover:scale-105"
            >
              <img 
                src={qrCodeUrl}
                alt="Download Glamic App"
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <QrCode className="w-4 h-4" />
              <span>{translations?.appDownload?.qrCodeInstruction || "Scan QR code to download"}</span>
            </div>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {translations?.appDownload?.availableDevices || "Available for iOS and Android devices"}
            </Text>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              className="w-full max-w-md"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {translations?.appDownload?.manageSubscription || "Manage Subscription"}
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
