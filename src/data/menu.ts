import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // DURSCHT (Drinks)
  {
    id: 1,
    name: "Gedeck 'A'",
    price: 5.9,
    cat: 'Durscht',
    subCat: 'Aperitivo',
    info: "1/3 Pt. Domrep Pils & 2cl. Averna Sour",
    image: "https://picsum.photos/seed/drink1/400/400",
    waiterComment: "A klassischer Start, waun ma scho am Vormittag an Durscht hod.",
    translations: {
      en: {
        name: "Combo 'A'",
        info: "1/3 Pt. Pils & 2cl. Averna Sour",
        subCat: "Aperitivo",
        waiterComment: "A classic start, even if you're thirsty in the morning."
      }
    }
  },
  {
    id: 2,
    name: "Sissi Sprizz",
    price: 6.9,
    cat: 'Durscht',
    subCat: 'Aperitivo',
    info: "Frizzante, Holunder, Soda, Limette",
    image: "https://picsum.photos/seed/drink2/400/400",
    waiterComment: "Kaiserlich! Do wiad sogoa de Sissi wieda munter.",
    translations: {
      en: {
        name: "Sissi Spritz",
        info: "Sparkling wine, elderflower, soda, lime",
        subCat: "Aperitivo",
        waiterComment: "Imperial! This would even wake up Empress Sissi."
      }
    }
  },
  {
    id: 3,
    name: "Campari Soda",
    price: 4.6,
    cat: 'Durscht',
    subCat: 'Aperitivo',
    info: "Bitter-Siaß und rot wie de Liebe.",
    image: "https://picsum.photos/seed/drink3/400/400",
    waiterComment: "Fia de, de wissen wos guad is.",
    translations: {
      en: {
        name: "Campari Soda",
        info: "Bittersweet and red like love.",
        subCat: "Aperitivo",
        waiterComment: "For those who know what's good."
      }
    }
  },
  {
    id: 4,
    name: "Domrep Pils",
    price: 4.8,
    cat: 'Durscht',
    subCat: 'Bier',
    info: "Frisch zapft, mit ana scheen Schaumkron.",
    image: "https://picsum.photos/seed/beer/400/400",
    waiterComment: "A kühles Blondes fia an kühlen Kopf.",
    translations: {
      en: {
        name: "Domrep Pils",
        info: "Freshly tapped with a nice foam head.",
        subCat: "Beer",
        waiterComment: "A cold one to keep a cool head."
      }
    }
  },
  {
    id: 5,
    name: "Gemischter Satz",
    price: 5.2,
    cat: 'Durscht',
    subCat: 'Wei',
    info: "Direkt aus de Wiener Weinberg.",
    image: "https://picsum.photos/seed/wine/400/400",
    waiterComment: "Des is Wien im Glasl, Herrschaften!",
    translations: {
      en: {
        name: "Gemischter Satz",
        info: "Directly from the Viennese vineyards.",
        subCat: "Wine",
        waiterComment: "This is Vienna in a glass, ladies and gentlemen!"
      }
    }
  },

  // ESSN (Food)
  {
    id: 10,
    name: "Hummus (Kichererbsen-Gatsch)",
    price: 6.4,
    cat: 'Essn',
    subCat: 'Vorspeis',
    info: "Hausgmocht, mit Olivenöl und an Brot.",
    image: "https://picsum.photos/seed/food1/400/400",
    waiterComment: "Vegan? Na guat, waun's sein muass. Schmeckt owa trotzdem!",
    dietary: ['vegan'],
    translations: {
      en: {
        name: "Hummus (Chickpea Mash)",
        info: "Homemade, with olive oil and bread.",
        subCat: "Starter",
        waiterComment: "Vegan? Well, if it must be. Tastes great anyway!"
      }
    }
  },
  {
    id: 11,
    name: "Kaspress Fries",
    price: 7.1,
    cat: 'Essn',
    subCat: 'Vorspeis',
    info: "Bergkas, Erdäpfel, Brotsticks mit Sauce Trara.",
    image: "https://picsum.photos/seed/food2/400/400",
    waiterComment: "A Wahnsinn, do legst di nieda!",
    dietary: ['veggie'],
    allergens: ['A', 'G', 'L'],
    chefNote: "De Erdäpfel san aus'm Marchfeld, frisch ausgrom.",
    pairings: [302], // Suggest another drink
    translations: {
      en: {
        name: "Cheese Press Fries",
        info: "Mountain cheese, potatoes, breadsticks with Tartar sauce.",
        subCat: "Starter",
        waiterComment: "Incredible, it'll knock your socks off!"
      }
    }
  },
  {
    id: 12,
    name: "Hawidere Burger",
    price: 19.4,
    cat: 'Essn',
    subCat: 'Burger',
    info: "Rindfleisch (200g), Speck, Bergkas, Zwiebel, Chili-Senf-Sauce.",
    image: "https://picsum.photos/seed/burger1/400/400",
    waiterComment: "Des is ka Burger, des is a Monument!",
    dietary: ['spicy'],
    allergens: ['A', 'C', 'G', 'M'],
    chefNote: "Unser Rindfleisch kummt direkt vom Fleischer Mayer aus'n 16. Hieb.",
    pairings: [301], // Suggest a beer
    translations: {
      en: {
        name: "Hawidere Burger",
        info: "Beef (200g), bacon, mountain cheese, onion, chili-mustard sauce.",
        subCat: "Burger",
        waiterComment: "This isn't just a burger, it's a monument!"
      }
    }
  },
  {
    id: 13,
    name: "Pastrami Sandwich",
    price: 14.9,
    cat: 'Essn',
    subCat: 'Sandwich',
    info: "Pastrami, Coleslaw, Essiggurkerl, siaßer Senf.",
    image: "https://picsum.photos/seed/sandwich/400/400",
    waiterComment: "A gscheite Jausn fia gscheite Leit.",
    translations: {
      en: {
        name: "Pastrami Sandwich",
        info: "Pastrami, coleslaw, pickles, sweet mustard.",
        subCat: "Sandwich",
        waiterComment: "A proper snack for proper people."
      }
    }
  },
  {
    id: 14,
    name: "Fiaker Burger",
    price: 19.9,
    cat: 'Essn',
    subCat: 'Burger',
    info: "Pulled Beef Gulasch, Spiegelei, Frankfurter, Essiggurkerl.",
    image: "https://picsum.photos/seed/burger2/400/400",
    waiterComment: "Wia a Gulasch, nua bessa zum In-de-Händ-hoidn.",
    translations: {
      en: {
        name: "Fiaker Burger",
        info: "Pulled beef goulash, fried egg, sausage, pickles.",
        subCat: "Burger",
        waiterComment: "Like a goulash, but easier to hold in your hands."
      }
    }
  },
  {
    id: 15,
    name: "Süßkartoffelsuppn",
    price: 5.9,
    cat: 'Essn',
    subCat: 'Suppn',
    info: "Mit Kokosmilch und Erbsen. Vegan.",
    image: "https://picsum.photos/seed/soup/400/400",
    waiterComment: "Wos fia de Linie, damit de Hosn nu passt.",
    dietary: ['vegan', 'glutenfree'],
    translations: {
      en: {
        name: "Sweet Potato Soup",
        info: "With coconut milk and peas. Vegan.",
        subCat: "Soup",
        waiterComment: "Good for the waistline, so your pants still fit."
      }
    }
  }
];
