interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function saveServiceLocation(location: any): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving service location:', location);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { location }
      });
    }, 1000);
  });
}

export async function saveServices(services: any[]): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving services:', services);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { services }
      });
    }, 1000);
  });
}

export async function saveAddresses(addresses: {
  baseAddress: string;
  billingAddress: string;
  sameAsBilling: boolean;
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('API Call - Saving addresses:', addresses);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { addresses }
      });
    }, 1000);
  });
}

export async function saveServiceAreaSettings(settings: {
  mobileRadius: number;
  travelFeePerKm: number;
  minTravelFee: number;
  minimumSpend: number;
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('API Call - Saving service area settings:', settings);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { settings }
      });
    }, 1000);
  });
}

export async function saveSchedule(scheduleData: {
  mobile?: { workDays: any[] };
  studio?: { workDays: any[] };
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving schedule settings:', scheduleData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { schedule: scheduleData }
      });
    }, 1000);
  });
}

export async function saveContactSettings(settings: {
  displaySettings: {
    showPhone: boolean;
    showEmail: boolean;
    showInstagram: boolean;
  };
  phone?: string;
  email?: string;
  instagram?: string;
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving contact display settings:', settings);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { settings }
      });
    }, 1000);
  });
}

export async function saveWebsiteTheme(theme: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website theme:', theme);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { theme }
      });
    }, 1000);
  });
}

export async function checkSlugAvailability(slug: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Checking slug availability:', slug);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some slugs being taken
      const unavailableList = ['test', 'admin', 'glamic'];
      resolve({
        success: true,
        data: { 
          available: !unavailableList.includes(slug.toLowerCase())
        }
      });
    }, 600);
  });
}

export async function saveWebsiteSlug(slug: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website slug:', slug);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { slug }
      });
    }, 1000);
  });
}

export async function saveWebsiteLogo(logo: {
  type: 'text' | 'image';
  content: string;
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website logo:', logo);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { logo }
      });
    }, 1000);
  });
}

export async function saveWebsiteCover(coverImageUrl: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website cover:', coverImageUrl);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { coverImageUrl }
      });
    }, 1000);
  });
}

export async function saveWebsiteHeadline(headline: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website headline:', headline);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { headline }
      });
    }, 1000);
  });
}

export async function saveWebsiteSubheadline(subheadline: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website subheadline:', subheadline);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { subheadline }
      });
    }, 1000);
  });
}

export async function savePortfolioImages(images: Array<{
  id: string;
  url: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}>): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving portfolio images:', images);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { images }
      });
    }, 1000);
  });
}

export async function saveWebsiteBio(bio: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving website bio:', bio);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { bio }
      });
    }, 1000);
  });
}

export async function saveBalanceReminder(timing: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving balance reminder timing:', timing);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { timing }
      });
    }, 1000);
  });
}

export async function saveProfilePhoto(photoUrl: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving profile photo:', photoUrl);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { photoUrl }
      });
    }, 1000);
  });
}

export async function saveDepositSettings(settings: {
  depositPercentage: number;
}): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving deposit settings:', settings);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { settings }
      });
    }, 1000);
  });
}

export async function saveCashPaymentSettings(instructions: string): Promise<ApiResponse<any>> {
  // Simulated API call - replace with actual endpoint
  console.log('Saving cash payment instructions:', instructions);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { instructions }
      });
    }, 1000);
  });
}