interface GeolocationResponse {
  country_code: string;
  country_name: string;
  error?: boolean;
}

export async function detectCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Glamic/1.0'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GeolocationResponse = await response.json();
    
    if (data.error || !data.country_code) {
      throw new Error('Invalid response from geolocation service');
    }
    
    return data.country_code;
  } catch (error) {
    console.error('Country detection failed:', error);
    throw error; // Re-throw to handle in language detection
  }
}