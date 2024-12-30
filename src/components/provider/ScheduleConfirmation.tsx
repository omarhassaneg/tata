import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading, Text } from '../../ui/Typography';
import { Button, Switch } from '../../ui/Button'; 
import { Clock, Copy as CopyIcon, MapPin, Home, Plus, X } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { useLanguage } from '../../context/LanguageContext';
import { Layout } from '../../ui/Layout';
import { saveSchedule } from '../../services/api';

interface ScheduleType {
  workDays: WorkDay[];
}

interface WorkDay {
  day: string;
  enabled: boolean;
  hours: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface ScheduleSettings {
  mobile?: ScheduleType;
  studio?: ScheduleType;
}

const defaultWorkDays: WorkDay[] = [
  { day: 'Monday', enabled: true, hours: [{ id: '1', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Tuesday', enabled: true, hours: [{ id: '2', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Wednesday', enabled: true, hours: [{ id: '3', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Thursday', enabled: true, hours: [{ id: '4', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Friday', enabled: true, hours: [{ id: '5', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Saturday', enabled: true, hours: [{ id: '6', startTime: '10:00', endTime: '20:00' }] },
  { day: 'Sunday', enabled: false, hours: [] },
];

interface DayCardProps {
  day: WorkDay;
  onUpdate: (updatedDay: WorkDay) => void;
  canCopyTo: WorkDay[];
  onCopyTo: (days: string[]) => void;
}

function DayCard({ day, onUpdate, canCopyTo, onCopyTo }: DayCardProps) {
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const { translations } = useLanguage();

  const handleTimeChange = (slotId: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedHours = day.hours.map(slot => 
      slot.id === slotId ? { ...slot, [field]: value } : slot
    );
    onUpdate({ ...day, hours: updatedHours });
  };

  const handleToggle = () => {
    if (!day.enabled) {
      onUpdate({ 
        ...day, 
        enabled: true, 
        hours: [{ id: crypto.randomUUID(), startTime: '10:00', endTime: '20:00' }] 
      });
    } else {
      onUpdate({ ...day, enabled: false, hours: [] });
    }
  };

  const handleAddSlot = () => {
    const newSlot = {
      id: crypto.randomUUID(),
      startTime: '10:00',
      endTime: '20:00'
    };
    onUpdate({ ...day, hours: [...day.hours, newSlot] });
  };

  const handleRemoveSlot = (slotId: string) => {
    const updatedHours = day.hours.filter(slot => slot.id !== slotId);
    onUpdate({ ...day, hours: updatedHours });
  };

  const handleCopyTo = () => {
    onCopyTo(selectedDays);
    setSelectedDays([]);
    setShowCopyDropdown(false);
  };

  return (
    <motion.div 
      variants={fadeIn} 
      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 transition-all relative"
    >
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Switch checked={day.enabled} onCheckedChange={handleToggle} />
          <span className="font-medium text-gray-900 dark:text-white">
            {translations?.schedule?.days?.[day.day.toLowerCase() as keyof typeof translations.schedule.days] || day.day}
          </span>
        </div>
        {day.enabled && (
          <button
            onClick={() => setShowCopyDropdown(!showCopyDropdown)}
            className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
            title="Copy hours to other days"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {day.enabled ? (
        <div className="space-y-4">
          {day.hours.map((slot, index) => (
            <div key={slot.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleTimeChange(slot.id, 'startTime', e.target.value)}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-lg w-[45%] sm:w-32 bg-white dark:bg-primary-navy dark:text-white text-center"
                />
                <span className="text-gray-400 dark:text-gray-500">
                  {translations?.schedule?.to || 'to'}
                </span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleTimeChange(slot.id, 'endTime', e.target.value)}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-lg w-[45%] sm:w-32 bg-white dark:bg-primary-navy dark:text-white text-center"
                />
              </div>
              <div className="flex gap-2 justify-end w-full sm:w-auto mt-2 sm:mt-0">
                {day.hours.length > 1 && (
                  <button
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {index === day.hours.length - 1 && (
                  <button
                    onClick={handleAddSlot}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          {translations?.schedule?.dayOff || 'Day off'}
        </span>
      )}

      {showCopyDropdown && canCopyTo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute ${isMobile ? 'left-0 right-0' : 'right-0 w-48'} top-0 -translate-y-full mt-[-10px] bg-white dark:bg-primary-navy/95 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 backdrop-blur-sm`}
        >
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="text-sm font-medium mb-2">Copy hours to:</div>
            {canCopyTo.map((targetDay) => (
              <label key={targetDay.day} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(targetDay.day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDays([...selectedDays, targetDay.day]);
                    } else {
                      setSelectedDays(selectedDays.filter(d => d !== targetDay.day));
                    }
                  }}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-gold focus:ring-primary-gold"
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {translations?.schedule?.days?.[targetDay.day.toLowerCase() as keyof typeof translations.schedule.days] || targetDay.day}
                </span>
              </label>
            ))}
          </div>
          <div className="p-2 flex justify-end gap-2">
            <button
              onClick={() => setShowCopyDropdown(false)}
              className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-900 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCopyTo}
              disabled={selectedDays.length === 0}
              className="px-3 py-1 text-sm bg-primary-gold text-white rounded-lg disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ScheduleConfirmation() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    mobile: state.serviceLocation.type === 'mobile' || state.serviceLocation.type === 'both'
      ? {
          workDays: state.serviceLocation.scheduleSettings?.mobile?.workDays || [...defaultWorkDays]
        }
      : undefined,
    studio: state.serviceLocation.type === 'studio' || state.serviceLocation.type === 'both'
      ? {
          workDays: state.serviceLocation.scheduleSettings?.studio?.workDays || [...defaultWorkDays]
        }
      : undefined
  });
  const [activeType, setActiveType] = useState<'mobile' | 'studio'>(
    state.serviceLocation.type === 'studio' ? 'studio' : 'mobile'
  );

  // Initialize schedule from saved state
  useEffect(() => {
    if (state.serviceLocation.scheduleSettings) {
      setScheduleSettings({
        mobile: state.serviceLocation.type === 'mobile' || state.serviceLocation.type === 'both'
          ? {
              workDays: state.serviceLocation.scheduleSettings.mobile?.workDays || [...defaultWorkDays]
            }
          : undefined,
        studio: state.serviceLocation.type === 'studio' || state.serviceLocation.type === 'both'
          ? {
              workDays: state.serviceLocation.scheduleSettings.studio?.workDays || [...defaultWorkDays]
            }
          : undefined
      });
    }
  }, [state.serviceLocation.scheduleSettings]);

  const handleDayUpdate = (type: 'mobile' | 'studio', index: number, updatedDay: WorkDay) => {
    const schedule = scheduleSettings[type];
    if (!schedule) return;
    
    const newWorkDays = [...schedule.workDays];
    newWorkDays[index] = updatedDay;
    
    setScheduleSettings({
      ...scheduleSettings,
      [type]: { workDays: newWorkDays }
    });
  };

  const handleDayRemove = (type: 'mobile' | 'studio', index: number) => {
    const schedule = scheduleSettings[type];
    if (!schedule) return;
    
    const newWorkDays = [...schedule.workDays];
    newWorkDays[index] = { ...newWorkDays[index], enabled: false };
    
    setScheduleSettings({
      ...scheduleSettings,
      [type]: { workDays: newWorkDays }
    });
  };

  const handleCopyTo = (type: 'mobile' | 'studio', fromIndex: number, targetDays: string[]) => {
    const schedule = scheduleSettings[type];
    if (!schedule) return;

    const sourceDay = schedule.workDays[fromIndex];
    const newWorkDays = schedule.workDays.map(day => {
      if (targetDays.includes(day.day)) {
        return {
          ...day,
          enabled: true,
          hours: sourceDay.hours.map(slot => ({
            ...slot,
            id: crypto.randomUUID()
          }))
        };
      }
      return day;
    });
    
    setScheduleSettings({
      ...scheduleSettings,
      [type]: { workDays: newWorkDays }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const scheduleToSave = {
      ...(state.serviceLocation.type === 'mobile' || state.serviceLocation.type === 'both' 
        ? { mobile: { workDays: scheduleSettings.mobile?.workDays || [] } }
        : {}),
      ...(state.serviceLocation.type === 'studio' || state.serviceLocation.type === 'both'
        ? { studio: { workDays: scheduleSettings.studio?.workDays || [] } }
        : {})
    };

    try {
      console.log('Saving schedule settings:', scheduleToSave);
      const response = await saveSchedule(scheduleToSave);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save schedule');
      }

      console.log('Schedule saved successfully:', response.data);

      // Update state with confirmed schedule
      dispatch({
        type: 'SET_SERVICE_LOCATION',
        payload: {
          ...state.serviceLocation,
          scheduleSettings
        }
      });

      // Navigate to next step
      dispatch({ type: 'SET_STEP', payload: 13 });
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('Failed to save schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentSchedule = scheduleSettings[activeType];
  if (!currentSchedule) return null;

  return (
    <Layout maxWidth="2xl">
      <motion.div 
        {...fadeIn}
        className="w-full mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {translations?.schedule?.badge || 'Schedule'}
            </span>
          </motion.div>
          
          <Heading>
            {translations?.schedule?.title || 'Set Your Schedule'}
          </Heading>
          
          {state.serviceLocation.type === 'both' && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setActiveType('mobile')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-colors
                  ${activeType === 'mobile' 
                    ? 'bg-primary-gold text-white dark:bg-primary-gold' 
                    : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10'}`
                }
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm sm:text-base">Mobile</span>
              </button>
              <button
                onClick={() => setActiveType('studio')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-colors
                  ${activeType === 'studio' 
                    ? 'bg-primary-gold text-white dark:bg-primary-gold' 
                    : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10'}`
                }
              >
                <Home className="w-4 h-4" />
                <span className="text-sm sm:text-base">Studio</span>
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 justify-center mt-4">
            <Clock className="w-4 h-4 text-primary-gold" />
            <Text className="text-gray-600">
              {translations?.schedule?.subtitle?.replace(
                '{type}', 
                translations?.schedule?.types?.[activeType] || activeType
              ) || `Set your ${activeType} schedule`}
            </Text>
          </div>
        </div>

        <motion.div 
          variants={staggerChildren}
          className="grid gap-2 mb-12"
        >
          {currentSchedule.workDays.map((day, index) => (
            <DayCard
              key={day.day}
              day={day}
              onUpdate={(updatedDay) => handleDayUpdate(activeType, index, updatedDay)}
              canCopyTo={currentSchedule.workDays.filter(d => d.day !== day.day)}
              onCopyTo={(targetDays) => handleCopyTo(activeType, index, targetDays)}
            />
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="space-y-4"
        >
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
            fullWidth
          >
            {loading 
              ? (translations?.schedule?.saving || 'Saving...') 
              : (translations?.schedule?.continue || 'Continue')}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
