import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading } from './ui/Typography';
import { Button } from './ui/Button';
import { Calendar, Clock, RefreshCw, CalendarRange, ChevronDown } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { useLanguage } from '../context/LanguageContext';
import { Layout } from './ui/Layout';
import { Dropdown, DropdownItem } from './ui/Dropdown';

const getBookingWindows = (translations: any) => [
  { value: '1m', label: translations.availability?.bookingWindow?.options?.['1m'] ?? '1 Month' },
  { value: '2m', label: translations.availability?.bookingWindow?.options?.['2m'] ?? '2 Months' },
  { value: '3m', label: translations.availability?.bookingWindow?.options?.['3m'] ?? '3 Months' },
  { value: '6m', label: translations.availability?.bookingWindow?.options?.['6m'] ?? '6 Months' },
  { value: '1y', label: translations.availability?.bookingWindow?.options?.['1y'] ?? '1 Year' },
  { value: '18m', label: translations.availability?.bookingWindow?.options?.['18m'] ?? '18 Months' },
];

const getNoticeOptions = (translations: any) => [
  { value: '4h', label: translations.availability?.minimumNotice?.options?.['4h'] ?? '4 Hours' },
  { value: '6h', label: translations.availability?.minimumNotice?.options?.['6h'] ?? '6 Hours' },
  { value: '24h', label: translations.availability?.minimumNotice?.options?.['24h'] ?? '24 Hours' },
  { value: '2d', label: translations.availability?.minimumNotice?.options?.['2d'] ?? '2 Days' },
  { value: '1w', label: translations.availability?.minimumNotice?.options?.['1w'] ?? '1 Week' },
];

const getRescheduleOptions = (translations: any) => [
  { value: '4h', label: translations.availability?.rescheduleWindow?.options?.['4h'] ?? '4 Hours' },
  { value: '6h', label: translations.availability?.rescheduleWindow?.options?.['6h'] ?? '6 Hours' },
  { value: '24h', label: translations.availability?.rescheduleWindow?.options?.['24h'] ?? '24 Hours' },
  { value: '2d', label: translations.availability?.rescheduleWindow?.options?.['2d'] ?? '2 Days' },
  { value: '1w', label: translations.availability?.rescheduleWindow?.options?.['1w'] ?? '1 Week' },
];

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  onClick?: () => void;
  isButton?: boolean;
  children?: React.ReactNode;
}

function StatCard({ icon, value, label, onClick, isButton, children }: StatCardProps) {
  const Component = isButton ? 'button' : 'div';
  return (
    <motion.div 
      variants={fadeIn}
      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-xl text-primary-gold dark:text-white">
        {icon}
      </div>
      <div className="flex-1">
        {children || <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>}
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
      {isButton && (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </motion.div>
  );
}

export default function AvailabilityConfirmation() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const t = {
    badge: translations.availability?.badge ?? 'Availability',
    title: translations.availability?.title ?? 'Set Your Availability',
    bookingWindow: {
      title: translations.availability?.bookingWindow?.title ?? 'Booking Window'
    },
    minimumNotice: {
      title: translations.availability?.minimumNotice?.title ?? 'Minimum Notice'
    },
    rescheduleWindow: {
      description: translations.availability?.rescheduleWindow?.description ?? 'Reschedule Window'
    },
    save: translations.availability?.save ?? 'Save & Continue'
  } as const;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNoticeDropdown, setShowNoticeDropdown] = useState(false);
  const [showRescheduleDropdown, setShowRescheduleDropdown] = useState(false);

  // Store only the values in state
  const [selectedWindowValue, setSelectedWindowValue] = useState(() => 
    state.serviceLocation.scheduleSettings?.bookingWindow ?? '1y'
  );
  const [selectedNoticeValue, setSelectedNoticeValue] = useState(() => 
    state.serviceLocation.scheduleSettings?.minimumNotice ?? '2d'
  );
  const [selectedRescheduleValue, setSelectedRescheduleValue] = useState(() => 
    state.serviceLocation.scheduleSettings?.rescheduleWindow ?? '2d'
  );

  // Get current options with translations
  const bookingWindows = getBookingWindows(translations);
  const noticeOptions = getNoticeOptions(translations);
  const rescheduleOptions = getRescheduleOptions(translations);

  // Get current selected options with translations
  const selectedWindow = bookingWindows.find(w => w.value === selectedWindowValue) || bookingWindows[4];
  const selectedNotice = noticeOptions.find(n => n.value === selectedNoticeValue) || noticeOptions[3];
  const selectedReschedule = rescheduleOptions.find(r => r.value === selectedRescheduleValue) || rescheduleOptions[3];

  const handleAccept = () => {
    // Save settings to context
    dispatch({
      type: 'SET_SERVICE_LOCATION',
      payload: {
        ...state.serviceLocation,
        scheduleSettings: {
          ...state.serviceLocation.scheduleSettings,
          bookingWindow: selectedWindowValue,
          minimumNotice: selectedNoticeValue,
          rescheduleWindow: selectedRescheduleValue
        }
      }
    });

    dispatch({ type: 'SET_STEP', payload: 14 });
  };

  return (
    <Layout maxWidth="2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{t.badge}</span>
          </motion.div>
        
          <Heading>{t.title}</Heading>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="grid gap-4 mb-12"
        >
          <div className="relative">
            <StatCard
              icon={<CalendarRange className="w-5 h-5" />}
              value={selectedWindow.label}
              label={t.bookingWindow.title}
              isButton
              onClick={() => setShowDropdown(!showDropdown)}
            />
          
            <Dropdown isOpen={showDropdown} onClose={() => setShowDropdown(false)}>
                {bookingWindows.map((window) => (
                  <DropdownItem
                    key={window.value}
                    onClick={() => {
                      setSelectedWindowValue(window.value);
                      setShowDropdown(false);
                    }}
                    selected={selectedWindowValue === window.value}
                  >
                    <span className="font-medium">{window.label}</span>
                  </DropdownItem>
                ))}
            </Dropdown>
          </div>
        
          <div className="relative">
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              value={selectedNotice.label}
              label={t.minimumNotice.title}
              isButton
              onClick={() => setShowNoticeDropdown(!showNoticeDropdown)}
            />
          
            <Dropdown isOpen={showNoticeDropdown} onClose={() => setShowNoticeDropdown(false)}>
                {noticeOptions.map((option) => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => {
                      setSelectedNoticeValue(option.value);
                      setShowNoticeDropdown(false);
                    }}
                    selected={selectedNoticeValue === option.value}
                  >
                    <span className="font-medium">{option.label}</span>
                  </DropdownItem>
                ))}
            </Dropdown>
          </div>
        
          <div className="relative">
            <StatCard
              icon={<RefreshCw className="w-5 h-5" />}
              value={selectedReschedule.label}
              label={t.rescheduleWindow.description}
              isButton
              onClick={() => setShowRescheduleDropdown(!showRescheduleDropdown)}
            />
          
            <Dropdown isOpen={showRescheduleDropdown} onClose={() => setShowRescheduleDropdown(false)}>
                {rescheduleOptions.map((option) => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => {
                      setSelectedRescheduleValue(option.value);
                      setShowRescheduleDropdown(false);
                    }}
                    selected={selectedRescheduleValue === option.value}
                    className="text-gray-900 dark:text-white"
                  >
                    <span className="font-medium">{option.label}</span>
                  </DropdownItem>
                ))}
            </Dropdown>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleAccept}
            fullWidth
          >
            {t.save}
          </Button>
        </motion.div>
    </Layout>
  );
}
