import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading } from './ui/Typography';
import { Palette, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { saveWebsiteTheme } from '../services/api';
import { useSwipeable, SwipeableProps } from 'react-swipeable';
import { Layout } from './ui/Layout';

interface ThemePreviewProps {
  name: string;
  preview: string;
  selected: boolean;
}

function ThemePreview({ name, preview, selected }: ThemePreviewProps) {
  return (
    <motion.div
      variants={fadeIn}
      className={`relative w-full transition-transform duration-300 ${selected ? 'scale-[1.02]' : 'scale-100'}`}
    >
      <div className={`aspect-[16/9] rounded-2xl overflow-hidden mb-6 transition-all duration-300 relative
        ${selected 
          ? 'shadow-2xl ring-4 ring-primary-gold ring-opacity-50' 
          : 'shadow-xl hover:shadow-2xl'}`}
      >
        <img 
          src={preview} 
          alt={`${name} theme preview`}
          className="w-full h-full object-cover"
        />
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-primary-gold/90 backdrop-blur-sm flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="text-center">
        <span className={`text-xl font-medium transition-colors duration-300
          ${selected ? 'text-primary-gold' : 'text-white-900'}`}>
          {name}
        </span>
      </div>
    </motion.div>
  );
}

const themes = [
  {
    id: 'classic',
    name: 'Classic',
    color: '#F5F5F5',
    preview: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    color: '#2C3E50',
    preview: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nature',
    name: 'Nature',
    color: '#8BC34A',
    preview: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
  },
];

export default function WebsiteThemeSelection() {
  const { state, dispatch } = useOnboarding();
  const [selectedTheme, setSelectedTheme] = React.useState(state.websiteTheme || '');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleNext = () => {
    if (currentIndex < themes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedTheme(themes[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedTheme(themes[currentIndex - 1].id);
    }
  };

  const handleSaveChanges = async () => {
    if (selectedTheme) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Saving theme choice:', selectedTheme);
        const response = await saveWebsiteTheme(selectedTheme);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to save theme');
        }

        console.log('Theme saved successfully:', response.data);
        
        // Update state with confirmed theme
        dispatch({ type: 'SET_WEBSITE_THEME', payload: selectedTheme });
        
        // Navigate to WebsiteSlug
        dispatch({ type: 'SET_STEP', payload: 17 });
      } catch (err) {
        console.error('Error saving theme:', err);
        setError('Failed to save theme. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const currentTheme = themes[currentIndex];
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true
  } as SwipeableProps);
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
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">Website Theme</span>
          </motion.div>
          
          <Heading>Choose Your Style</Heading>
        </div>

      <div className="mb-20">
        <motion.div 
          variants={staggerChildren}
          className="relative"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setSelectedTheme(selectedTheme === currentTheme.id ? '' : currentTheme.id);
          }}
          {...swipeHandlers}
        >
          <ThemePreview
            name={currentTheme.name}
            preview={currentTheme.preview}
            selected={selectedTheme === currentTheme.id}
          />

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`p-4 rounded-xl bg-white/95 dark:bg-white/30 backdrop-blur-sm shadow-lg transition-all hover:scale-105
                ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-white/40'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === themes.length - 1}
              className={`p-4 rounded-xl bg-white/95 dark:bg-white/30 backdrop-blur-sm shadow-lg transition-all hover:scale-105
                ${currentIndex === themes.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-white/40'}`}
            >
              <ArrowRight className="w-8 h-8 text-gray-900 dark:text-white" />
            </button>
          </div>
        </motion.div>
      </div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={loading || !selectedTheme}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
