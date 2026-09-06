import React from 'react';
import { Clock, Phone, MapPin, Heart } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { BurgerLogo } from './BurgerLogo';

export const Footer: React.FC<{
  onNavigate: (view: string) => void;
}> = ({ onNavigate }) => {
  const { settings, categories, setSelectedCategory } = useRestaurant();

  return (
    <footer className="bg-[#0a0a0d] border-t border-white/10 text-white pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <BurgerLogo size="md" />
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings.tagline} Handcrafted Angus patties, golden fries, and ice-cold drinks delivered fresh.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{settings.isOpen ? 'Accepting Orders Now' : 'Store Currently Closed'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition"
                >
                  Full Menu & Prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-white transition"
                >
                  Special Deals & Combos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition"
                >
                  Pickup Location & Hours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-orange-400 transition"
                >
                  Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Menu Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Food Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      onNavigate('menu');
                    }}
                    className="hover:text-white transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3 text-xs text-gray-400">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Store Information
            </h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <a href={`tel:${settings.phone}`} className="text-white hover:underline">
                {settings.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{settings.openingHours}</span>
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for local fast-food excellence with Firebase Firestore & Auth
          </p>
        </div>
      </div>
    </footer>
  );
};
