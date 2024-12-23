import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Smartphone, QrCode } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { Layout } from './ui/Layout';

export default function AppDownload() {
  const isMobile = window.innerWidth <= 768;
  const qrCodeUrl = 'https://groomee-storage.s3.us-east-2.amazonaws.com/glamic-qr-code-website-download.png';
  const appStoreUrl = '#'; // Replace with actual App Store URL
  const playStoreUrl = '#'; // Replace with actual Play Store URL

  const handleDownload = () => {
    // Check if user is on iOS or Android and redirect to appropriate store
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    window.location.href = isIOS ? appStoreUrl : playStoreUrl;
  };

  return (
    <Layout maxWidth="md">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Mobile App</span>
        </motion.div>
        
        <Heading className="mb-4">Download Glamic</Heading>
        
        <Text className="max-w-md mx-auto">
          Experience the future of beauty business management on your mobile device.
          Our web experience is coming soon!
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-8"
      >
        {isMobile ? (
          <Button
            variant="primary"
            onClick={handleDownload}
            className="w-full"
          >
            Download App
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-sm">
              <img 
                src={qrCodeUrl}
                alt="Download Glamic App"
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <QrCode className="w-4 h-4" />
              <span>Scan QR code with your mobile device</span>
            </div>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Available for iOS and Android devices
            </Text>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}