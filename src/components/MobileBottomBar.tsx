import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Percent, User } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface MobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate,
  onOpenCart
}) => {
  const { cartCount } = useRestaurant();
  const displayedBadge = cartCount > 0 ? cartCount : null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-150 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition ${
          currentView === 'home' ? 'text-[#E31837]' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-1 ${currentView === 'home' ? 'font-bold' : 'font-medium text-gray-500'}`}>
          Home
        </span>
      </button>

      {/* 2. Menu */}
      <button
        onClick={() => onNavigate('menu')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition ${
          currentView === 'menu' ? 'text-[#E31837]' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <LayoutGrid className={`w-5 h-5 ${currentView === 'menu' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-1 ${currentView === 'menu' ? 'font-bold' : 'font-medium text-gray-500'}`}>
          Menu
        </span>
      </button>

      {/* 3. Central Elevated Order / Cart Button (Red rounded container) */}
      <div className="flex flex-col items-center justify-center -mt-6">
        <button
          onClick={onOpenCart}
          className="w-13 h-13 rounded-2xl bg-[#E31837] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(227,24,55,0.4)] border-4 border-white hover:scale-105 active:scale-95 transition relative"
          aria-label="Order Cart"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {displayedBadge !== null && (
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {displayedBadge}
            </span>
          )}
        </button>
        <span className="text-[10px] font-bold text-gray-900 mt-1">
          Order
        </span>
      </div>

      {/* 4. Offers */}
      <button
        onClick={() => onNavigate('offers')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition ${
          currentView === 'offers' ? 'text-[#E31837]' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <Percent className={`w-5 h-5 ${currentView === 'offers' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-1 ${currentView === 'offers' ? 'font-bold' : 'font-medium text-gray-500'}`}>
          Offers
        </span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition ${
          currentView === 'profile' ? 'text-[#E31837]' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <User className={`w-5 h-5 ${currentView === 'profile' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
        <span className={`text-[10px] mt-1 ${currentView === 'profile' ? 'font-bold' : 'font-medium text-gray-500'}`}>
          Profile
        </span>
      </button>
    </div>
  );
};

