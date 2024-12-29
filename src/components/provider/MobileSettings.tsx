import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../context/OnboardingContext';
import { Heading, Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { fadeIn, staggerChildren } from '../../ui/animations';

export default function MobileSettings() {
  const { state, dispatch } = useOnboarding();

  const handleAccept = () => {
    dispatch({ type: 'SET_STEP', payload: 8 });
  };

  const handleEdit = () => {
    // Handle edit settings logic
  };

  return (
    <motion.div 
      {...fadeIn}
      className="w-full max-w-lg mx-auto px-4"
    >
      <div className="relative h-[300px] mb-8 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
          alt="Luxury service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-8"
        >
          <Heading className="text-white mb-2">Mobile Settings</Heading>
        </motion.div>
      </div>

      <motion.div
        variants={staggerChildren}
        className="space-y-8"
      >
        <motion.div
          variants={fadeIn}
          className="text-center"
        >
          <Text className="text-xl font-medium mb-4">
            Your mobile service area is set to cover a {state.serviceLocation.mobileRadius} Km radius
          </Text>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="text-center"
        >
          <Text className="text-xl font-medium mb-4">
            Travel fee of ${state.serviceLocation.travelFeePerKm} per Km with a minimum fee of $15
          </Text>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="text-center"
        >
          <Text className="text-xl font-medium">
            A minimum spend requirement of ${state.serviceLocation.minimumSpend} for mobile bookings.
          </Text>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="pt-8 space-y-4"
        >
          <Button
            variant="primary"
            onClick={handleAccept}
            fullWidth
          >
            Accept
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEdit}
            fullWidth
          >
            Edit Mobile Settings
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}