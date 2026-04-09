import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { 
  Utensils, 
  Beer, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  MessageSquare,
  ChevronRight,
  Coffee,
  Settings,
  Image as ImageIcon,
  Save,
  Trash2,
  Phone,
  Tag,
  AlertCircle,
  Moon,
  Sun,
  LayoutGrid,
  List,
  CheckCircle2,
  Search,
  Leaf,
  Wheat,
  Flame,
  BellRing,
  Fingerprint
} from 'lucide-react';
import { MENU_ITEMS as INITIAL_MENU } from './data/menu';
import { MenuItem, Category, AppConfig } from './types';

const DEFAULT_CONFIG: AppConfig = {
  name: "Hawidere!",
  primaryColor: "#654336",
  contacts: {
    bar: "43660000000",
    kitchen: "43660000001",
    boss: "43660000002"
  }
};

export default function App() {
  const [activeCat, setActiveCat] = useState<Category>('Essn');
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('hawidere_nightmode') === 'true';
  });
  const [stamps, setStamps] = useState(() => {
    return Number(localStorage.getItem('hawidere_stamps')) || 0;
  });
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [waiterMessage, setWaiterMessage] = useState("Hawidere! Wos deaf's sein?");
  const [lastCommentedItem, setLastCommentedItem] = useState<number | null>(null);
  const [flyingItems, setFlyingItems] = useState<{ id: string; x: number; y: number; image?: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDietary, setActiveDietary] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [feedback, setFeedback] = useState<{ rating: string; comment: string } | null>(null);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'preparing' | 'ready'>('pending');
  const [adminTab, setAdminTab] = useState<'config' | 'orders'>('config');
  const [liveOrders, setLiveOrders] = useState<{ id: string; items: any[]; total: number; status: string; table: string; time: string }[]>([]);
  const [liveFeedback, setLiveFeedback] = useState<{ id: string; rating: string; comment: string; time: string }[]>([]);
  const [lastOrder, setLastOrder] = useState<{ items: any[]; total: number } | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentSheetType, setPaymentSheetType] = useState<'apple' | 'google' | null>(null);
  const [paymentProcessingStep, setPaymentProcessingStep] = useState<'idle' | 'authenticating' | 'processing'>('idle');
  const cartIconControls = useAnimation();

  // Table Number Detection
  const tableNumber = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('table') || params.get('tisch');
  }, []);

  // Persisted State
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('hawidere_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('hawidere_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  useEffect(() => {
    localStorage.setItem('hawidere_config', JSON.stringify(config));
    document.documentElement.style.setProperty('--primary', config.primaryColor);
  }, [config]);

  useEffect(() => {
    localStorage.setItem('hawidere_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('hawidere_nightmode', String(isNightMode));
    if (isNightMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isNightMode]);

  useEffect(() => {
    localStorage.setItem('hawidere_stamps', String(stamps));
  }, [stamps]);

  const t = useMemo(() => {
    const lang = config.language || 'at';
    const dict = {
      at: {
        essn: "Essn",
        durscht: "Durscht",
        cart: "Warenkorb",
        pay: "Glei kummt's!",
        total: "Insgesamt:",
        loyalty: "Stammgast-Koatn",
        stamps: "Nu {n} Trümmerl bis zum Gschenk!",
        free: "Oans geht auf's Haus!",
        order_success: "Kummt scho! Is scho in Arbeit.",
        passt: "Passt! {item} is drin.",
        complaint: "Wos passt ned? (Beschwerde an Chef)",
        upsell: "Wos dazua? (Vielleicht nu wos?)",
        checkout: "Zoin bitte!",
        empty: "Noch is nix im Körbal.",
        payment_method: "Wia wuist zoin?",
        pay_now: "Jetzt bzoihn",
        processing: "Wiad gmocht...",
        paid: "Ois erledigt! Danke!",
        search: "Suchen...",
        all: "Ois",
        vegan: "Vegan",
        veggie: "Veggie",
        glutenfree: "Glutenfrei",
        spicy: "Scharf",
        call_waiter: "Herr Ober!",
        allergens: "Allergene",
        chef_note: "Vom Chef empfohln",
        pairings: "Des passt perfekt dazua:",
        feedback_title: "Wia woas?",
        feedback_placeholder: "Schreib uns wos nettes...",
        send_feedback: "Schicken",
        feedback_thanks: "Danke fia dei Feedback! Bussi!",
        close: "Zua",
        status_pending: "Bestellung erhalten",
        status_preparing: "In da Kuchl...",
        status_ready: "Glei bei dir!",
        live_orders: "Live Bestellungen",
        no_orders: "Noch ka Stress."
      },
      en: {
        essn: "Food",
        durscht: "Drinks",
        cart: "Cart",
        pay: "Order Now",
        total: "Total:",
        loyalty: "Loyalty Card",
        stamps: "{n} more items until your gift!",
        free: "One's on the house!",
        order_success: "Coming right up! It's in the works.",
        passt: "Got it! {item} added.",
        complaint: "Something wrong? (Feedback to Boss)",
        upsell: "Add something? (Maybe one more?)",
        checkout: "Checkout",
        empty: "Your cart is empty.",
        payment_method: "How would you like to pay?",
        pay_now: "Pay Now",
        processing: "Processing...",
        paid: "All done! Thank you!",
        search: "Search...",
        all: "All",
        vegan: "Vegan",
        veggie: "Veggie",
        glutenfree: "Gluten-Free",
        spicy: "Spicy",
        call_waiter: "Call Waiter",
        allergens: "Allergens",
        chef_note: "Chef's Note",
        pairings: "Perfect Match:",
        feedback_title: "How was it?",
        feedback_placeholder: "Leave a nice word...",
        send_feedback: "Send",
        feedback_thanks: "Thanks for your feedback! Cheers!",
        close: "Close",
        status_pending: "Order received",
        status_preparing: "In the kitchen...",
        status_ready: "Almost there!",
        live_orders: "Live Orders",
        no_orders: "No stress yet."
      }
    };
    return dict[lang as keyof typeof dict];
  }, [config.language]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCat = item.cat === activeCat;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.info.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.translations?.en?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDietary = !activeDietary || item.dietary?.includes(activeDietary as any);
      return matchesCat && matchesSearch && matchesDietary;
    });
  }, [activeCat, menuItems, searchQuery, activeDietary]);

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find(i => i.id === Number(id));
      if (!item) return null;
      return { ...item, qty: qty as number };
    }).filter((i): i is (MenuItem & { qty: number }) => i !== null && i.qty > 0);
  }, [cart, menuItems]);

  const totalPrice = useMemo(() => {
    const rawTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
    if (config.discount) {
      return rawTotal * (1 - config.discount / 100);
    }
    return rawTotal;
  }, [cartItems, config.discount]);

  const addToCart = (item: MenuItem, e?: React.MouseEvent) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    // Premium Feedback: Flying Item
    if (e) {
      const id = Math.random().toString(36).substr(2, 9);
      setFlyingItems(prev => [...prev, { id, x: e.clientX, y: e.clientY, image: item.image }]);
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(i => i.id !== id));
        cartIconControls.start({
          scale: [1, 1.3, 1],
          transition: { duration: 0.3 }
        });
      }, 600);
    }

    // Premium Feedback: Confirmation Signal
    setShowConfirmation(config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name);
    setTimeout(() => setShowConfirmation(null), 2000);

    if (item.waiterComment && item.id !== lastCommentedItem) {
      const comment = (config.language === 'en' && item.translations?.en?.waiterComment) 
        ? item.translations.en.waiterComment 
        : item.waiterComment;
      setWaiterMessage(comment);
      setLastCommentedItem(item.id);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0);

  const upsellItems = useMemo(() => {
    if (cartItems.length === 0) return [];
    
    // Determine which category to upsell from
    // If they have more food, suggest drinks. If more drinks, suggest food.
    const foodCount = cartItems.filter(i => i.cat === 'Essn').length;
    const drinkCount = cartItems.filter(i => i.cat === 'Durscht').length;
    const upsellCat: Category = foodCount >= drinkCount ? 'Durscht' : 'Essn';
    
    // Get items from the upsell category that aren't in the cart
    return menuItems
      .filter(item => item.cat === upsellCat && !cart[item.id])
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [cart, menuItems, cartItems]);

  const handleOrder = () => {
    const foodItems = cartItems.filter(i => i.cat === 'Essn');
    const drinkItems = cartItems.filter(i => i.cat === 'Durscht');

    const formatMsg = (items: (MenuItem & { qty: number })[], type: string) => {
      const tableInfo = tableNumber ? `\n📍 *TISCH: ${tableNumber}*` : '';
      return `*NEUE BESTELLUNG (${type})*${tableInfo}\n\n${items.map(i => `${i.qty}x ${i.name}`).join('\n')}`;
    };

    if (foodItems.length > 0) {
      const msg = encodeURIComponent(formatMsg(foodItems, 'KÜCHE'));
      window.open(`https://wa.me/${config.contacts.kitchen}?text=${msg}`, '_blank');
    }

    if (drinkItems.length > 0) {
      const msg = encodeURIComponent(formatMsg(drinkItems, 'BAR'));
      window.open(`https://wa.me/${config.contacts.bar}?text=${msg}`, '_blank');
    }

    setCart({});
    setIsCartOpen(false);
    setStamps(prev => prev + cartItems.length);
    setWaiterMessage(t.order_success);
  };

  const handlePayment = async (type: 'apple' | 'google') => {
    setPaymentSheetType(type);
    setIsPaymentSheetOpen(true);
    setPaymentProcessingStep('idle');
  };

  const confirmPayment = async () => {
    setPaymentProcessingStep('authenticating');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentProcessingStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPaymentSheetOpen(false);
    setPaymentSuccess(true);
    
    // Simulate order status progression
    setOrderStatus('pending');
    setTimeout(() => setOrderStatus('preparing'), 4000);
    setTimeout(() => setOrderStatus('ready'), 10000);

    // Process the order (stamps, clear cart) but don't close the overlay
    const itemsCount = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
    const newOrder = {
      id: orderId,
      items: cartItems,
      total: totalPrice,
      status: 'pending',
      table: tableNumber || '?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLiveOrders(prev => [newOrder, ...prev]);
    setLastOrder({ items: cartItems, total: totalPrice });
    setFeedbackSubmitted(false);

    setStamps(prev => prev + itemsCount);
    setCart({});
    setIsCartOpen(false);
  };

  const handleComplaint = () => {
    const msg = encodeURIComponent("*BESCHWERDE / FEEDBACK*\n\nServas Chef, i muass da wos sogn...");
    window.open(`https://wa.me/${config.contacts.boss}?text=${msg}`, '_blank');
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans max-w-2xl mx-auto shadow-2xl bg-app relative overflow-x-hidden"
      style={config.bgImage ? { backgroundImage: `url(${config.bgImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' } : {}}
    >
      {/* Promo Banner */}
      {config.promoText && (
        <div 
          className="relative h-24 flex items-center justify-center overflow-hidden"
          style={config.promoBannerUrl ? { backgroundImage: `url(${config.promoBannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: 'var(--primary)' }}
        >
          {config.promoBannerUrl && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 text-white text-center px-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Tag size={20} className="text-white" />
              <span className="text-lg font-black uppercase tracking-tighter">{config.promoText}</span>
            </div>
            {config.discount && (
              <div className="bg-white text-primary px-3 py-0.5 rounded-full text-sm font-black inline-block">
                -{config.discount}% RABATT
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-header-app backdrop-blur-md border-b border-app p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {config.logo && <img src={config.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-app" />}
            <h1 className="serif text-4xl font-bold text-app tracking-tight">
              {config.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const newLang = config.language === 'en' ? 'at' : 'en';
                setConfig({...config, language: newLang});
              }}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm active:scale-90 flex items-center justify-center font-bold text-sm"
              title="Tourist Mode"
            >
              {config.language === 'en' ? '🇦🇹' : '🇬🇧'}
            </button>
            <button 
              onClick={() => setIsLoyaltyOpen(true)}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm active:scale-90 relative"
            >
              <Coffee size={24} />
              {stamps > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-app">
                  {stamps % 10}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsNightMode(!isNightMode)}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm active:scale-90"
            >
              {isNightMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm active:scale-90"
            >
              <Settings size={24} />
            </button>
            <motion.button 
              animate={cartIconControls}
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity shadow-sm active:scale-90"
            >
              <ShoppingCart size={24} />
              {(totalItems as number) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-app">
                  {totalItems}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Waiter Bubble */}
        <motion.div 
          key={waiterMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-app p-4 rounded-2xl rounded-tl-none border border-app shadow-sm flex gap-3 items-start"
        >
          <div className="bg-primary/10 p-2 rounded-full shrink-0">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <p className="serif italic text-lg text-app leading-tight">
            "{waiterMessage}"
          </p>
        </motion.div>
      </header>

      {/* Search & Filters */}
      <div className="px-4 pb-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app opacity-40" size={18} />
          <input 
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card-app border border-app rounded-2xl py-3 pl-12 pr-4 text-app focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveDietary(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeDietary === null 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-card-app text-app border-app opacity-60'
            }`}
          >
            {t.all}
          </button>
          {['vegan', 'veggie', 'glutenfree', 'spicy'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveDietary(tag)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeDietary === tag 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-card-app text-app border-app opacity-60'
              }`}
            >
              {t[tag as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex p-4 gap-4 sticky top-[164px] z-20 bg-app/90 backdrop-blur-sm">
        <button
          onClick={() => setActiveCat('Essn')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
            activeCat === 'Essn' 
              ? 'bg-primary text-white shadow-lg scale-105' 
              : 'bg-card-app text-app border border-app hover:opacity-80'
          }`}
        >
          <Utensils size={20} />
          {t.essn}
        </button>
        <button
          onClick={() => setActiveCat('Durscht')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
            activeCat === 'Durscht' 
              ? 'bg-primary text-white shadow-lg scale-105' 
              : 'bg-card-app text-app border border-app hover:opacity-80'
          }`}
        >
          <Beer size={20} />
          {t.durscht}
        </button>
      </div>

      {/* Menu List */}
      <main className="flex-1 p-4 space-y-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat + (config.tileLayout || 'big')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={config.tileLayout === 'small' ? "grid grid-cols-2 gap-4" : "space-y-4"}
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className={`bg-card-app backdrop-blur-sm rounded-3xl border border-app shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] ${
                  config.tileLayout === 'small' ? 'p-3' : 'p-5'
                } ${item.isSoldOut ? 'grayscale opacity-60' : ''}`}
              >
                <div className={config.tileLayout === 'small' ? "flex flex-col gap-2" : "flex gap-4"}>
                  {item.image && (
                    <div className="relative shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className={`${
                          config.tileLayout === 'small' ? 'w-full h-32' : 'w-24 h-24'
                        } rounded-2xl object-cover border border-app`}
                      />
                      {item.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                          <span className="text-white font-black text-[10px] uppercase tracking-tighter rotate-[-12deg] border-2 border-white px-2 py-1">
                            Ausverkauft
                          </span>
                        </div>
                      )}
                      {item.dietary && (
                        <div className="absolute top-1 left-1 flex flex-col gap-1">
                          {item.dietary.map(tag => (
                            <div key={tag} className="bg-app/80 backdrop-blur-sm p-1 rounded-lg border border-app shadow-sm">
                              {tag === 'vegan' && <Leaf size={12} className="text-green-500" />}
                              {tag === 'veggie' && <Leaf size={12} className="text-green-300" />}
                              {tag === 'glutenfree' && <Wheat size={12} className="text-yellow-500" />}
                              {tag === 'spicy' && <Flame size={12} className="text-red-500" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-0.5 block truncate">
                          {item.subCat}
                        </span>
                        <h3 className={`serif font-bold text-app leading-tight ${
                          config.tileLayout === 'small' ? 'text-base line-clamp-2' : 'text-xl'
                        }`}>
                          {config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name}
                        </h3>
                      </div>
                      <span className={`${config.tileLayout === 'small' ? 'text-sm' : 'text-lg'} font-bold text-primary shrink-0 ml-2`}>
                        {item.price.toFixed(2)}€
                      </span>
                    </div>
                    {config.tileLayout !== 'small' && (
                      <p className="opacity-60 text-xs mb-3 leading-relaxed line-clamp-2">
                        {config.language === 'en' && item.translations?.en ? item.translations.en.info : item.info}
                      </p>
                    )}
                    <div className="mt-auto pt-2">
                      <motion.button
                        whileTap={!item.isSoldOut ? { scale: 0.95 } : {}}
                        disabled={item.isSoldOut}
                        onClick={(e) => !item.isSoldOut && addToCart(item, e)}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all text-sm relative overflow-hidden ${
                          item.isSoldOut 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {item.isSoldOut ? <X size={14} /> : <Plus size={14} />}
                        {item.isSoldOut ? (config.language === 'en' ? 'Sold Out' : 'Ausverkauft') : (config.language === 'en' ? 'Order' : 'Bestön')}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Complaint */}
      <footer className="p-8 text-center space-y-4 opacity-60 hover:opacity-100 transition-opacity">
        <button 
          onClick={handleComplaint}
          className="flex items-center gap-2 mx-auto text-app hover:text-red-500 transition-colors text-sm font-medium"
        >
          <AlertCircle size={16} />
          Wos passt ned? (Beschwerde an Chef)
        </button>
        <p className="text-[10px] uppercase tracking-widest opacity-50">
          © {new Date().getFullYear()} Hawidere Engine
        </p>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-app rounded-t-[40px] z-50 shadow-2xl border-t border-app flex flex-col max-h-[85vh]"
            >
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="serif text-4xl font-bold text-app">{t.checkout}</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-card-app rounded-full transition-colors">
                    <X size={28} />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="bg-card-app w-20 h-20 rounded-full flex items-center justify-center mx-auto opacity-30">
                      <Coffee size={40} />
                    </div>
                    <p className="serif italic text-2xl opacity-40">"{t.empty}"</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="serif text-xl font-bold text-app">
                            {config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name}
                          </h4>
                          <p className="opacity-60">{(item.price! * item.qty!).toFixed(2)}€</p>
                        </div>
                        <div className="flex items-center gap-4 bg-card-app p-2 rounded-2xl border border-app">
                          <button onClick={() => removeFromCart(item.id!)} className="w-8 h-8 flex items-center justify-center bg-app rounded-xl shadow-sm hover:bg-primary hover:text-white transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => addToCart(item as MenuItem)} className="w-8 h-8 flex items-center justify-center bg-app rounded-xl shadow-sm hover:bg-primary hover:text-white transition-colors">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Perfect Match Upsell */}
                    {(() => {
                      const cartItemIds = cartItems.map(i => i.id);
                      const suggestedIds = cartItems.flatMap(i => i.pairings || []).filter(id => !cartItemIds.includes(id));
                      const uniqueSuggestedIds = Array.from(new Set(suggestedIds));
                      const suggestedItems = menuItems.filter(i => uniqueSuggestedIds.includes(i.id));

                      if (suggestedItems.length === 0) return null;

                      return (
                        <div className="pt-8 border-t border-app/20">
                          <h5 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                            <Utensils size={14} />
                            {t.pairings}
                          </h5>
                          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                            {suggestedItems.map(item => (
                              <motion.div 
                                key={item.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => addToCart(item, e)}
                                className="bg-primary/5 p-3 rounded-2xl border border-primary/20 min-w-[160px] flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                              >
                                {item.image && (
                                  <img src={item.image} className="w-full h-24 object-cover rounded-xl mb-2" />
                                )}
                                <p className="serif font-bold text-sm text-app line-clamp-1">
                                  {config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs font-bold text-primary">{item.price.toFixed(2)}€</span>
                                  <div className="bg-primary text-white p-1 rounded-lg">
                                    <Plus size={12} />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Upselling Section */}
                    {upsellItems.length > 0 && (
                      <div className="pt-8 border-t border-app/20">
                        <h5 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">
                          {t.upsell}
                        </h5>
                        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                          {upsellItems.map(item => (
                            <motion.div 
                              key={item.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => addToCart(item, e)}
                              className="bg-card-app p-3 rounded-2xl border border-app min-w-[140px] flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                            >
                              {item.image && (
                                <img src={item.image} className="w-full h-20 object-cover rounded-xl mb-2" />
                              )}
                              <p className="serif font-bold text-sm text-app line-clamp-1">
                                {config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-bold text-primary">{item.price.toFixed(2)}€</span>
                                <div className="bg-primary/10 p-1 rounded-lg">
                                  <Plus size={12} className="text-primary" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-8 bg-card-app border-t border-app space-y-6">
                  <div className="space-y-2">
                    {config.discount && (
                      <div className="flex justify-between text-red-500 font-bold italic">
                        <span>Rabatt (-{config.discount}%):</span>
                        <span>-{(cartItems.reduce((s, i) => s + i.price * i.qty, 0) * (config.discount / 100)).toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end">
                      <span className="serif text-2xl opacity-60 italic">{t.total}</span>
                      <span className="text-4xl font-bold text-app">{totalPrice.toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest text-center">{t.payment_method}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handlePayment('apple')}
                        disabled={isPaying}
                        className="flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <span className="text-lg"></span> Pay
                      </button>
                      <button 
                        onClick={() => handlePayment('google')}
                        disabled={isPaying}
                        className="flex items-center justify-center gap-2 py-4 bg-white text-black border border-gray-200 rounded-2xl font-bold shadow-lg hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-4" alt="Google" /> Pay
                      </button>
                    </div>
                    <button 
                      onClick={handleOrder}
                      disabled={isPaying}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {t.pay}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-app w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 shrink-0">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-black text-white drop-shadow-lg">
                    {config.language === 'at' ? selectedItem.name : selectedItem.translations?.en?.name}
                  </h2>
                </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-primary">{selectedItem.price.toFixed(2)}€</span>
                  <div className="flex gap-2">
                    {selectedItem.dietary?.map(tag => (
                      <div key={tag} className="bg-primary/10 p-2 rounded-xl border border-primary/20">
                        {tag === 'vegan' && <Leaf size={18} className="text-green-500" />}
                        {tag === 'veggie' && <Leaf size={18} className="text-green-300" />}
                        {tag === 'glutenfree' && <Wheat size={18} className="text-yellow-500" />}
                        {tag === 'spicy' && <Flame size={18} className="text-red-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-lg text-app opacity-80 leading-relaxed">
                  {config.language === 'at' ? selectedItem.info : selectedItem.translations?.en?.info}
                </p>

                {selectedItem.chefNote && (
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                      <Utensils size={16} />
                      {t.chef_note}
                    </div>
                    <p className="serif italic text-app opacity-90">
                      "{selectedItem.chefNote}"
                    </p>
                  </div>
                )}

                {selectedItem.allergens && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">{t.allergens}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergens.map(a => (
                        <span key={a} className="px-2 py-1 bg-card-app border border-app rounded-md text-[10px] font-bold text-app">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.pairings && selectedItem.pairings.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-app">
                    <p className="text-sm font-bold text-app">{t.pairings}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedItem.pairings.map(pairId => {
                        const pairItem = menuItems.find(i => i.id === pairId);
                        if (!pairItem) return null;
                        return (
                          <div 
                            key={pairId}
                            onClick={() => setSelectedItem(pairItem)}
                            className="flex items-center gap-4 p-3 bg-card-app rounded-2xl border border-app hover:border-primary transition-colors cursor-pointer"
                          >
                            <img src={pairItem.image} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="font-bold text-sm">
                                {config.language === 'at' ? pairItem.name : pairItem.translations?.en?.name}
                              </p>
                              <p className="text-xs text-primary font-bold">{pairItem.price.toFixed(2)}€</p>
                            </div>
                            <Plus size={16} className="text-primary" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 pt-0">
                <button 
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  {t.pay}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Drawer */}
      <AnimatePresence>
        {isAdminOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-app z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-app flex justify-between items-center bg-card-app">
                <h2 className="serif text-3xl font-bold text-app">Admin Panel</h2>
                <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-card-app rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex p-2 bg-card-app border-b border-app gap-2">
                <button 
                  onClick={() => setAdminTab('config')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    adminTab === 'config' ? 'bg-primary text-white shadow-md' : 'text-app opacity-50'
                  }`}
                >
                  Konfiguration
                </button>
                <button 
                  onClick={() => setAdminTab('orders')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative ${
                    adminTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-app opacity-50'
                  }`}
                >
                  {t.live_orders}
                  {liveOrders.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-app">
                      {liveOrders.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {adminTab === 'config' ? (
                  <>
                    {/* Branding */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <ImageIcon size={14} /> Branding & Theme
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">App Name</label>
                      <input 
                        type="text" 
                        value={config.name} 
                        onChange={e => setConfig({...config, name: e.target.value})}
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Logo URL</label>
                      <input 
                        type="text" 
                        value={config.logo || ''} 
                        onChange={e => setConfig({...config, logo: e.target.value})}
                        placeholder="https://..."
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Background Image URL</label>
                      <input 
                        type="text" 
                        value={config.bgImage || ''} 
                        onChange={e => setConfig({...config, bgImage: e.target.value})}
                        placeholder="https://..."
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Primary Color</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={config.primaryColor} 
                          onChange={e => setConfig({...config, primaryColor: e.target.value})}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <span className="text-sm font-mono opacity-60">{config.primaryColor}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Tile Layout</label>
                      <div className="flex p-1 bg-card-app border border-app rounded-xl gap-1">
                        <button 
                          onClick={() => setConfig({...config, tileLayout: 'big'})}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            (config.tileLayout || 'big') === 'big' ? 'bg-primary text-white shadow-sm' : 'text-app opacity-50'
                          }`}
                        >
                          <List size={14} /> Big Tiles
                        </button>
                        <button 
                          onClick={() => setConfig({...config, tileLayout: 'small'})}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            config.tileLayout === 'small' ? 'bg-primary text-white shadow-sm' : 'text-app opacity-50'
                          }`}
                        >
                          <LayoutGrid size={14} /> Small Tiles
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Promo */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <Tag size={14} /> Promo & Discount
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Promo Text</label>
                      <input 
                        type="text" 
                        value={config.promoText || ''} 
                        onChange={e => setConfig({...config, promoText: e.target.value})}
                        placeholder="e.g. Happy Hour!"
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Promo Banner Image URL</label>
                      <input 
                        type="text" 
                        value={config.promoBannerUrl || ''} 
                        onChange={e => setConfig({...config, promoBannerUrl: e.target.value})}
                        placeholder="https://..."
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Discount %</label>
                      <input 
                        type="number" 
                        value={config.discount || 0} 
                        onChange={e => setConfig({...config, discount: Number(e.target.value)})}
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                  </div>
                </section>

                {/* Contacts */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <Phone size={14} /> WhatsApp Routing
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Bar Number</label>
                      <input 
                        type="text" 
                        value={config.contacts.bar} 
                        onChange={e => setConfig({...config, contacts: {...config.contacts, bar: e.target.value}})}
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Kitchen Number</label>
                      <input 
                        type="text" 
                        value={config.contacts.kitchen} 
                        onChange={e => setConfig({...config, contacts: {...config.contacts, kitchen: e.target.value}})}
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70">Boss Number (Complaints)</label>
                      <input 
                        type="text" 
                        value={config.contacts.boss} 
                        onChange={e => setConfig({...config, contacts: {...config.contacts, boss: e.target.value}})}
                        className="w-full p-3 bg-card-app border border-app rounded-xl focus:border-primary outline-none text-app"
                      />
                    </div>
                  </div>
                </section>

                {/* Menu Management */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                      <Utensils size={14} /> Menu Items
                    </h3>
                    <button 
                      onClick={() => {
                        const newItem: MenuItem = {
                          id: Date.now(),
                          name: "Neiches Trümmerl",
                          price: 0,
                          cat: 'Essn',
                          subCat: 'Neich',
                          info: 'Wos is des?',
                        };
                        setMenuItems([...menuItems, newItem]);
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {menuItems.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-card-app rounded-2xl border border-app space-y-3 relative">
                        <button 
                          onClick={() => setMenuItems(menuItems.filter(i => i.id !== item.id))}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={e => {
                              const newMenu = [...menuItems];
                              newMenu[idx].name = e.target.value;
                              setMenuItems(newMenu);
                            }}
                            className="p-2 text-sm bg-app border border-app rounded-lg outline-none text-app"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={item.price} 
                              onChange={e => {
                                const newMenu = [...menuItems];
                                newMenu[idx].price = Number(e.target.value);
                                setMenuItems(newMenu);
                              }}
                              className="flex-1 p-2 text-sm bg-app border border-app rounded-lg outline-none text-app"
                            />
                            <button 
                              onClick={() => {
                                const newMenu = [...menuItems];
                                newMenu[idx].isSoldOut = !newMenu[idx].isSoldOut;
                                setMenuItems(newMenu);
                              }}
                              className={`p-2 rounded-lg border transition-colors ${
                                item.isSoldOut ? 'bg-red-500 text-white border-red-600' : 'bg-app text-app border-app opacity-40'
                              }`}
                              title="Toggle Sold Out"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={item.image || ''} 
                          placeholder="Image URL"
                          onChange={e => {
                            const newMenu = [...menuItems];
                            newMenu[idx].image = e.target.value;
                            setMenuItems(newMenu);
                          }}
                          className="w-full p-2 text-xs bg-app border border-app rounded-lg outline-none text-app"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="space-y-6">
                {liveOrders.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <Coffee size={48} className="mx-auto mb-4" />
                    <p className="serif italic text-xl">{t.no_orders}</p>
                  </div>
                ) : (
                  liveOrders.map(order => (
                    <div key={order.id} className="bg-card-app border border-app rounded-[2rem] p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Order #{order.id}</p>
                          <h4 className="text-xl font-black text-app">Tisch {order.table}</h4>
                        </div>
                        <span className="text-xs font-mono opacity-40">{order.time}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="opacity-80">{item.qty}x {item.name}</span>
                            <span className="font-bold">{(item.price * item.qty).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-app flex justify-between items-center">
                        <span className="text-lg font-black text-primary">{order.total.toFixed(2)}€</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setLiveOrders(liveOrders.filter(o => o.id !== order.id))}
                            className="p-2 bg-green-500 text-white rounded-xl shadow-md active:scale-90"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {liveFeedback.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-app">
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                      <MessageSquare size={14} /> Live Feedback
                    </h3>
                    <div className="space-y-3">
                      {liveFeedback.map(f => (
                        <div key={f.id} className="p-4 bg-card-app border border-app rounded-2xl flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{f.rating}</span>
                            <p className="text-sm italic opacity-80">"{f.comment}"</p>
                          </div>
                          <span className="text-[10px] opacity-40">{f.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

              <div className="p-6 bg-card-app border-t border-app">
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={20} />
                  Ois Speichern
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Call Waiter FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const msg = `Herr Ober! Tisch ${tableNumber || '?'}: Ich brauche Hilfe!`;
          window.open(`https://wa.me/${config.barContact}?text=${encodeURIComponent(msg)}`);
        }}
        className="fixed bottom-6 left-6 z-[70] bg-app border border-app text-app p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"
      >
        <BellRing size={24} className="text-primary" />
        <span className="hidden md:inline">{t.call_waiter}</span>
      </motion.button>

      {/* Quick Cart Bar */}
      {(totalItems as number) > 0 && !isCartOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto z-30"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                animate={cartIconControls}
                className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform"
              >
                <ShoppingCart size={24} />
              </motion.div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Warenkorb</p>
                <p className="font-bold">{totalItems} Trümmerl</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{totalPrice.toFixed(2)}€</p>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Flying Items Animation */}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ x: item.x - 20, y: item.y - 20, scale: 1, opacity: 1 }}
            animate={{ 
              x: window.innerWidth > 672 ? (window.innerWidth / 2) + 280 : window.innerWidth - 60, 
              y: 60, 
              scale: 0.2, 
              opacity: 0 
            }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="fixed z-[100] pointer-events-none"
          >
            {item.image ? (
              <img src={item.image} className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-lg" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Plus size={20} />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confirmation Toast */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={20} />
            <span>{t.passt.replace('{item}', showConfirmation)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Payment Sheet */}
      <AnimatePresence>
        {isPaymentSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => paymentProcessingStep === 'idle' && setIsPaymentSheetOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 max-w-2xl mx-auto rounded-t-[32px] z-[110] shadow-2xl overflow-hidden ${
                paymentSheetType === 'apple' ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'
              }`}
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {paymentSheetType === 'apple' ? (
                      <span className="text-2xl font-bold"> Pay</span>
                    ) : (
                      <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-5" alt="Google" />
                    )}
                  </div>
                  {paymentProcessingStep === 'idle' && (
                    <button onClick={() => setIsPaymentSheetOpen(false)} className="opacity-50">
                      <X size={24} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-y border-white/10">
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Händler</p>
                      <p className="text-lg font-bold">Hawidere! Digital Menu</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Betrag</p>
                      <p className="text-2xl font-black text-primary">{totalPrice.toFixed(2)}€</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-[10px] font-bold">
                      VISA
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">Sparkasse Card</p>
                      <p className="text-xs opacity-50">•••• 4242</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {paymentProcessingStep === 'idle' ? (
                    <button 
                      onClick={confirmPayment}
                      className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
                        paymentSheetType === 'apple' ? 'bg-white text-black' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {paymentSheetType === 'apple' ? (
                        <>
                          <Fingerprint size={24} />
                          Mit Face ID bestätigen
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={24} />
                          Kauf bestätigen
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                      />
                      <p className="font-bold animate-pulse">
                        {paymentProcessingStep === 'authenticating' ? 'Authentifizierung...' : 'Zahlung wird verarbeitet...'}
                      </p>
                    </div>
                  )}
                </div>
                
                <p className="text-[10px] text-center opacity-30 pb-4">
                  Sichere Transaktion über {paymentSheetType === 'apple' ? 'Apple' : 'Google'} Pay Framework
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLoyaltyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoyaltyOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-app rounded-[32px] z-[90] shadow-2xl p-8 border border-app"
            >
              <div className="text-center space-y-6">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Coffee size={40} className="text-primary" />
                </div>
                <div>
                  <h2 className="serif text-3xl font-bold text-app mb-2">{t.loyalty}</h2>
                  <p className="opacity-60 text-sm">
                    {stamps % 10 === 0 && stamps > 0 ? t.free : t.stamps.replace('{n}', String(10 - (stamps % 10)))}
                  </p>
                </div>
                
                <div className="grid grid-cols-5 gap-3 py-4">
                  {[...Array(10)].map((_, i) => {
                    const isStamped = i < (stamps % 10 || (stamps > 0 && stamps % 10 === 0 ? 10 : 0));
                    return (
                      <motion.div 
                        key={i}
                        initial={false}
                        animate={isStamped ? { scale: [1, 1.2, 1], rotate: [0, -10, 0] } : {}}
                        className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                          isStamped
                            ? 'bg-primary border-primary text-white shadow-lg' 
                            : 'border-app opacity-20'
                        }`}
                      >
                        {isStamped ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 10 }}
                          >
                            <CheckCircle2 size={14} />
                          </motion.div>
                        ) : null}
                      </motion.div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setIsLoyaltyOpen(false)}
                  className="w-full py-4 bg-card-app text-app rounded-2xl font-bold border border-app"
                >
                  Passt!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Success Overlay */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary z-[100] flex flex-col items-center justify-center text-white p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-white text-primary p-6 rounded-full mb-6"
            >
              <CheckCircle2 size={64} />
            </motion.div>
            <h2 className="serif text-5xl font-bold mb-4">{t.paid}</h2>
            
            {lastOrder && (
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Deine Bestellung</p>
                <div className="space-y-2">
                  {lastOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.qty}x {config.language === 'en' && item.translations?.en ? item.translations.en.name : item.name}</span>
                      <span className="font-bold">{(item.price * item.qty).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/20 flex justify-between font-bold text-lg">
                  <span>Gesamt</span>
                  <span>{lastOrder.total.toFixed(2)}€</span>
                </div>
              </div>
            )}

            {/* Order Status Stepper */}
            <div className="w-full max-w-sm mb-12 space-y-4">
              <div className="flex justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2 z-0" />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: orderStatus === 'pending' ? '0%' : orderStatus === 'preparing' ? '50%' : '100%' 
                  }}
                  className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2 z-0 transition-all duration-1000"
                />
                {['pending', 'preparing', 'ready'].map((s, i) => (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500 ${
                      (i === 0 || (i === 1 && orderStatus !== 'pending') || (i === 2 && orderStatus === 'ready'))
                        ? 'bg-white border-white' 
                        : 'bg-primary border-white/40'
                    }`} />
                  </div>
                ))}
              </div>
              <p className="text-xl font-bold italic">
                {t[`status_${orderStatus}` as keyof typeof t]}
              </p>
            </div>

            {!feedbackSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 space-y-6"
              >
                <h3 className="text-2xl font-bold">{t.feedback_title}</h3>
                <div className="flex justify-center gap-4">
                  {['🍺', '😍', '🥨'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setFeedback(prev => ({ rating: emoji, comment: prev?.comment || "" }))}
                      className={`text-4xl transition-all ${feedback?.rating === emoji ? 'scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,1)]' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <textarea 
                  placeholder={t.feedback_placeholder}
                  value={feedback?.comment || ""}
                  onChange={(e) => setFeedback(prev => ({ rating: prev?.rating || "😍", comment: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/40 h-24 resize-none"
                />
                <button 
                  onClick={() => {
                    const newFeedback = {
                      id: Math.random().toString(36).substr(2, 5),
                      rating: feedback?.rating || "😍",
                      comment: feedback?.comment || "Super!",
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setLiveFeedback(prev => [newFeedback, ...prev]);
                    setFeedbackSubmitted(true);
                  }}
                  className="w-full bg-white text-primary py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                  {t.send_feedback}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-2xl font-bold italic">"{t.feedback_thanks}"</p>
                <button 
                  onClick={() => {
                    setPaymentSuccess(false);
                    setFeedback(null);
                  }}
                  className="px-8 py-3 bg-white/20 border border-white/40 rounded-full font-bold hover:bg-white/30 transition-colors"
                >
                  {t.close}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
