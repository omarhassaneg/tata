import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';

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

export default function WebsiteSuccess() {
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
            {translations?.websiteSuccess?.title || "Settings Completed"}
          </Heading>
          
          <Text className="text-gray-600">
            {translations?.websiteSuccess?.subtitle || "Now, let's design your website in under 1 minute"}
          </Text>

          <motion.div
            variants={textVariants}
            className="pt-8"
          >
            <Button 
              variant="primary" 
              className="group"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 15 })}
            >
              <span>{translations?.websiteSuccess?.continue || "Continue"}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
