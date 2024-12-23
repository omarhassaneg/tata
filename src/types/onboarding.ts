export interface UserData {
  authMethod?: 'phone' | 'email' | 'social';
  businessName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  instagram: string;
  verificationCode: string;
  emailVerificationCode?: string;
  displaySettings?: {
    showPhone: boolean;
    showEmail: boolean;
    showInstagram: boolean;
  };
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}
