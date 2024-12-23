interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      phone?: string;
    }
  }
}

export async function signInWithEmail(email: string): Promise<AuthResponse> {
  // Simulated API call - replace with actual endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: 'temp_token',
          user: {
            id: '123',
            email: email
          }
        }
      });
    }, 1000);
  });
}

export async function signInWithPhone(phone: string): Promise<AuthResponse> {
  // Simulated API call - replace with actual endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: 'temp_token',
          user: {
            id: '123',
            phone: phone
          }
        }
      });
    }, 1000);
  });
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  // Simulated API call - replace with actual endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: 'temp_token',
          user: {
            id: '123',
            email: 'google.user@example.com'
          }
        }
      });
    }, 1000);
  });
}

export async function signInWithApple(): Promise<AuthResponse> {
  // Simulated API call - replace with actual endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: 'temp_token',
          user: {
            id: '123',
            email: 'apple.user@example.com'
          }
        }
      });
    }, 1000);
  });
}