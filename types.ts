
export interface CropHealthHistoryItem {
  id: string;
  imageUrl: string;
  analysis: {
    disease: string;
    remedy: string;
  };
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CROP_ANALYSIS = 'CROP_ANALYSIS',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
  MARKETPLACE = 'MARKETPLACE',
  FERTILIZER_STORE = 'FERTILIZER_STORE',
  BROWSE_PRODUCE = 'BROWSE_PRODUCE',
  MANAGE_LISTINGS = 'MANAGE_LISTINGS',
}

export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  SELLER = 'SELLER', // Fertilizer Seller
}

export enum LanguageCode {
    ENGLISH = 'en-US',
    HINDI = 'hi-IN',
    TELUGU = 'te-IN',
    MALAYALAM = 'ml-IN',
}

export interface User {
  email: string;
  role?: UserRole;
  verified: boolean;
  displayName?: string;
  authMethod: 'email' | 'google';
}

export interface ProductListing {
  id: string;
  name: string;
  quantity: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface Fertilizer {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}