import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Shield, FileCheck, AlertCircle, FileWarning, ScrollText } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { useLanguage } from '../context/LanguageContext';
import { Layout } from './ui/Layout';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <motion.div 
      variants={fadeIn}
      className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-2xl p-6 flex items-center gap-4"
    >
      <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-xl text-primary-gold dark:text-white">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
}

export default function PoliciesConfirmation() {
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();

  const handleAccept = () => {
    dispatch({ type: 'SET_STEP', payload: 12 });
  };

  return (
    <Layout maxWidth="2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">{translations?.policies?.badge || "Business Protection"}</span>
          </motion.div>
        
          <Heading>{translations?.policies?.title || "Policies & Waivers"}</Heading>
          <Text className="text-center mb-8 max-w-xl mx-auto">
            {translations?.policies?.subtitle || "We've created comprehensive policies and waivers for your business so you don't have to start from scratch. You can customize them to fit your needs."}
          </Text>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="grid gap-4 mb-12"
          style={{ pointerEvents: 'none' }}
        >
          <StatCard
            icon={<FileCheck className="w-5 h-5" />}
            value={translations?.policies?.stats?.policies?.value || "10 Policies"}
            label={translations?.policies?.stats?.policies?.label || "Pre-written business policies"}
          />
        
          <StatCard
            icon={<ScrollText className="w-5 h-5" />}
            value={translations?.policies?.stats?.waivers?.value || "7 Waivers"}
            label={translations?.policies?.stats?.waivers?.label || "Ready-to-use protection agreements"}
          />
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleAccept}
            className="w-full"
            fullWidth
          >
            {translations?.policies?.continue || "Continue"}
          </Button>
        </motion.div>
    </Layout>
  );
}
