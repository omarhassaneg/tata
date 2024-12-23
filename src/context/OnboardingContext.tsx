import React, { createContext, useContext, useReducer } from 'react';
import type { OnboardingState, OnboardingAction } from '../types/onboarding';

const initialState: OnboardingState = {
  step: 1,
  userData: {
    businessName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    instagram: '',
    verificationCode: '',
    displaySettings: {
      showPhone: false,
      showEmail: false,
      showInstagram: false
    }
  },
  services: [
    { id: '1', name: 'Makeup', icon: 'palette', selected: false },
    { id: '2', name: 'Nails', icon: 'scissors', selected: false },
    { id: '3', name: 'Spray Tan', icon: 'spray', selected: false },
    { id: '4', name: 'Hair', icon: 'scissors', selected: false },
    { id: '5', name: 'Waxing', icon: 'bath', selected: false },
    { id: '6', name: 'Esthetics', icon: 'user', selected: false },
    { id: '7', name: 'Henna', icon: 'sparkles', selected: false },
    { id: '8', name: 'Eyelashes', icon: 'eye', selected: false },
    { id: '9', name: 'Eyelashes Eyebrows', icon: 'eye', selected: false },
    { id: '10', name: 'Hairstyling', icon: 'scissors', selected: false },
    { id: '11', name: 'Barber', icon: 'scissors', selected: false },
    { id: '12', name: 'Wedding', icon: 'crown', selected: false },
  ],
  serviceLocation: {
    type: 'mobile',
    address: '',
    billingAddress: '',
    sameAsBilling: true,
    mobileRadius: 50,
    travelFeePerKm: 1,
    minTravelFee: 15,
    minimumSpend: 60,
    scheduleSettings: {
      bookingWindow: '1y',
      minimumNotice: '24h',
      rescheduleWindow: '24h'
    }
  },
  loading: false,
  error: null,
  paymentSettings: {
    cashInstructions: '',
    depositPercentage: 20,
    balanceReminderTiming: '3d'
  }
};

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}>({ state: initialState, dispatch: () => null });

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: { 
          ...state.userData,
          ...action.payload,
          displaySettings: {
            ...state.userData.displaySettings,
            ...(action.payload.displaySettings || {})
          }
        },
      };
    case 'SET_SERVICES':
      return {
        ...state,
        services: action.payload,
      };
    case 'SET_SERVICE_LOCATION':
      return {
        ...state,
        serviceLocation: action.payload,
      };
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_WEBSITE_THEME':
      return {
        ...state,
        websiteTheme: action.payload,
      };
    case 'SET_WEBSITE_SLUG':
      return {
        ...state,
        websiteSlug: action.payload,
      };
    case 'SET_WEBSITE_LOGO':
      return {
        ...state,
        websiteLogo: action.payload,
      };
    case 'SET_WEBSITE_COVER':
      return {
        ...state,
        websiteCover: action.payload,
      };
    case 'SET_WEBSITE_HEADLINE':
      return {
        ...state,
        websiteHeadline: action.payload,
      };
    case 'SET_WEBSITE_BIO':
      return {
        ...state,
        websiteBio: action.payload,
      };
    case 'SET_PROFILE_PHOTO':
      return {
        ...state,
        profilePhoto: action.payload,
      };
    case 'SET_PAYMENT_SETTINGS':
      return {
        ...state,
        paymentSettings: {
          ...state.paymentSettings,
          ...action.payload
        },
      };
    default:
      return state;
  }
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}