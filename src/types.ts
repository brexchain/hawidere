export type Category = 'Essn' | 'Durscht';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  cat: Category;
  subCat: string;
  info: string;
  image?: string;
  waiterComment?: string;
  isSoldOut?: boolean;
  dietary?: ('vegan' | 'veggie' | 'glutenfree' | 'spicy')[];
  allergens?: string[];
  chefNote?: string;
  isFeatured?: boolean;
  pairings?: number[]; // IDs of suggested items
  translations?: {
    en: {
      name: string;
      info: string;
      subCat: string;
      waiterComment?: string;
    }
  };
}

export interface AppConfig {
  name: string;
  logo?: string;
  bgImage?: string;
  primaryColor: string;
  tileLayout?: 'big' | 'small';
  language?: 'at' | 'en';
  promoText?: string;
  promoBannerUrl?: string;
  discount?: number;
  contacts: {
    bar: string;
    kitchen: string;
    boss: string;
  };
}
