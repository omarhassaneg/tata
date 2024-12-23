import { loadScript } from '../utils/script';

let googleMapsLoaded = false;
let AutocompleteSessionToken: any;
let initializationPromise: Promise<void> | null = null;

export interface PlaceResult {
  id: string;
  address: string;
  placeId: string;
}

export async function initGoogleMaps(): Promise<void> {
  // Return existing initialization if in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  // Return immediately if already loaded
  if (googleMapsLoaded) {
    return Promise.resolve();
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  // Create new initialization promise
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      await loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`);
      
      // Verify Google Maps loaded correctly
      if (!window.google?.maps?.places) {
        throw new Error('Google Maps Places library failed to load');
      }

      AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
      googleMapsLoaded = true;
      resolve();
    } catch (error) {
      console.error('Google Maps initialization failed:', error);
      reject(error);
    } finally {
      initializationPromise = null;
    }
  });

  return initializationPromise;
}

export function searchPlaces(input: string): Promise<PlaceResult[]> {
  return new Promise((resolve, reject) => {
    if (!googleMapsLoaded || !window.google?.maps?.places) {
      reject(new Error('Google Maps not initialized'));
      return;
    }

    try {
      const service = new google.maps.places.AutocompleteService();
      const sessionToken = new AutocompleteSessionToken();
      
      const request = {
        input,
        sessionToken,
        types: ['address'],
      };

      service.getPlacePredictions(
        request,
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              reject(new Error(`Places service failed with status: ${status}`));
            }
            return;
          }

          const results = predictions?.map(prediction => ({
            id: prediction.place_id,
            address: prediction.description,
            placeId: prediction.place_id
          })) || [];

          resolve(results);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}