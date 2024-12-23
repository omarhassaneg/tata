import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Image, X, Loader } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { ImageUpload } from './ui/ImageUpload';
import { savePortfolioImages } from '../services/api';
import { Layout } from './ui/Layout';

interface PortfolioImage {
  id: string;
  url: string;
  file?: File;
  crop?: Crop;
}

export default function WebsitePortfolio() {
  const { dispatch } = useOnboarding();
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();

  const handleCropComplete = (crop: PixelCrop, id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, crop } : img
    ));
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage === id) {
      setSelectedImage(null);
      setCrop(undefined);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Saving portfolio images:', images);
      const response = await savePortfolioImages(images);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save portfolio images');
      }

      console.log('Portfolio images saved successfully:', response.data);
      
      // Update state with confirmed images
      dispatch({ 
        type: 'SET_PORTFOLIO_IMAGES', 
        payload: images.map(img => ({
          id: img.id,
          url: img.url,
          crop: img.crop
        }))
      });
      
      // Navigate to WebsiteBio
      dispatch({ type: 'SET_STEP', payload: 23 });
    } catch (err) {
      console.error('Error saving portfolio images:', err);
      setError('Failed to save portfolio images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">Portfolio Images</span>
          </motion.div>
          
          <Heading className="mb-4">Add Your Best Work</Heading>
          
          <Text className="max-w-md mx-auto">
            Upload photos of your work to showcase your skills and style.
            You can crop and adjust each image. This step is optional.
          </Text>
        </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-6"
      >
        <div className="flex justify-center">
          {/* Upload Button */}
          {images.length < 6 && (
            <ImageUpload
              onImageChange={async (file) => {
                const loadImage = (file: File): Promise<PortfolioImage> => {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      resolve({
                        id: Math.random().toString(36).substring(7),
                        url: e.target?.result as string,
                        file
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                };

                const newImage = await loadImage(file);
                setImages(prev => {
                  // Check if we're still under the limit
                  if (prev.length >= 6) return prev;
                  return [...prev, newImage];
                });
              }}
              placeholder="Add Image"
              helperText="PNG or JPG (max 10MB)"
              aspectRatio="free"
              className="w-full max-w-xs"
              multiple={true}
            />
          )}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <ImageUpload
              key={image.id}
              image={image.url}
              onImageDelete={() => deleteImage(image.id)}
              onCropClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
              onImageChange={() => {}} // Add empty handler since it's required but not used here
              aspectRatio="free"
              className="w-full"
            />
          ))}
        </div>

        {/* Crop Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          >
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Crop Image</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={(c) => handleCropComplete(c, selectedImage)}
                  aspect={undefined}
                >
                  <img
                    src={images.find(img => img.id === selectedImage)?.url}
                    alt="Crop preview"
                  />
                </ReactCrop>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  onClick={() => setSelectedImage(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        )}

          <motion.div
            variants={fadeIn}
            className="grid gap-4 pt-4"
          >
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : images.length > 0 ? 'Save' : 'Skip'}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
