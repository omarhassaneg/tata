import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useOnboarding } from '../../context/OnboardingContext';

const checkmarkVariants = {
  hidden: { 
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  visible: { 
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 1
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.8
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export default function SuccessCompletion() {
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        className="flex flex-col items-center w-full max-w-md mx-auto"
        initial="hidden" 
        animate="visible"
        variants={containerVariants}>
        <motion.div 
          variants={checkmarkVariants}
          className="w-24 h-24 rounded-full bg-primary-gold flex items-center justify-center mb-8 shadow-lg shadow-primary-gold/20"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          variants={textVariants} 
          className="text-center space-y-6"
        >
          <Heading>
            {translations.success.title}
          </Heading>
          
          <Text className="text-gray-600">
            {translations.success.subtitle}
          </Text>
          
          <motion.div 
            variants={textVariants}
            className="grid gap-4 mt-8"
          > 
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => dispatch({ type: 'SET_STEP', payload: 10 })}
            >
              {translations.success.continue}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}