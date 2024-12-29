import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { Layout } from '../../ui/Layout';
import { useLanguage } from '../../context/LanguageContext';

export default function EmailVerification() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
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

  const handleCodeChange = async (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }

      // If all digits are filled, proceed
      if (newCode.every((digit) => digit) && value) {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          dispatch({
            type: "SET_USER_DATA",
            payload: { emailVerificationCode: newCode.join("") },
          });
          
          // Simulate API verification (replace with actual API call)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Only proceed if verification is successful
          dispatch({ type: "SET_STEP", payload: 5 }); // Move to services selection
        } catch (error) {
          console.error('Verification error:', error);
          dispatch({ 
            type: "SET_ERROR", 
            payload: "Verification failed. Please try again." 
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (state.loading) {
    return (
      <Layout maxWidth="md">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying...</p>
        </div>
      </Layout>
    );
  }

  if (state.error) {
    return (
      <Layout maxWidth="md">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{state.error}</p>
          <button
            onClick={() => {
              dispatch({ type: "SET_ERROR", payload: null });
              setCode(["", "", "", ""]);
              if (firstInputRef.current) {
                firstInputRef.current.focus();
              }
            }}
            className="text-primary-gold hover:text-primary-gold/80"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout maxWidth="md">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center dark:text-white">
        {translations.verification?.email?.title || "Verify Your Email"}
      </h1>

      <p className="text-gray-600 text-center mb-8 dark:text-gray-400">
        {translations.verification?.email?.message?.replace('{email}', state.userData.email) || 
         `Enter the 4-digit code sent to ${state.userData.email}`}
      </p>

      <motion.div {...staggerChildren} className="flex justify-center gap-4 mb-8">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={index === 0 ? firstInputRef : null}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-16 h-16 text-center text-2xl border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-gold focus:ring-0 bg-white dark:bg-primary-navy/50 text-gray-900 dark:text-white"
          />
        ))}
      </motion.div>

      <p className="text-center text-gray-600 dark:text-gray-400">
        {translations.verification?.common?.codeExpires?.replace('{seconds}', timeLeft.toString()) || 
         `Code expires in ${timeLeft} seconds`}
      </p>

      {timeLeft === 0 && (
        <button
          onClick={() => setTimeLeft(59)}
          className="mt-4 w-full text-primary-gold py-2 hover:text-primary-gold/80"
        >
          {translations.verification?.common?.resendCode || "Resend Code"}
        </button>
      )}
    </Layout>
  );
}
