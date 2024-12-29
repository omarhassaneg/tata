import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';

export function BackButton() {
  const { state, dispatch } = useOnboarding();

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: state.step - 1 });
  };

  return (
    <button
      onClick={handleBack}
      className="absolute left-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}