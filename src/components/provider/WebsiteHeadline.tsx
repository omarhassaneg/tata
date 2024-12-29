import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Type } from 'lucide-react';
import { fadeIn, staggerChildren } from '../../ui/animations';

export default function WebsiteHeadline() {
  const { state, dispatch } = useOnboarding();
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');

  const handleContinue = () => {
    if (headline.trim() && subheadline.trim()) {
      dispatch({ 
        type: 'SET_WEBSITE_HEADLINE', 
        payload: { 
          title: headline.trim(),
          subtitle: subheadline.trim()
        }
      });
      dispatch({ type: 'SET_STEP', payload: 18 });
    }
  };

  return (
    <motion.div 
      {...fadeIn}
      className="w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Type className="w-4 h-4" />
          <span className="text-sm font-medium">Website Headlines</span>
        </motion.div>
        
        <Heading className="mb-4">Create Your Headlines</Heading>
        
        <Text className="max-w-md mx-auto">
          Your headlines are the first thing visitors will see. Make them clear, 
          compelling, and focused on your value proposition.
        </Text>
      </div>

      <motion.div 
        variants={staggerChildren}
        className="space-y-8"
      >
        {/* Preview Section */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gray-900">
          <img
            src={state.websiteCover || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=80"}
            alt="Cover preview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            <motion.h1 
              className={`text-4xl font-bold mb-4 text-center transition-opacity duration-300 ${headline ? 'opacity-100' : 'opacity-40'}`}
            >
              {headline || "Your Main Headline"}
            </motion.h1>
            <motion.p 
              className={`text-xl max-w-lg text-center transition-opacity duration-300 ${subheadline ? 'opacity-100' : 'opacity-40'}`}
            >
              {subheadline || "Your engaging subheadline that provides more context"}
            </motion.p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Examples */}
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <Text className="text-sm font-medium text-gray-600 mb-2">Example Headlines:</Text>
            <div className="space-y-4 text-gray-600">
              <div>
                <div className="font-semibold">Main: "Professional Makeup Artist for Your Special Day"</div>
                <div className="text-sm">Sub: "Bringing out your natural beauty for weddings, events, and photoshoots"</div>
              </div>
              <div>
                <div className="font-semibold">Main: "Expert Hair Styling in New York City"</div>
                <div className="text-sm">Sub: "Creating stunning looks that make you feel confident and beautiful"</div>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Main Headline
              </label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter your main headline..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg resize-none"
                rows={2}
                maxLength={60}
              />
              <Text className="text-sm text-gray-500 text-right">
                {headline.length}/60 characters
              </Text>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Subheadline
              </label>
              <textarea
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Enter your subheadline..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg resize-none"
                rows={2}
                maxLength={120}
              />
              <Text className="text-sm text-gray-500 text-right">
                {subheadline.length}/120 characters
              </Text>
            </div>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="flex justify-center"
        >
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={!headline.trim() || !subheadline.trim()}
            className="min-w-[200px]"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}