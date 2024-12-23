import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Button } from './ui/Button';
import { PhoneInput } from './ui/PhoneInput';
import { Heading, Text } from './ui/Typography';
import { fadeIn, staggerChildren } from './ui/animations';
import { validateEmail } from '../utils/validation';
import { Layout } from './ui/Layout';
import { useLanguage } from '../context/LanguageContext';
import { Input } from './ui/Input';

interface Question {
  id: string;
  field: keyof FormData;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
  validate?: (value: string) => string | undefined;
}

interface FormData {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  instagram: string;
  phone: string;
}

export default function SignUpForm() {
  const { state, dispatch } = useOnboarding();
  const { translations = {} } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<FormData>(() => ({
    businessName: state?.userData?.businessName || '',
    firstName: state?.userData?.firstName || '',
    lastName: state?.userData?.lastName || '',
    email: state?.userData?.email || '',
    instagram: state?.userData?.instagram || '',
    phone: state?.userData?.phone || ''
  }));

  const questions: Question[] = [
    ...(state?.userData?.phone ? [] : [{
      id: 'phone',
      field: 'phone' as keyof FormData,
      label: translations.signup?.phoneNumber?.title || '',
      placeholder: translations.signup?.phoneNumber?.placeholder || '',
      type: 'tel',
      required: true
    }]),
    {
      id: 'businessName',
      field: 'businessName' as keyof FormData,
      label: translations.signup?.businessName?.title || '',
      placeholder: translations.signup?.businessName?.placeholder || '',
      type: 'text'
    },
    {
      id: 'firstName',
      field: 'firstName' as keyof FormData,
      label: translations.signup?.firstName?.title || '',
      placeholder: translations.signup?.firstName?.placeholder || '',
      type: 'text',
      required: true
    },
    {
      id: 'lastName',
      field: 'lastName' as keyof FormData,
      label: translations.signup?.lastName?.title || '',
      placeholder: translations.signup?.lastName?.placeholder || '',
      type: 'text',
      required: true
    },
    ...(state?.userData?.email ? [] : [{
      id: 'email',
      field: 'email' as keyof FormData,
      label: translations.signup?.email?.title || '',
      placeholder: translations.signup?.email?.placeholder || '',
      type: 'email',
      required: true,
      validate: (value: string) => !validateEmail(value) ? translations.signup?.validation?.email : undefined
    }]),
    {
      id: 'instagram',
      field: 'instagram' as keyof FormData,
      label: translations.signup?.instagram?.title || '',
      placeholder: translations.signup?.instagram?.placeholder || '',
      type: 'text'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.field]: value
    }));
    setError(undefined);
  };

  const validateCurrentQuestion = (): boolean => {
    if (currentQuestion.required && !formData[currentQuestion.field]) {
      setError(translations.signup?.validation?.required || undefined);
      return false;
    }

    if (currentQuestion.validate) {
      const validationError = currentQuestion.validate(formData[currentQuestion.field]);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentQuestion()) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        // Update form data and ensure phone is preserved
        dispatch({
          type: 'SET_USER_DATA',
          payload: {
            ...formData,
            // Preserve existing phone if it exists, otherwise use form data phone
            phone: state.userData.phone || formData.phone,
            // Set auth method to indicate this is from signup form
            authMethod: formData.phone ? 'phone' : 'email'
          }
        });

        // Skip verification steps for social login
        if (state.userData.authMethod === 'social') {
          dispatch({ type: 'SET_STEP', payload: 5 }); // Go directly to ServicesSelection
        } else {
          dispatch({ type: 'SET_STEP', payload: 3 }); // Go to VerificationCode
        }
      } catch (err) {
        console.error('Error saving user data:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleNext();
    }
  };

  return (
    <Layout maxWidth="md">
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8 w-full"
      >
        <div className="text-center space-y-4">
          <Heading>{currentQuestion.label}</Heading>
          {currentQuestion.field === 'businessName' && (
            <Text className="text-gray-500 dark:text-gray-400">
              {translations.signup?.businessName?.hint || ''}
            </Text>
          )}
        </div>

        <div className="max-w-md mx-auto">
          {currentQuestion.field === 'phone' ? (
            <PhoneInput
              value={formData[currentQuestion.field]}
              onChange={handleInputChange}
              error={error}
              required={currentQuestion.required}
            />
          ) : (
            <Input
              type={currentQuestion.type}
              value={formData[currentQuestion.field]}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentQuestion.placeholder}
              error={error}
              fullWidth
              autoFocus
            />
          )}

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={loading}
              className="w-full max-w-xs"
            >
              {loading ? 'Please wait...' : 
               currentQuestionIndex === questions.length - 1 ? translations.signup?.complete || '' : translations.signup?.continue || ''}
            </Button>

            <div className="flex gap-2 mt-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? 'w-8 bg-primary-gold'
                      : index < currentQuestionIndex
                      ? 'bg-primary-gold'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
