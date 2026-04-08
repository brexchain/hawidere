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
    waiterComment: "A klassischer Start, waun ma scho am Vormittag an Durscht hod."
  },
  {
    id: 2,
    name: "Sissi Sprizz",
    price: 6.9,
    cat: 'Durscht',
    subCat: 'Aperitivo',
    info: "Frizzante, Holunder, Soda, Limette",
    image: "https://picsum.photos/seed/drink2/400/400",
    waiterComment: "Kaiserlich! Do wiad sogoa de Sissi wieda munter."
  },
  {
    id: 3,
    name: "Campari Soda",
    price: 4.6,
    cat: 'Durscht',
    subCat: 'Aperitivo',
    info: "Bitter-Siaß und rot wie de Liebe.",
    image: "https://picsum.photos/seed/drink3/400/400",
    waiterComment: "Fia de, de wissen wos guad is."
  },
  {
    id: 4,
    name: "Domrep Pils",
    price: 4.8,
    cat: 'Durscht',
    subCat: 'Bier',
    info: "Frisch zapft, mit ana scheen Schaumkron.",
    image: "https://picsum.photos/seed/beer/400/400",
    waiterComment: "A kühles Blondes fia an kühlen Kopf."
  },
  {
    id: 5,
    name: "Gemischter Satz",
    price: 5.2,
    cat: 'Durscht',
    subCat: 'Wei',
    info: "Direkt aus de Wiener Weinberg.",
    image: "https://picsum.photos/seed/wine/400/400",
    waiterComment: "Des is Wien im Glasl, Herrschaften!"
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
    waiterComment: "Vegan? Na guat, waun's sein muass. Schmeckt owa trotzdem!"
  },
  {
    id: 11,
    name: "Kaspress Fries",
    price: 7.1,
    cat: 'Essn',
    subCat: 'Vorspeis',
    info: "Bergkas, Erdäpfel, Brotsticks mit Sauce Trara.",
    image: "https://picsum.photos/seed/food2/400/400",
    waiterComment: "A Wahnsinn, do legst di nieda!"
  },
  {
    id: 12,
    name: "Hawidere Burger",
    price: 19.4,
    cat: 'Essn',
    subCat: 'Burger',
    info: "Rindfleisch (200g), Speck, Bergkas, Zwiebel, Chili-Senf-Sauce.",
    image: "https://picsum.photos/seed/burger1/400/400",
    waiterComment: "Des is ka Burger, des is a Monument!"
  },
  {
    id: 13,
    name: "Pastrami Sandwich",
    price: 14.9,
    cat: 'Essn',
    subCat: 'Sandwich',
    info: "Pastrami, Coleslaw, Essiggurkerl, siaßer Senf.",
    image: "https://picsum.photos/seed/sandwich/400/400",
    waiterComment: "A gscheite Jausn fia gscheite Leit."
  },
  {
    id: 14,
    name: "Fiaker Burger",
    price: 19.9,
    cat: 'Essn',
    subCat: 'Burger',
    info: "Pulled Beef Gulasch, Spiegelei, Frankfurter, Essiggurkerl.",
    image: "https://picsum.photos/seed/burger2/400/400",
    waiterComment: "Wia a Gulasch, nua bessa zum In-de-Händ-hoidn."
  },
  {
    id: 15,
    name: "Süßkartoffelsuppn",
    price: 5.9,
    cat: 'Essn',
    subCat: 'Suppn',
    info: "Mit Kokosmilch und Erbsen. Vegan.",
    image: "https://picsum.photos/seed/soup/400/400",
    waiterComment: "Wos fia de Linie, damit de Hosn nu passt."
  }
];
