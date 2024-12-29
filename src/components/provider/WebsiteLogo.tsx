import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Image, Type, Upload, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { ImageUpload } from '../../ui/ImageUpload';
import { saveWebsiteLogo } from '../../services/api';
import { Layout } from '../../ui/Layout';

interface LogoOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function LogoOption({ icon, title, description, selected, onClick }: LogoOptionProps) {
  return (
    <motion.button
      variants={fadeIn}
      onClick={onClick}
      className={`w-full p-6 rounded-2xl transition-all duration-300 border ${
        selected
          ? 'bg-primary-gold/10 dark:bg-white/10 ring-2 ring-primary-gold border-transparent' 
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-gray-200 dark:border-white/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${
          selected 
            ? 'text-primary-gold dark:text-white bg-white dark:bg-primary-navy/50' 
            : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{title}</h3>
          <Text className="text-sm text-gray-600 dark:text-gray-400">{description}</Text>
        </div>
      </div>
    </motion.button>
  );
}

export default function WebsiteLogo() {
  const { dispatch, state } = useOnboarding();
  const { translations } = useLanguage();
  const [logoType, setLogoType] = useState<'text' | 'image' | null>(
    state.websiteLogo?.type || 'text'
  );
  const [logoText, setLogoText] = useState(
    state.websiteLogo?.type === 'text' 
      ? state.websiteLogo.content 
      : state.userData.businessName || state.userData.firstName || ''
  );
  const [logoImage, setLogoImage] = useState<string | null>(
    state.websiteLogo?.type === 'image' ? state.websiteLogo.content : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(translations?.websiteLogo?.imageLogo?.sizeError || 'File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (logoType === 'text' && logoText) {
      setLoading(true);
      setError(null);
      
      try {
        // If user hasn't changed the default value, use it
        const finalLogoText = logoText || state.userData.businessName || state.userData.firstName || '';
        
        console.log('Saving text logo:', { type: 'text', content: logoText });
        const response = await saveWebsiteLogo({ type: 'text', content: finalLogoText });
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to save logo');
        }

        console.log('Logo saved successfully:', response.data);
        
        // Update state with confirmed logo
        dispatch({ type: 'SET_WEBSITE_LOGO', payload: { type: 'text', content: finalLogoText } });
        
        // Navigate to WebsiteCover
        dispatch({ type: 'SET_STEP', payload: 19 });
      } catch (err) {
        console.error('Error saving logo:', err);
        setError(translations?.websiteLogo?.error || 'Failed to save logo. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (logoType === 'image' && logoImage) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Saving image logo:', { type: 'image', content: logoImage });
        const response = await saveWebsiteLogo({ type: 'image', content: logoImage });
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to save logo');
        }

        console.log('Logo saved successfully:', response.data);
        
        // Update state with confirmed logo
        dispatch({ type: 'SET_WEBSITE_LOGO', payload: { type: 'image', content: logoImage } });
        
        // Navigate to WebsiteCover
        dispatch({ type: 'SET_STEP', payload: 19 });
      } catch (err) {
        console.error('Error saving logo:', err);
        setError('Failed to save logo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const clearImage = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout maxWidth="xl">
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
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">{translations?.websiteLogo?.badge || "Website Logo"}</span>
          </motion.div>
          
          <Heading className="mb-4">{translations?.websiteLogo?.title || "Add Your Logo"}</Heading>
          
          <Text className="max-w-md mx-auto">
            {translations?.websiteLogo?.subtitle || "Choose between a text-based logo or upload your own image."}
          </Text>
        </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-4 mb-8"
      >
        <LogoOption
          icon={<Type className="w-6 h-6" />}
          title={translations?.websiteLogo?.textLogo?.title || "Text Logo"}
          description={translations?.websiteLogo?.textLogo?.description || "Use your business name as a stylized text logo"}
          selected={logoType === 'text'}
          onClick={() => setLogoType('text')}
        />
        
        <LogoOption
          icon={<Upload className="w-6 h-6" />}
          title={translations?.websiteLogo?.imageLogo?.title || "Upload Logo"}
          description={translations?.websiteLogo?.imageLogo?.description || "Upload your own logo image (PNG, JPG, SVG)"}
          selected={logoType === 'image'}
          onClick={() => setLogoType('image')}
        />
      </motion.div>

      {logoType === 'text' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8"
        >
          <Text className="text-sm text-gray-500 mb-2">
            {translations?.websiteLogo?.textLogo?.inputLabel || "Enter your business name or personal brand name"}
          </Text>
          <input
            type="text"
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            placeholder={state.userData.businessName || state.userData.firstName || "Enter your business name"}
            className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg bg-white dark:bg-primary-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            maxLength={30}
          />
        </motion.div>
      )}

      {logoType === 'image' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 space-y-4"
        >
          <ImageUpload
            image={logoImage}
            onImageChange={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                setLogoImage(e.target?.result as string);
              };
              reader.readAsDataURL(file);
            }}
            onImageDelete={clearImage}
            maxSize={5}
            accept="image/png,image/jpeg,image/svg+xml"
            placeholder={translations?.websiteLogo?.imageLogo?.placeholder || "Click to upload your logo"}
            className="h-48"
          />
        </motion.div>
      )}

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={loading || !logoType || (logoType === 'text' && !logoText) || (logoType === 'image' && !logoImage)}
            className="w-full"
          >
            {loading ? translations?.websiteLogo?.saving || 'Saving...' : translations?.websiteLogo?.save || 'Save'}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
