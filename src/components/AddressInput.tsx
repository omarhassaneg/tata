import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import { Heading, Text } from './ui/Typography';
import { Button, Checkbox } from './ui/Button';
import { MapPin, X } from 'lucide-react';
import { fadeIn, staggerChildren } from './ui/animations';
import { initGoogleMaps, searchPlaces, PlaceResult } from '../services/places';
import { Layout } from './ui/Layout';
import { useLanguage } from '../context/LanguageContext';

import { saveAddresses } from '../services/api';


export default function AddressInput() {
  const { state, dispatch } = useOnboarding();
  const { translations } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(state.serviceLocation.address || '');
  const [billingQuery, setBillingQuery] = useState(state.serviceLocation.billingAddress || '');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [billingResults, setBillingResults] = useState<AddressResult[]>([]);
  const [sameAsBilling, setSameAsBilling] = useState(state.serviceLocation.sameAsBilling ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isBillingAddressSelected, setIsBillingAddressSelected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Google Maps...');
        await initGoogleMaps();
        console.log('Google Maps initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err);
        setError('Address search is temporarily unavailable. Please try again later or contact support if the issue persists.');
        setIsInitialized(false);
      }
    };
    init();
  }, []);

  // Retry initialization if it failed
  useEffect(() => {
    if (!isInitialized) {
      const retryTimer = setTimeout(() => {
        console.log('Retrying Google Maps initialization...');
        init();
      }, 5000);
      return () => clearTimeout(retryTimer);
    }
  }, [isInitialized]);

  // Initialize form with state values
  useEffect(() => {
    if (state.serviceLocation.address) {
      setSearchQuery(state.serviceLocation.address);
    }
    if (state.serviceLocation.billingAddress) {
      setBillingQuery(state.serviceLocation.billingAddress);
    }
    if (typeof state.serviceLocation.sameAsBilling === 'boolean') {
      setSameAsBilling(state.serviceLocation.sameAsBilling);
    }
  }, [state.serviceLocation]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsAddressSelected(false);
    if (query.length >= 3) {
      try {
        const places = await searchPlaces(query);
        setResults(places);
      } catch (err) {
        console.error('Places search failed:', err);
        setError('Address search failed. Please try again.');
      }
    } else {
      setResults([]);
    }
  };

  const handleBillingSearch = async (query: string) => {
    setBillingQuery(query);
    setIsBillingAddressSelected(false);
    if (query.length >= 3) {
      try {
        const places = await searchPlaces(query);
        setBillingResults(places);
      } catch (err) {
        console.error('Places search failed:', err);
        setError('Address search failed. Please try again.');
      }
    } else {
      setBillingResults([]);
    }
  };

  const handleSelectAddress = (address: string) => {
    console.log('Selected base address:', address);
    setIsAddressSelected(true);
    dispatch({
      type: 'SET_SERVICE_LOCATION',
      payload: { 
        ...state.serviceLocation, 
        address,
        billingAddress: sameAsBilling ? address : state.serviceLocation.billingAddress,
        sameAsBilling
      }
    });
    setResults([]);
    setSearchQuery(address);
    
    // Log updated state
    console.log('Updated service location state:', {
      address,
      billingAddress: sameAsBilling ? address : state.serviceLocation.billingAddress,
      sameAsBilling
    });
  };

  const handleSelectBillingAddress = (address: string) => {
    console.log('Selected billing address:', address);
    setIsBillingAddressSelected(true);
    dispatch({
      type: 'SET_SERVICE_LOCATION',
      payload: { 
        ...state.serviceLocation, 
        billingAddress: address,
        sameAsBilling: false
      }
    });
    setBillingResults([]);
    setBillingQuery(address);
    
    // Log updated state
    console.log('Updated service location state:', {
      ...state.serviceLocation,
      billingAddress: address,
      sameAsBilling: false
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsAddressSelected(false);
    setResults([]);
  };

  const clearBillingSearch = () => {
    setBillingQuery('');
    setIsBillingAddressSelected(false);
    setBillingResults([]);
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked && state.serviceLocation.address) {
      dispatch({
        type: 'SET_SERVICE_LOCATION',
        payload: { 
          ...state.serviceLocation,
          billingAddress: state.serviceLocation.address,
          sameAsBilling: true
        }
      });
      setBillingQuery('');
      setBillingResults([]);
    }
  };

  const handleNext = async () => {
    if (!isAddressSelected) {
      setError('Please select a valid address from the suggestions');
      return;
    }

    if (!sameAsBilling && !isBillingAddressSelected) {
      setError('Please select a valid billing address from the suggestions');
      return;
    }

    setLoading(true);
    setError(null);
    
    const addressData = {
      baseAddress: searchQuery.trim(),
      billingAddress: sameAsBilling ? searchQuery.trim() : billingQuery.trim(),
      sameAsBilling
    };
    
    console.log('Submitting address data:', addressData);

    try {
      const response = await saveAddresses(addressData);
      
      console.log('API Response:', response);
      
      // Update state with confirmed addresses
      dispatch({
        type: 'SET_SERVICE_LOCATION',
        payload: {
          ...state.serviceLocation,
          address: addressData.baseAddress,
          billingAddress: addressData.billingAddress,
          sameAsBilling: addressData.sameAsBilling
        }
      });
      
      // Proceed to next step
      dispatch({ type: 'SET_STEP', payload: 8 });
    } catch (err) {
      console.error('Error saving addresses:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout maxWidth="lg">
      <Heading className="text-center mb-4">
        {translations.address.title}
      </Heading>
      
      <Text className="text-center mb-12 max-w-xl mx-auto">
        {translations.address.subtitle}
      </Text>

      <motion.div {...staggerChildren} className="space-y-4">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={translations.address.searchPlaceholder}
              className="w-full px-6 py-4 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg bg-white dark:bg-primary-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 bg-white dark:bg-primary-navy/95 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
            >
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectAddress(result.address)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-3 text-gray-900 dark:text-white transition-colors"
                >
                  <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{result.address}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <div className="mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => handleSameAsBillingChange(e.target.checked)}
              className="w-4 h-4 text-primary-gold rounded border-gray-300 dark:border-gray-600 focus:ring-primary-gold dark:bg-primary-navy"
            />
            <span className="text-gray-700 dark:text-gray-300">{translations.address.billingAddress.same}</span>
          </label>
        </div>

        {!sameAsBilling && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            <Text className="font-medium mb-4">{translations.address.billingAddress.title}</Text>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={billingQuery}
                  onChange={(e) => handleBillingSearch(e.target.value)}
                  placeholder={translations.address.billingAddress.searchPlaceholder}
                  className="w-full px-6 py-4 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-gold focus:ring-0 text-lg bg-white dark:bg-primary-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                {billingQuery && (
                  <button
                    onClick={clearBillingSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {billingResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-2 bg-white dark:bg-primary-navy/95 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
                >
                  {billingResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectBillingAddress(result.address)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-3 text-gray-900 dark:text-white transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">{result.address}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </motion.div>

      <motion.div
        variants={fadeIn}
        className="flex flex-col items-center gap-8 mt-12"
      >
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isAddressSelected || (!sameAsBilling && !isBillingAddressSelected) || loading}
          className="w-full"
        >
          {loading ? translations.address.saving : translations.address.continue}
        </Button>
        
        {error && (
          <p className="text-sm text-red-500">
            {error === 'Please select a valid address from the suggestions'
              ? translations.address.validation.selectAddress
              : error === 'Please select a valid billing address from the suggestions'
              ? translations.address.validation.selectBilling
              : error}
          </p>
        )}
        
      </motion.div>
    </Layout>
  );
}