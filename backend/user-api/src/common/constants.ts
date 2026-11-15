export const DETAILED_POST_SELECTION = {
  id: true,
  title: true,
  body: true,
  status: true,
  media: true,
  productData: true,
  influencer: {
    id: true,
    avatar: true,
    user: {
      id: true,
      first_name: true,
      last_name: true,
    },
  },
  postProduct: {
    id: true,
    product_favourites: {
      id: true,
      consumer: {
        id: true,
      },
    },
    product: {
      id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      colors: true as any,
      productLink: true,
      productSizes: {
        active: true,
        size: {
          label: true,
        },
      },
      media: true,
    },
  },
  tags: true,
  created_at: true,
  updated_at: true,
};

export const UBU_TEAM_EMAILS = [
  { email: 'ali.javed@codingcops.com', name: 'Ali Javed' },
  { email: 'sohaib@codingcops.com', name: 'Sohaib Khan' },
  { email: 'irtaza.fiaz@codingcops.com', name: 'Irtaza Fiaz' },
  { email: 'usman.shahid@codingcops.com', name: 'Usman Shahid' },
];

export const QUESTIONS_SERIAL_NUMBERS = {
  gender: 2,
  shape: 10,
  feminineStyles: 16,
  masculineStyles: 17,
  nonBinaryStyles: 31,
};

export const STYLE_QUESTIONS_SR_NO = [16, 17, 31];
export const STYLE_QUESTIONS_SR_NO_MINOR = [16, 17];
export const BUDGET_QUESTIONS_SR_NO = [15];
export const GENDER_QUESTIONS_SR_NO = [2];

export const BODY_TYPE_OPTIONS = [
  '🍏 Apple',
  '🍐 Pear',
  '⏳ Hourglass',
  '🔺 Inverted Triangle',
  '▭ Rectangle-shaped',
  '🦒 Long Torso',
  '🐢 Short Torso',
  '🦵 Long Legs',
  '🐇 Short Legs',
];

export const BODY_SHADE_OPTIONS = [
  'Fair',
  'Light',
  'Medium',
  'Olive',
  'Tan',
  'Dark',
];

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Any',
];

export const STYLE_OPTIONS = [
  'Fitness-Focused',
  'Family-Oriented',
  'Travel Enthusiast',
  'Homebody',
  'Career-Driven',
  'Social Butterfly',
  'Love-to-Host',
];

export const NON_BINARY_STYLES = [
  'Gender Neutral Styles',
  'Bold & Daring Styles',
];
export const MASCULINE_STYLES = [
  'Simple and Laid Back ("Hot Guy Next Door")',
  'Power Player',
  'Street Edge',
  'Coastal Casual',
  'Timeless Classic',
  'Modern Minimalist',
  'Western Wear',
  'Chameleon Style',
];
export const FEMININE_STYLES = [
  'Vintage Vibes',
  'Bold',
  'Urban Chic',
  'Beachy Vibes',
  'Boho',
  'Girl Next-Door',
  'Classic Elegance',
  'Sleek Minimalist',
  'Old Money',
  'Cowgirl Chic',
  'Chameleon Style',
];

export enum SignInMethods {
  MANUAL = 'manual',
  GOOGLE = 'google',
  APPLE = 'apple',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
}