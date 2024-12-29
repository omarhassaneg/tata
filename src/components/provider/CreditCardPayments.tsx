import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { CreditCard, Smartphone, Banknote, Clock } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { Layout } from '../../ui/Layout';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      variants={fadeIn}
      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex items-start gap-4"
    >
      <div className="p-2 bg-primary-gold/10 rounded-xl text-primary-gold">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <Text className="text-sm">{description}</Text>
      </div>
    </motion.div>
  );
}

export default function CreditCardPayments() {
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();

  const handleSkip = () => {
    dispatch({ type: 'SET_STEP', payload: 30 });
  };

  return (
    <Layout maxWidth="md">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.creditCardPayments?.badge || "Card Payments"}</span>
        </motion.div>
        
        <Heading className="mb-4">{translations?.creditCardPayments?.title || "Accept Card Payments"}</Heading>
        
        <Text className="max-w-2xl mx-auto">
          {translations?.creditCardPayments?.subtitle || "Let clients pay securely with credit cards, Apple Pay, and more. Powered by Stripe's trusted payment processing."}
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-4 mb-8 max-w-xl mx-auto"
      >
        <FeatureCard
          icon={<CreditCard className="w-5 h-5" />}
          title={translations?.creditCardPayments?.features?.cards?.title || "Credit & Debit Cards"}
          description={translations?.creditCardPayments?.features?.cards?.description || "Accept all major credit and debit cards securely"}
        />
        
        <FeatureCard
          icon={<Smartphone className="w-5 h-5" />}
          title={translations?.creditCardPayments?.features?.digitalWallets?.title || "Digital Wallets"}
          description={translations?.creditCardPayments?.features?.digitalWallets?.description || "Apple Pay, Google Pay, and tap-to-pay on your phone"}
        />
        
        <FeatureCard
          icon={<Clock className="w-5 h-5" />}
          title={translations?.creditCardPayments?.features?.financing?.title || "Affirm Financing"}
          description={translations?.creditCardPayments?.features?.financing?.description || "Let clients split payments into easy installments"}
        />
        
        <FeatureCard
          icon={<Banknote className="w-5 h-5" />}
          title={translations?.creditCardPayments?.features?.pricing?.title || "Simple Pricing"}
          description={translations?.creditCardPayments?.features?.pricing?.description || "4% per transaction. No hidden fees or monthly charges"}
        />
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="space-y-4"
      >
        <Button
          variant="primary"
          disabled
          className="w-full"
        >
          {translations?.creditCardPayments?.setup || "Setup Card Payments"}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSkip}
          className="w-full"
        >
          {translations?.creditCardPayments?.skip || "Skip for Now"}
        </Button>
      </motion.div>
    </Layout>
  );
}
