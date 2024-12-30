import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Clock, Shield } from 'lucide-react';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Layout } from '../../ui/Layout';

interface PlanCardProps {
  type: 'yearly' | 'monthly';
  price: string;
  savings?: string;
  selected: boolean;
  onSelect: () => void;
}

function PlanCard({ type, price, savings, selected, onSelect }: PlanCardProps) {
  const { translations } = useLanguage();
  return (
    <motion.div
      variants={fadeIn}
      onClick={onSelect}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border
        ${selected 
          ? 'bg-primary-navy text-white ring-2 ring-primary-gold border-transparent' 
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-gray-200 dark:border-white/10'}`}
    >
      {savings && (
        <div className="absolute -top-3 right-6 px-4 py-1 bg-primary-gold text-white text-sm font-medium rounded-full">
          {translations?.subscriptionPlans?.plans?.yearly?.savings}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {type === 'yearly' 
              ? translations?.subscriptionPlans?.plans?.yearly?.title 
              : translations?.subscriptionPlans?.plans?.monthly?.title}
          </h3>
          <Text className={`text-sm ${selected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {type === 'yearly'
              ? translations?.subscriptionPlans?.plans?.yearly?.subtitle
              : translations?.subscriptionPlans?.plans?.monthly?.subtitle}
          </Text>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${selected ? 'border-white bg-white/10' : 'border-gray-300'}`}>
          {selected && <Check className="w-4 h-4" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{price}</span>
        <span className={`text-sm ${selected ? 'text-white/80' : 'text-gray-500'}`}>
          /{type === 'yearly' ? 'year' : 'month'}
        </span>
      </div>
    </motion.div>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
}

function Feature({ icon, title }: FeatureProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary-gold/10 rounded-lg text-primary-gold">
        {icon}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-200">{title}</span>
    </div>
  );
}

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('monthly');
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();

  return (
    <Layout maxWidth="md">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.subscriptionPlans?.badge}</span>
        </motion.div>
        
        <Heading className="mb-2">{translations?.subscriptionPlans?.title}</Heading>
        
        <Text className="text-gray-600 dark:text-gray-200">
          {translations?.subscriptionPlans?.subtitle}
        </Text>
      </div>

      <motion.div variants={staggerChildren} className="space-y-6">
        {/* Plan Selection */}
        <div className="grid gap-4">
          <PlanCard
            type="yearly"
            price="$239.99"
            savings={translations?.subscriptionPlans?.plans?.yearly?.savings}
            selected={selectedPlan === 'yearly'}
            onSelect={() => setSelectedPlan('yearly')}
          />
          
          <PlanCard
            type="monthly"
            price="$24.99"
            selected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
          />
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4">
          <Feature
            icon={<Sparkles className="w-4 h-4" />}
            title={translations?.subscriptionPlans?.features?.booking || ""}
          />
          
          <Feature
            icon={<Clock className="w-4 h-4" />}
            title={translations?.subscriptionPlans?.features?.automation || ""}
          />
          
          <Feature
            icon={<Shield className="w-4 h-4" />}
            title={translations?.subscriptionPlans?.features?.security || ""}
          />
        </div>

        {/* Action */}
        <div className="space-y-4">
          <Button
            variant="primary"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 32 })}
            className="w-full"
          >
            {translations?.subscriptionPlans?.action?.button}
          </Button>
          
          <Text className="text-sm text-center text-gray-500 dark:text-gray-400">
            {translations?.subscriptionPlans?.action?.disclaimer}
          </Text>
        </div>
      </motion.div>
    </Layout>
  );
}
