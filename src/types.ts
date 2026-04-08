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
}

export interface AppConfig {
  name: string;
  logo?: string;
  bgImage?: string;
  primaryColor: string;
  promoText?: string;
  promoBannerUrl?: string;
  discount?: number;
  contacts: {
    bar: string;
    kitchen: string;
    boss: string;
  };
}
