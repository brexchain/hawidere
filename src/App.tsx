import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Sun
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
  const [waiterMessage, setWaiterMessage] = useState("Hawidere! Wos deaf's sein?");
  const [lastCommentedItem, setLastCommentedItem] = useState<number | null>(null);

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

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => item.cat === activeCat);
  }, [activeCat, menuItems]);

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

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    if (item.waiterComment && item.id !== lastCommentedItem) {
      setWaiterMessage(item.waiterComment);
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

  const handleOrder = () => {
    const foodItems = cartItems.filter(i => i.cat === 'Essn');
    const drinkItems = cartItems.filter(i => i.cat === 'Durscht');

    const formatMsg = (items: (MenuItem & { qty: number })[]) => {
      return items.map(i => `${i.qty}x ${i.name}`).join('\n');
    };

    if (foodItems.length > 0) {
      const msg = encodeURIComponent(`*NEUE BESTELLUNG (KÜCHE)*\n\n${formatMsg(foodItems)}`);
      window.open(`https://wa.me/${config.contacts.kitchen}?text=${msg}`, '_blank');
    }

    if (drinkItems.length > 0) {
      const msg = encodeURIComponent(`*NEUE BESTELLUNG (BAR)*\n\n${formatMsg(drinkItems)}`);
      window.open(`https://wa.me/${config.contacts.bar}?text=${msg}`, '_blank');
    }

    setCart({});
    setIsCartOpen(false);
    setWaiterMessage("Kummt scho! Is scho in Arbeit.");
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
              onClick={() => setIsNightMode(!isNightMode)}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm"
            >
              {isNightMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="p-3 bg-card-app text-app rounded-full hover:opacity-80 transition-opacity shadow-sm"
            >
              <Settings size={24} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity shadow-sm"
            >
              <ShoppingCart size={24} />
              {(totalItems as number) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-app">
                  {totalItems}
                </span>
              )}
            </button>
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
          Essn
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
          Durscht
        </button>
      </div>

      {/* Menu List */}
      <main className="flex-1 p-4 space-y-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-card-app backdrop-blur-sm p-5 rounded-3xl border border-app shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
              >
                <div className="flex gap-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-app"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-0.5 block">
                          {item.subCat}
                        </span>
                        <h3 className="serif text-xl font-bold text-app leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {item.price.toFixed(2)}€
                      </span>
                    </div>
                    <p className="opacity-60 text-xs mb-3 leading-relaxed line-clamp-2">
                      {item.info}
                    </p>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95 text-sm"
                    >
                      <Plus size={14} />
                      Bestön
                    </button>
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
                  <h2 className="serif text-4xl font-bold text-app">Zoin bitte!</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-card-app rounded-full transition-colors">
                    <X size={28} />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="bg-card-app w-20 h-20 rounded-full flex items-center justify-center mx-auto opacity-30">
                      <Coffee size={40} />
                    </div>
                    <p className="serif italic text-2xl opacity-40">"Noch is nix im Körbal."</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="serif text-xl font-bold text-app">{item.name}</h4>
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
                      <span className="serif text-2xl opacity-60 italic">Insgesamt:</span>
                      <span className="text-4xl font-bold text-app">{totalPrice.toFixed(2)}€</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleOrder}
                    className="w-full py-6 bg-primary text-white rounded-3xl font-bold text-xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Glei kummt's!
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
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

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
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
                          <input 
                            type="number" 
                            value={item.price} 
                            onChange={e => {
                              const newMenu = [...menuItems];
                              newMenu[idx].price = Number(e.target.value);
                              setMenuItems(newMenu);
                            }}
                            className="p-2 text-sm bg-app border border-app rounded-lg outline-none text-app"
                          />
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

      {/* Quick Cart Bar */}
      {(totalItems as number) > 0 && !isCartOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto z-30"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingCart size={24} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Warenkorb</p>
                <p className="font-bold">{totalItems} Trümmerl</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{totalPrice.toFixed(2)}€</p>
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
