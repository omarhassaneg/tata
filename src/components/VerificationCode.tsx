import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { fadeIn, staggerChildren } from './ui/animations';
import { Layout } from './ui/Layout';
import { useLanguage } from '../context/LanguageContext';

export default function VerificationCode() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();

  // Skip verification entirely for social logins
  useEffect(() => {
    if (state.userData.authMethod === 'social') {
      console.log('Social login detected - skipping verification entirely');
      dispatch({ type: 'SET_STEP', payload: 5 }); // Go directly to services
      return;
    }
  }, [state.userData.authMethod, dispatch]);

  const [timeLeft, setTimeLeft] = useState(59);
  const [code, setCode] = useState(['', '', '', '']);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Autofocus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      console.log('Code digit entered:', { index, value });
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        console.log('Moving focus to next input');
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }

      // If all digits are filled, proceed
      if (newCode.every((digit) => digit) && value) {
        console.log('Verification code complete:', newCode.join(''));
        dispatch({
          type: 'SET_USER_DATA', 
          payload: { phoneVerificationCode: newCode.join('') },
        });
        
        // For non-social logins, proceed to email verification
        console.log('Standard auth flow - proceeding to email verification');
        dispatch({ type: 'SET_STEP', payload: 4 }); // Go to email verification
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <Layout maxWidth="md">
      <Heading className="mb-4 text-center">
        {translations?.verification?.phone?.title || 'Verify your phone'}
      </Heading>

      <Text className="text-center mb-8">
        {(translations?.verification?.phone?.message || 'A verification code has been sent to your phone number: {phone}')
          .replace('{phone}', state.userData.phone || '')}
      </Text>
      
      <motion.div {...staggerChildren} className="flex justify-center gap-4 mb-8">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={index === 0 ? firstInputRef : null}
            id={`code-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-16 h-16 text-center text-2xl border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-gold focus:ring-0 bg-white dark:bg-primary-navy/50 text-gray-900 dark:text-white"
          />
        ))}
      </motion.div>
      
      <Text className="text-center">
        {(translations?.verification?.common?.codeExpires || 'Code expires in {seconds} seconds')
          .replace('{seconds}', timeLeft.toString())}
      </Text>
      
      {timeLeft === 0 && (
        <button
          onClick={() => setTimeLeft(59)}
          className="mt-4 w-full text-primary-gold dark:text-primary-gold py-2 hover:text-primary-gold/80"
        >
          {translations?.verification?.common?.resendCode || 'Resend code'}
        </button>
      )}
    </Layout>
  );
}
