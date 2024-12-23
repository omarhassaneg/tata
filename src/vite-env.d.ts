/// <reference types="vite/client" />

declare namespace google.maps {
  export class places {
    static PlacesServiceStatus: {
      OK: string;
      ZERO_RESULTS: string;
      OVER_QUERY_LIMIT: string;
      REQUEST_DENIED: string;
      INVALID_REQUEST: string;
    };

    export class AutocompleteService {
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    export interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
      };
    }

    export interface AutocompletionRequest {
      input: string;
      sessionToken?: string;
      types?: string[];
    }
  }
}