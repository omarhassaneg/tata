import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Shield, BadgeCheck, Star, Camera, AlertCircle } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { Layout } from './ui/Layout';
import { ImageUpload } from './ui/ImageUpload';
import { ImageCropper } from './ui/ImageCropper';
import type { Crop } from 'react-image-crop';
import { saveProfilePhoto } from '../services/api';

interface RequirementProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Requirement({ icon, title, description }: RequirementProps) {
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
          <span className="text-sm font-medium">Marketplace Verification</span>
        </motion.div>
        
        <Heading className="mb-4">Join Our Verified Sellers</Heading>
        
        <Text className="max-w-2xl mx-auto">
          Add your profile photo to join Glamic's marketplace and unlock access to eventually get high ticket bookings, opportunity 
          to become a verified seller with exclusive benefits.
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
            title="Required: Professional Profile Photo"
            description="Upload a clear photo of yourself to get listed on the marketplace"
          />
          
          <Requirement
            icon={<Shield className="w-5 h-5" />}
            title="Verified Badge Benefits"
            description="Get bookings from marketplace, higher visibility, and exclusive features. ID verification and background check required upon qualifying."
          />
          
          <Requirement
            icon={<BadgeCheck className="w-5 h-5" />}
            title="Verified Badge Requirements"
            description="Maintain a 4+ star rating for 6 months with your own regular customer bookings. Complete ID verification and background check when qualified."
          />
        </div>

        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border-2 border-gray-200 dark:border-white/10">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-primary-gold flex-shrink-0 mt-0.5" />
              <Text as="div" className="text-sm text-gray-600 dark:text-gray-300">
                Your profile photo is crucial for building trust with potential clients. 
                Ensure your photo:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Shows your face clearly</li>
                  <li>Has good lighting</li>
                  <li>Uses a light, solid background</li>
                  <li>Looks professional</li>
                  <li>Is recent and accurate</li>
                </ul>
              </Text>
            </div>

            <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Shield className="w-5 h-5 text-primary-gold flex-shrink-0 mt-0.5" />
              <Text as="div" className="text-sm text-gray-600 dark:text-gray-300">
                For everyone's safety, we cooperate with local law enforcement and may share account 
                information in the rare case of investigations or legal proceedings.
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
              placeholder="Upload your profile photo"
              helperText="PNG or JPG (max 5MB)"
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
                ? 'Your profile will be listed on the marketplace after review. Earn your verified badge to unlock premium benefits and increased visibility.'
                : 'Add your profile photo to get listed on the marketplace.'}
            </Text>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="flex justify-center pt-4"
        >
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? 'Saving...' : profilePhoto ? 'Continue' : 'Skip'}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
