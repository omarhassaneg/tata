import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Phone, Mail, Instagram, Eye, EyeOff } from 'lucide-react';
import { Layout } from './ui/Layout';
import { fadeIn, staggerChildren } from './ui/animations';
import { saveContactSettings } from '../services/api';

interface ContactOptionProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  placeholder?: string;
  isVisible: boolean;
  onToggle: () => void;
  onChange?: (value: string) => void;
}

function ContactOption({
  icon,
  title,
  value,
  placeholder,
  isVisible,
  onToggle,
  onChange,
}: ContactOptionProps) {
  return (
    <motion.div
      variants={fadeIn}
      className="space-y-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-xl text-primary-gold dark:text-white">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`p-3 rounded-xl transition-colors ${
            isVisible
              ? "bg-primary-gold/10 text-primary-gold dark:bg-white/10 dark:text-white"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }`}
        >
          {isVisible ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      </div>

      {isVisible && onChange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ContactDisplaySettings() {
  const { state, dispatch } = useOnboarding();
  const { userData } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (value: string) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: { [field]: value },
    });
  };

  const handleToggle = (setting: keyof typeof userData.displaySettings) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: {
        displaySettings: {
          ...userData.displaySettings,
          [setting]: !userData.displaySettings?.[setting],
        },
      },
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const settings = {
      displaySettings: {
        showPhone: userData.displaySettings?.showPhone ?? false,
        showEmail: userData.displaySettings?.showEmail ?? false,
        showInstagram: userData.displaySettings?.showInstagram ?? true,
      },
      phone: userData.phone,
      email: userData.email,
      instagram: userData.instagram,
    };

    console.log("Saving contact settings:", settings);

    try {
      const response = await saveContactSettings(settings);

      if (!response.success) {
        throw new Error(response.error || "Failed to save settings");
      }

      console.log("Settings saved successfully:", response.data);

      // Navigate to WebsiteThemeSelection
      dispatch({ type: "SET_STEP", payload: 16 });
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout maxWidth="2xl">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full mb-4"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">Contact Display</span>
        </motion.div>

        <Heading className="mb-4">Contact Information</Heading>

        <Text className="max-w-md mx-auto">
          Choose which contact information to display on your website. You can
          change these settings anytime.
        </Text>
      </div>

      <motion.div variants={staggerChildren} className="space-y-4 mb-12">
        <ContactOption
          icon={<Instagram className="w-5 h-5" />}
          title="Instagram"
          value={userData.instagram || ""}
          placeholder="@yourbusiness"
          isVisible={userData.displaySettings?.showInstagram ?? true}
          onToggle={() => handleToggle("showInstagram")}
          onChange={handleChange("instagram")}
        />

        <ContactOption
          icon={<Phone className="w-5 h-5" />}
          title="Phone Number"
          value={userData.phone}
          placeholder={userData.phone}
          isVisible={userData.displaySettings?.showPhone ?? false}
          onToggle={() => handleToggle("showPhone")}
          onChange={handleChange("phone")}
        />

        <ContactOption
          icon={<Mail className="w-5 h-5" />}
          title="Email Address"
          value={userData.email}
          placeholder={userData.email}
          isVisible={userData.displaySettings?.showEmail ?? false}
          onToggle={() => handleToggle("showEmail")}
          onChange={handleChange("email")}
        />
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save"}
        </Button>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </motion.div>
    </Layout>
  );
}