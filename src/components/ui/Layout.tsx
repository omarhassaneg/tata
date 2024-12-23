import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { fadeIn } from './animations';
import { BackButton } from './BackButton';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBackButton?: boolean;
}

const maxWidths = {
  sm: 'max-w-sm',   // 24rem
  md: 'max-w-md',   // 28rem
  lg: 'max-w-lg',   // 32rem
  xl: 'max-w-xl',   // 36rem
  '2xl': 'max-w-2xl' // 42rem
};

export function Layout({ children, maxWidth = 'md', showBackButton = true }: LayoutProps) {
  const { state } = useOnboarding();
  
  // Don't show back button on verification, success, or subscription pages
  const hideBackButton = [
    3, // VerificationCode
    4, // EmailVerification
    5, // ServicesSelection
    9, // SuccessCompletion
    10, // ServiceConfirmation
    14, // WebsiteSuccess
    15, // ContactDisplaySettings 
    25, // WebsitePaymentsSuccess
    26, // DepositSettings
    30, // SubscriptionPlans
    31, // SubscriptionSuccess
  ].includes(state.step);
  return (
    <div className="flex flex-col flex-1">
      <motion.div 
        {...fadeIn}
        className={`w-full ${maxWidths[maxWidth]} mx-auto flex-1 flex flex-col relative`}
      >
        {showBackButton && !hideBackButton && <BackButton />}
        {children}
      </motion.div>
    </div>
  );
}
