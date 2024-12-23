import React from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { Crop } from 'react-image-crop';
import { X } from 'lucide-react';
import { Button } from './Button';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  crop: Crop;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: Crop) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  image,
  crop,
  onCropChange,
  onCropComplete,
  onClose,
  aspectRatio = 1
}: ImageCropperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
    >
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adjust Photo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
            aspect={aspectRatio}
            className="max-w-full"
          >
            <img
              src={image}
              alt="Crop preview"
              className="max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </motion.div>
  );
}