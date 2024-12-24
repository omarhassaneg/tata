import React from 'react';
import { OnboardingProvider } from './context/OnboardingContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/ui/Header';
import AuthOptions from './components/AuthOptions';
import SignUpForm from './components/SignUpForm';
import VerificationCode from './components/VerificationCode';
import EmailVerification from './components/EmailVerification';
import ServicesSelection from './components/ServicesSelection';
import ServiceLocation from './components/ServiceLocation';
import AddressInput from './components/AddressInput';
import SuccessCompletion from './components/SuccessCompletion';
import WebsiteSuccess from './components/WebsiteSuccess';
import PoliciesConfirmation from './components/PoliciesConfirmation';
import ScheduleConfirmation from './components/ScheduleConfirmation';
import AvailabilityConfirmation from './components/AvailabilityConfirmation';
import ServiceConfirmation from './components/ServiceConfirmation';
import ServiceArea from './components/ServiceArea';
import WebsiteThemeSelection from './components/WebsiteThemeSelection';
import WebsiteSlug from './components/WebsiteSlug';
import WebsiteLogo from './components/WebsiteLogo';
import WebsiteCover from './components/WebsiteCover';
import WebsiteMainHeadline from './components/WebsiteMainHeadline';
import WebsiteSubheadline from './components/WebsiteSubheadline';
import WebsitePortfolio from './components/WebsitePortfolio';
import WebsiteBio from './components/WebsiteBio';
import MarketplaceVerification from './components/MarketplaceVerification';
import DepositSettings from './components/DepositSettings';
import CashPaymentSettings from './components/CashPaymentSettings';
import BalanceReminder from './components/BalanceReminder';
import WebsitePaymentsSuccess from './components/WebsitePaymentsSuccess';
import CreditCardPayments from './components/CreditCardPayments';
import SubscriptionPlans from './components/SubscriptionPlans';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import AppDownload from './components/AppDownload';
import ContactDisplaySettings from './components/ContactDisplaySettings';
import { useOnboarding } from './context/OnboardingContext';

function OnboardingFlow() {
  const { state, dispatch } = useOnboarding();

  const renderStep = () => {
    // Skip ServiceArea step if studio-only is selected
    if (state.step === 8 && state.serviceLocation.type === 'studio') {
      dispatch({ type: 'SET_STEP', payload: 9 });
      return null;
    }

    switch (state.step) {
      case 1:
        return <AuthOptions />;
      case 2:
        return <SignUpForm />;
      case 3:
        return <VerificationCode />;
      case 4:
        return <EmailVerification />;
      case 5:
        return <ServicesSelection />;
      case 6:
        return <ServiceLocation />;
      case 7:
        return <AddressInput />;
      case 8: 
        return <ServiceArea />;
      case 9: 
        return <SuccessCompletion />;
      case 10:
        return <ServiceConfirmation />;
      case 11:
        return <PoliciesConfirmation />;
      case 12:
        return <ScheduleConfirmation />;
      case 13:
        return <AvailabilityConfirmation />;
      case 14:
        return <WebsiteSuccess />;
      case 15:
        return <ContactDisplaySettings />;
      case 16:
        return <WebsiteThemeSelection />;
      case 17:
        return <WebsiteSlug />;
      case 18:
        return <WebsiteLogo />;
      case 19:
        return <WebsiteCover />;
      case 20:
        return <WebsiteMainHeadline />;
      case 21:
        return <WebsiteSubheadline />;
      case 22:
        return <WebsitePortfolio />;
      case 23:
        return <WebsiteBio />;
      case 24:
        return <MarketplaceVerification />;
      case 25:
        return <WebsitePaymentsSuccess />;
      case 26:
        return <DepositSettings />;
      case 27:
        return <BalanceReminder />;
      case 28:
        return <CashPaymentSettings />;
      case 29:
        return <CreditCardPayments />;
      case 30:
        return <SubscriptionPlans />;
      case 31:
        return <SubscriptionSuccess />;
      case 32:
        return <AppDownload />;
      default:
        return <AuthOptions />;
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto pb-safe">
        <div className={`w-full ${state.step === 4 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto px-[7.5px] sm:px-4 md:px-6 py-4 md:py-6`}>
        {renderStep()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <OnboardingFlow />
        </OnboardingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
