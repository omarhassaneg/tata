import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { useLanguage } from '../context/LanguageContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Image, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { Layout } from './ui/Layout';
import { ImageUpload } from './ui/ImageUpload';
import { saveWebsiteCover } from '../services/api';

export default function WebsiteCover() {
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Saving cover image:', coverImage);
      const response = await saveWebsiteCover(coverImage || '');
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save cover image');
      }

      console.log('Cover image saved successfully:', response.data);
      
      // Update state with confirmed cover image
      dispatch({ 
        type: 'SET_WEBSITE_COVER', 
        payload: coverImage || '' 
      });
      
      // Navigate to WebsiteHeadline
      dispatch({ type: 'SET_STEP', payload: 20 });
    } catch (err) {
      console.error('Error saving cover image:', err);
      setError('Failed to save cover image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout maxWidth="md">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Image className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.websiteCover?.badge || "Cover Image"}</span>
        </motion.div>
        
        <Heading className="mb-4">{translations?.websiteCover?.title || "Add a Cover Image"}</Heading>
        
        <Text className="max-w-md mx-auto">
          {translations?.websiteCover?.subtitle || "Upload a beautiful cover image for your website's hero section. We'll use our default image if you skip this step."}
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-6"
      >
        <div className="flex justify-center w-full max-w-md mx-auto">
          <ImageUpload
            image={coverImage}
            onImageChange={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                setCoverImage(e.target?.result as string);
              };
              reader.readAsDataURL(file);
            }}
            onImageDelete={clearImage}
            aspectRatio={21/9}
            placeholder={translations?.websiteCover?.placeholder || "Click to upload a cover image"}
            className="w-full rounded-2xl overflow-hidden"
          />
        </div>

        <motion.div
          variants={fadeIn}
          className="grid gap-4"
        >
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={loading}
            className="w-full"
          >
            {loading 
              ? translations?.websiteCover?.saving || "Saving..." 
              : coverImage 
                ? translations?.websiteCover?.save || "Save" 
                : translations?.websiteCover?.skip || "Skip"}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">
              {translations?.websiteCover?.error || "Failed to save cover image. Please try again."}
            </p>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
