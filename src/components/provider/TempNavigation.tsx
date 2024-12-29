import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

const stepGroups = [
  {
    title: 'Account Setup',
    steps: [
      { id: 1, name: 'Auth' },
      { id: 2, name: 'Sign Up' },
      { id: 3, name: 'Phone Verify' },
      { id: 4, name: 'Email Verify' }
    ]
  },
  {
    title: 'Business Details',
    steps: [
      { id: 5, name: 'Services' },
      { id: 6, name: 'Location' },
      { id: 7, name: 'Address' },
      { id: 8, name: 'Area' },
      { id: 9, name: 'Success' }
    ]
  },
  {
    title: 'Business Settings',
    steps: [
      { id: 10, name: 'Your Services' }, 
      { id: 11, name: 'Policies & Waivers' },
      { id: 12, name: 'Schedule' },
      { id: 13, name: 'Availability' },
      { id: 14, name: 'Success' }
    ]
  },
  {
    title: 'Website Setup',
    steps: [
      { id: 15, name: 'Contact' },
      { id: 16, name: 'Theme' },
      { id: 17, name: 'URL' },
      { id: 18, name: 'Logo' },
      { id: 19, name: 'Cover' },
      { id: 20, name: 'Headline' },
      { id: 21, name: 'Subheadline' },
      { id: 22, name: 'Portfolio' },
      { id: 23, name: 'Bio' },
      { id: 24, name: 'Verify' },
      { id: 25, name: 'Success' }    
    ]
  },
  {
    title: 'Payment Setup',
    steps: [
      { id: 26, name: 'Deposit' },
      { id: 27, name: 'Balance' },
      { id: 28, name: 'Cash' },
      { id: 29, name: 'Cards' },
      { id: 30, name: 'Subscribe' },
      { id: 31, name: 'Success' }
    ]
  }
];

const allSteps = stepGroups.flatMap(group => group.steps);

export default function TempNavigation() {
  const { state, dispatch } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);

  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const currentStepIndex = allSteps.findIndex(s => s.id === state.step);
  const prevStep = allSteps[currentStepIndex - 1];
  const nextStep = allSteps[currentStepIndex + 1];
  const currentStep = allSteps[currentStepIndex];

  const currentGroup = stepGroups.find(group => 
    group.steps.some(step => step.id === state.step)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 z-50">
      <div className="max-w-2xl mx-auto">
        {isExpanded && (
          <div className="p-4 space-y-4">
            {stepGroups.map((group, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">{group.title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.steps.map(step => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        step.id === state.step
                          ? 'bg-primary-navy text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {step.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 p-4">
          <div
            onClick={() => prevStep && goToStep(prevStep.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              prevStep
                ? 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{prevStep?.name || ''}</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2 bg-primary-navy text-white rounded-lg"
          >
            <div className="text-sm font-medium">
              {currentGroup?.title}: {currentStep?.name}
            </div>
          </button>

          <div
            onClick={() => nextStep && goToStep(nextStep.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              nextStep
                ? 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">{nextStep?.name || ''}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}