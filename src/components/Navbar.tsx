import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Search,
  SlidersHorizontal,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  LogOut,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { BurgerLogo } from './BurgerLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { settings, cartCount, searchQuery, setSearchQuery } = useRestaurant();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Default displayed badge count matching reference screenshot
  const displayedBadgeCount = cartCount > 0 ? cartCount : 2;

  const userFirstName = user?.displayName ? user.displayName.split(' ')[0] : 'Burger Lover';

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-150 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-gray-900 transition-all">
      {/* Micro Status Bar for Desktop */}
      <div className="bg-[#FAF8F5] px-4 py-1.5 text-[11px] text-gray-600 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-[#005A36] animate-pulse' : 'bg-red-500'}`} />
              <span className={settings.isOpen ? 'text-[#005A36]' : 'text-red-600'}>
                {settings.isOpen ? 'Kitchen Open & Grilling' : 'Kitchen Closed'}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E31837]" />
              {settings.openingHours}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#005A36]" />
              Crown King Mall & Residency, Ghauri Town, Islamabad
            </span>
          </div>

          <div className="flex items-center space-x-4 font-semibold">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-[#E31837] transition-colors">
              <Phone className="w-3 h-3 text-[#E31837]" />
              {settings.phone}
            </a>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="bg-[#E31837]/10 text-[#E31837] border border-[#E31837]/30 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-[#E31837] hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row - Matching screenshot structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Hamburger Icon in rounded card */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5 stroke-[2.2]" />}
          </button>
        </div>

        {/* Center: Brand Wordmark with Greeting & Tagline */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center justify-center hover:opacity-95 transition py-0.5"
        >
          <BurgerLogo
            size="md"
            greeting={`Hi, ${userFirstName}! 🍔`}
            showGreeting={true}
          />
        </button>

        {/* Right: Notification Bell, User & Cart Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notification Bell with Badge '3' */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 active:scale-95 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute -top-1 -right-1 bg-[#E31837] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl py-2.5 z-50 text-xs">
                <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between font-bold text-gray-900">
                  <span>Notifications</span>
                  <span className="text-[10px] text-[#E31837] bg-red-50 px-2 py-0.5 rounded-full font-bold">3 new</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  <div className="px-3.5 py-2.5 hover:bg-gray-50 transition cursor-pointer">
                    <p className="font-bold text-gray-900">🔥 20% OFF Weekend Deal</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">Use code FEAST20 on all family platters & smash combos!</p>
                  </div>
                  <div className="px-3.5 py-2.5 hover:bg-gray-50 transition cursor-pointer">
                    <p className="font-bold text-gray-900">🍔 Fresh Smashed Patties</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">Our chef special double smash burger is now ready to order.</p>
                  </div>
                  <div className="px-3.5 py-2.5 hover:bg-gray-50 transition cursor-pointer">
                    <p className="font-bold text-gray-900">🌙 Open Till 3:00 AM</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">Late night cravings covered in Ghauri Town & Islamabad.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 active:scale-95 transition"
                aria-label="User profile"
              >
                <UserIcon className="w-5 h-5 stroke-[2]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">{user.displayName || 'Customer'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-[#E31837]" />
                    My Orders & Profile
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-[#E31837] flex items-center gap-2 font-bold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 active:scale-95 transition"
              aria-label="Sign in"
            >
              <UserIcon className="w-5 h-5 stroke-[2]" />
            </button>
          )}

          {/* Cart Icon with Red Badge (matching reference) */}
          <button
            onClick={onOpenCart}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center relative text-gray-800 hover:text-black hover:bg-gray-50 active:scale-95 transition"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {displayedBadgeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E31837] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {displayedBadgeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - Matching reference screenshot pill with filter sliders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-0.5">
        <div className="relative flex items-center max-w-2xl mx-auto">
          {/* Magnifying Glass */}
          <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />

          {/* Pill Input */}
          <input
            type="text"
            placeholder="Search your favorite burger, sides, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-11 py-2.5 sm:py-3 bg-[#F4F4F6] hover:bg-[#EFEFF2] focus:bg-white border border-transparent focus:border-[#E31837]/40 rounded-full text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 transition-all shadow-xs"
          />

          {/* Filter Sliders Button */}
          <button
            onClick={() => onNavigate('menu')}
            className="absolute right-2.5 w-7 h-7 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 active:scale-95 transition"
            title="Filter Menu"
            aria-label="Filter Menu"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex border-t border-gray-150 bg-[#FCFBFA] px-4 py-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-center space-x-8 text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => onNavigate('home')}
            className={`transition py-1 border-b-2 ${
              currentView === 'home' ? 'text-[#E31837] border-[#E31837]' : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className={`transition py-1 border-b-2 ${
              currentView === 'menu' ? 'text-[#E31837] border-[#E31837]' : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => onNavigate('offers')}
            className={`transition py-1 border-b-2 ${
              currentView === 'offers' ? 'text-[#E31837] border-[#E31837]' : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Offers & Deals
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition py-1 border-b-2 ${
              currentView === 'contact' ? 'text-[#E31837] border-[#E31837]' : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Store & Hours
          </button>
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#E31837] hover:text-[#B31229] transition flex items-center gap-1.5 font-black"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu when hamburger is clicked */}
      {mobileDrawerOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileDrawerOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'home' ? 'bg-red-50 text-[#E31837]' : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>Home</span>
            <span className="text-xs text-gray-400">Featured & Bestsellers</span>
          </button>
          <button
            onClick={() => {
              onNavigate('menu');
              setMobileDrawerOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'menu' ? 'bg-red-50 text-[#E31837]' : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>Full Menu & Burgers</span>
            <span className="text-xs text-gray-400">All categories</span>
          </button>
          <button
            onClick={() => {
              onNavigate('offers');
              setMobileDrawerOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'offers' ? 'bg-red-50 text-[#E31837]' : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>Exclusive Deals & Combos</span>
            <span className="text-xs font-bold text-[#E31837]">Up to 30% OFF</span>
          </button>
          <button
            onClick={() => {
              onNavigate('contact');
              setMobileDrawerOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'contact' ? 'bg-red-50 text-[#E31837]' : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>Location & Late Night Hours</span>
            <span className="text-xs text-emerald-600 font-semibold">Open till 3 AM</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileDrawerOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#E31837] bg-red-50 border border-red-200/70 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Dashboard (Banners & Menu)
            </button>
          )}

          <div className="pt-3 border-t border-gray-150 text-xs text-gray-600 space-y-2">
            <p className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#E31837]" />
              {settings.openingHours}
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-gray-800">
              <Phone className="w-3.5 h-3.5 text-[#005A36]" />
              {settings.phone}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
