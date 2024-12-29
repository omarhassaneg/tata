import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Shield, BadgeCheck, Star, Camera, AlertCircle } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';
import { Layout } from '../../ui/Layout';
import { ImageUpload } from '../../ui/ImageUpload';
import { ImageCropper } from '../../ui/ImageCropper';
import type { Crop } from 'react-image-crop';
import { saveProfilePhoto } from '../../services/api';

interface RequirementProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Requirement({ icon, title = "", description = "" }: RequirementProps) {
  return (
    <motion.div 
      variants={fadeIn}
      className="flex items-start gap-4 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
    >
      <div className="p-2 bg-primary-gold/10 rounded-xl text-primary-gold">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <Text className="text-sm">{description}</Text>
      </div>
    </motion.div>
  );
}

export default function MarketplaceVerification() {
  const { dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });

  const handleContinue = async () => {
    if (profilePhoto) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Saving profile photo:', profilePhoto);
        const response = await saveProfilePhoto(profilePhoto);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to save profile photo');
        }

        console.log('Profile photo saved successfully:', response.data);
        
        // Update state with confirmed profile photo
        dispatch({ type: 'SET_PROFILE_PHOTO', payload: profilePhoto });
        
        // Navigate to WebsitePaymentsSuccess
        dispatch({ type: 'SET_STEP', payload: 25 });
      } catch (err) {
        console.error('Error saving profile photo:', err);
        setError('Failed to save profile photo. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Skip photo upload and proceed
      dispatch({ type: 'SET_STEP', payload: 25 });
    }
  };

  return (
    <Layout maxWidth="xl">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.marketplaceVerification?.badge}</span>
        </motion.div>
        
        <Heading className="mb-4">{translations?.marketplaceVerification?.title}</Heading>
        
        <Text className="max-w-2xl mx-auto">
          {translations?.marketplaceVerification?.subtitle}
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-8 max-w-xl mx-auto"
      >
        {/* Requirements */}
        <div className="space-y-4">
          <Requirement
            icon={<Camera className="w-5 h-5" />}
            title={translations?.marketplaceVerification?.requirements?.profilePhoto?.title || ""}
            description={translations?.marketplaceVerification?.requirements?.profilePhoto?.description || ""}
          />
          
          <Requirement
            icon={<Shield className="w-5 h-5" />}
            title={translations?.marketplaceVerification?.requirements?.verifiedBadge?.title || ""}
            description={translations?.marketplaceVerification?.requirements?.verifiedBadge?.description || ""}
          />
          
          <Requirement
            icon={<BadgeCheck className="w-5 h-5" />}
            title={translations?.marketplaceVerification?.requirements?.badgeRequirements?.title || ""}
            description={translations?.marketplaceVerification?.requirements?.badgeRequirements?.description || ""}
          />
        </div>

        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border-2 border-gray-200 dark:border-white/10">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-primary-gold flex-shrink-0 mt-0.5" />
              <Text as="div" className="text-sm text-gray-600 dark:text-gray-300">
                {translations?.marketplaceVerification?.photoGuidelines?.title}
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {(translations?.marketplaceVerification?.photoGuidelines?.items || []).map((item, index) => (
                    <li key={index}>{item || ""}</li>
                  ))}
                </ul>
              </Text>
            </div>

            <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Shield className="w-5 h-5 text-primary-gold flex-shrink-0 mt-0.5" />
              <Text as="div" className="text-sm text-gray-600 dark:text-gray-300">
                {translations?.marketplaceVerification?.securityNotice}
              </Text>
            </div>

            <ImageUpload
              image={profilePhoto}
              onImageChange={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setProfilePhoto(e.target?.result as string);
                  setShowCropper(true);
                };
                reader.readAsDataURL(file);
              }}
              onImageDelete={() => setProfilePhoto(null)}
              onCropClick={() => setShowCropper(true)}
              aspectRatio="square"
              placeholder={translations?.marketplaceVerification?.upload?.placeholder}
              helperText={translations?.marketplaceVerification?.upload?.helperText}
              maxSize={5}
              className="w-full max-w-xs mx-auto"
            />
          </div>
        </div>

        {/* Crop Modal */}
        {showCropper && profilePhoto && (
          <ImageCropper
            image={profilePhoto}
            crop={crop}
            onCropChange={setCrop}
            onCropComplete={setCrop}
            onClose={() => setShowCropper(false)}
            aspectRatio={1}
          />
        )}
        {/* Verification Badge Preview */}
        <div className={`p-6 rounded-2xl ${profilePhoto ? 'bg-primary-gold/10' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Star className="w-5 h-5 text-primary-gold" />
            <Text as="div" className="text-sm">
              {profilePhoto 
                ? translations?.marketplaceVerification?.verificationStatus?.withPhoto
                : translations?.marketplaceVerification?.verificationStatus?.withoutPhoto}
            </Text>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="flex justify-center pt-4"
        >
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? translations?.marketplaceVerification?.buttons?.saving : profilePhoto ? translations?.marketplaceVerification?.buttons?.continue : translations?.marketplaceVerification?.buttons?.skip}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error || translations?.marketplaceVerification?.error}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
