import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { detectCountry } from '../../services/geolocation';
import { formatPhoneNumber, validatePhoneNumber, normalizePhoneNumber } from '../../utils/phoneNumber';
import { Country, countries } from '../../data/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneInput({ 
  value, 
  onChange, 
  onValidChange,
  error, 
  disabled,
  required 
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);

  // Initialize country based on geolocation
  useEffect(() => {
    const initializeCountry = async () => {
      try {
        const countryCode = await detectCountry();
        const detectedCountry = countries.find(c => c.code === countryCode);
        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
        }
      } catch (error) {
        console.error('Error detecting country:', error);
      }
    };

    initializeCountry();
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    
    // Revalidate current number with new country code
    if (displayValue) {
      const fullNumber = `${country.dialCode}${displayValue.replace(/\D/g, '')}`;
      const isValid = validatePhoneNumber(fullNumber, country.code);
      onValidChange?.(isValid);
      
      if (isValid) {
        onChange(normalizePhoneNumber(fullNumber, country.code));
      }
    }
    
    // Focus input after country selection
    inputRef.current?.focus();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const nationalNumber = inputValue.replace(/\D/g, '');
    setDisplayValue(nationalNumber);
    
    const fullNumber = `${selectedCountry.dialCode}${nationalNumber}`;
    const isValid = validatePhoneNumber(fullNumber, selectedCountry.code);
    setIsValid(isValid);
    
    console.log('Input Value:', inputValue); // Log the raw input value
    console.log('National Number:', nationalNumber); // Log the national number
    console.log('Full Number:', fullNumber); // Log the full number being validated
    console.log('Is Valid:', isValid); // Log the validation result
    
    if (isValid) {
      onChange(normalizePhoneNumber(fullNumber, selectedCountry.code));
    } else {
      onChange('');
    }

    // Only call onValidChange when validation state changes
    onValidChange?.(isValid);
  };

  const clearInput = () => {
    setDisplayValue('');
    onChange('');
    setIsValid(false);
    onValidChange?.(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className={`flex rounded-2xl border-2 transition-colors ${
        error ? 'border-red-500' : 'border-gray-200 focus-within:border-primary-gold'
      }`}>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-4 text-gray-600 hover:text-gray-900 transition-colors bg-transparent ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-50 top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.dialCode}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          placeholder="Phone number"
          disabled={disabled}
          required={required}
          className="flex-1 px-3 py-4 focus:outline-none text-lg disabled:opacity-50 bg-transparent"
        />

        {displayValue && !disabled && (
          <button
            type="button"
            onClick={clearInput}
            className="px-4 text-gray-400 hover:text-gray-600 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
