import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Crop as CropIcon } from 'lucide-react';
import { Text } from './Typography';
import { fadeIn } from '../ui/animations';

interface ImageUploadProps {
  image?: string | null;
  onImageChange: (file: File) => void;
  onImageDelete?: () => void;
  onCropClick?: () => void;
  maxSize?: number;
  accept?: string;
  aspectRatio?: number | 'square' | 'landscape' | 'portrait' | 'free';
  className?: string;
  multiple?: boolean;
  placeholder?: string;
  helperText?: string;
}

export function ImageUpload({
  image,
  onImageChange,
  onImageDelete,
  onCropClick,
  maxSize = 10,
  accept = "image/*",
  aspectRatio,
  className = "",
  multiple = false,
  placeholder = "Click to upload",
  helperText = `PNG or JPG (max ${maxSize}MB)`,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => onImageChange(file));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (image) {
    return (
      <div className={`relative ${getAspectRatioClass(aspectRatio)} ${className}`}>
        <img
          src={image}
          alt="Upload preview"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {onCropClick && (
            <button
              onClick={onCropClick}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <CropIcon className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {onImageDelete && (
            <button
              onClick={onImageDelete}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div {...fadeIn}>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary-gold transition-colors p-8 bg-white dark:bg-primary-navy/50 ${
          getAspectRatioClass(aspectRatio)
        } ${className}`}
      >
        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        <div className="text-center">
          <Text className="text-gray-900 dark:text-white">{placeholder}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">{helperText}</Text>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        multiple={true}
        className="hidden"
      />
    </motion.div>
  );
}

function getAspectRatioClass(aspectRatio?: number | 'square' | 'landscape' | 'portrait' | 'free'): string {
  if (typeof aspectRatio === 'number') {
    return `aspect-[${aspectRatio}]`;
  }
  
  switch (aspectRatio) {
    case 'square':
      return 'aspect-square';
    case 'landscape':
      return 'aspect-[16/9]';
    case 'portrait':
      return 'aspect-[3/4]';
    case 'free':
      return '';
    default:
      return 'aspect-square';
  }
}