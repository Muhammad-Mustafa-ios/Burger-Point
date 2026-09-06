import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { ProductCard } from './ProductCard';
import { Product, HeroBanner, OfferBanner } from '../types';
import { GOOGLE_REVIEWS } from '../data/initialData';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateMenu: () => void;
  onOrderNow: () => void;
}

const CATEGORY_THUMBNAILS: Record<string, string> = {
  'all': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  'cat-burgers': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80',
  'cat-starters': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=300&q=80',
  'cat-sandwiches': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80',
  'cat-platters': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
  'cat-deals': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=300&q=80',
  'cat-beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
};

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigateMenu,
  onOrderNow
}) => {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    settings
  } = useRestaurant();

  // Active Hero Banner Carousel Index
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Get active hero banners from settings or fallback to default
  const heroBanners: HeroBanner[] = (settings.heroBanners && settings.heroBanners.length > 0)
    ? settings.heroBanners.filter(b => b.isActive)
    : [
        {
          id: 'hero-1',
          badge: 'LIMITED TIME OFFER',
          title: 'BETTER BURGERS.\nBETTER TASTE.',
          subtitle: 'Made with fresh dough, 100% prime beef, real cheese & quality toppings.',
          buttonText: 'Order Now',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
          backgroundColor: '#073B24',
          textColor: '#FFFFFF',
          isActive: true
        }
      ];

  // Get active offer banners from settings or fallback
  const offerBanners: OfferBanner[] = (settings.offerBanners && settings.offerBanners.length > 0)
    ? settings.offerBanners.filter(b => b.isActive)
    : [
        {
          id: 'offer-1',
          badge: 'EXCLUSIVE DEAL',
          title: 'UP TO 30% OFF',
          subtitle: 'On Selected Combos & Platters',
          buttonText: 'Order Now',
          discountTag: '30% OFF',
          imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
          backgroundColor: '#EAF4EC',
          isActive: true
        }
      ];

  // Auto cycle hero banner carousel
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const currentHero = heroBanners[activeHeroIndex] || heroBanners[0];
  const currentOffer = offerBanners[0];

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      onSelectProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  // Popular burgers / picks matching screenshot
  const popularBurgers = products
    .filter(p => p.categoryId === 'cat-burgers' || p.isPopular || p.badge)
    .slice(0, 6);

  const displayedPicks = popularBurgers.length > 0 ? popularBurgers : products.slice(0, 6);

  return (
    <div className="w-full bg-[#F8F9FA] pb-24 md:pb-16 text-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-6 sm:space-y-8">

        {/* 1. HERO BANNER CAROUSEL - EXACT TO REFERENCE PHOTO */}
        <div className="relative">
          <div
            className="w-full rounded-3xl sm:rounded-[32px] overflow-hidden text-white transition-all duration-700 shadow-xl relative min-h-[260px] sm:min-h-[300px] flex items-center"
            style={{ backgroundColor: currentHero.backgroundColor || '#073B24' }}
          >
            {/* Background Texture/Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

            <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="space-y-3 sm:space-y-4 text-center md:text-left max-w-lg">
                {/* Red badge pill matching reference */}
                <div className="inline-block">
                  <span className="bg-[#E31837] text-white text-[10px] sm:text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                    {currentHero.badge || 'LIMITED TIME OFFER'}
                  </span>
                </div>

                {/* Bold headline with whitespace pre-line */}
                <h1
                  className="font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-[1.05] whitespace-pre-line drop-shadow-xs"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 950 }}
                >
                  {currentHero.title || 'BETTER BURGERS.\nBETTER TASTE.'}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed max-w-md">
                  {currentHero.subtitle || 'Made with fresh dough, 100% prime beef, real cheese & quality toppings.'}
                </p>

                {/* Order Now Pill Button (Red with white arrow) */}
                <div className="pt-1 flex items-center justify-center md:justify-start">
                  <button
                    onClick={onOrderNow}
                    className="group px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#E31837] hover:bg-[#C9142B] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
                  >
                    <span>{currentHero.buttonText || 'Order Now'}</span>
                    <span className="w-6 h-6 rounded-full bg-white text-[#E31837] flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Side Burger Picture on Platter */}
              <div className="relative flex items-center justify-center">
                <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full p-2 overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xs group hover:scale-105 transition-transform duration-500">
                  <img
                    src={currentHero.imageUrl}
                    alt={currentHero.title}
                    className="w-full h-full object-cover rounded-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>
            </div>

            {/* Pagination Indicator Dots at bottom center */}
            {heroBanners.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`transition-all duration-300 ${
                      activeHeroIndex === idx
                        ? 'w-6 h-1.5 rounded-full bg-white shadow'
                        : 'w-2 h-1.5 rounded-full bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. CATEGORY ROW - Circular Photos & Badges matching screenshot */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Categories
            </h2>
            <button
              onClick={onNavigateMenu}
              className="text-xs sm:text-sm font-bold text-[#E31837] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
            {/* 1st Item: "All" with Brand Icon Ring */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                onNavigateMenu();
              }}
              className="flex flex-col items-center justify-center flex-shrink-0 group transition-all"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                  selectedCategory === 'all'
                    ? 'ring-2 ring-[#E31837] bg-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="w-full h-full rounded-full bg-[#FAF5F5] flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[10px] font-black text-[#E31837] leading-none">BURGER</span>
                  <span className="text-[8px] font-bold text-[#005A36] leading-none">JOINTS</span>
                </div>
              </div>
              <span
                className={`text-xs mt-2 text-center whitespace-nowrap transition ${
                  selectedCategory === 'all' ? 'font-bold text-[#E31837]' : 'font-semibold text-gray-700'
                }`}
              >
                All
              </span>
            </button>

            {/* Subsequent Category Items with Circular Food Photos */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const imgUrl = CATEGORY_THUMBNAILS[cat.id] || CATEGORY_THUMBNAILS['cat-burgers'];

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    onNavigateMenu();
                  }}
                  className="flex flex-col items-center justify-center flex-shrink-0 group transition-all"
                >
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 overflow-hidden transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                      isSelected
                        ? 'ring-2 ring-[#E31837] bg-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <span
                    className={`text-xs mt-2 text-center whitespace-nowrap transition ${
                      isSelected ? 'font-bold text-[#E31837]' : 'font-semibold text-gray-700'
                    }`}
                  >
                    {cat.name.replace(' & Wings', '').replace(' & Combos', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. POPULAR BURGERS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Popular Burgers
            </h2>
            <button
              onClick={onNavigateMenu}
              className="text-xs sm:text-sm font-bold text-[#E31837] hover:text-[#B31229] flex items-center gap-1 transition group"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Product Cards Grid matching reference cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedPicks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </div>

        {/* 4. EXCLUSIVE DEAL BANNER (Matching bottom offer banner in screenshot) */}
        {currentOffer && (
          <div
            className="relative rounded-3xl sm:rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-md border border-emerald-900/10"
            style={{ backgroundColor: currentOffer.backgroundColor || '#EAF4EC' }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Content */}
              <div className="space-y-3 text-center md:text-left">
                <span className="bg-white/80 text-[#005A36] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-2xs border border-[#005A36]/20">
                  {currentOffer.badge || 'EXCLUSIVE DEAL'}
                </span>

                <div>
                  <h3
                    className="font-black text-3xl sm:text-4xl text-gray-900 tracking-tight leading-none uppercase"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 950 }}
                  >
                    {currentOffer.title || 'UP TO 30% OFF'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1.5">
                    {currentOffer.subtitle || 'On Selected Combos & Platters'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center md:justify-start">
                  <button
                    onClick={() => {
                      setSelectedCategory('cat-deals');
                      onNavigateMenu();
                    }}
                    className="group px-6 py-2.5 rounded-full bg-[#E31837] hover:bg-[#C9142B] text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                  >
                    <span>{currentOffer.buttonText || 'Order Now'}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#E31837] flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-xs">
                      <ArrowRight className="w-3 h-3 stroke-[2.8]" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Center Combo Picture & Right Circular Discount Badge */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative">
                  <img
                    src={currentOffer.imageUrl}
                    alt={currentOffer.title}
                    className="w-44 sm:w-56 h-28 sm:h-36 object-cover rounded-2xl shadow-lg border-2 border-white"
                  />
                </div>

                {/* Big Red 30% OFF Circle Badge matching reference */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E31837] text-white flex flex-col items-center justify-center font-black shadow-lg shrink-0 text-center border-4 border-white">
                  <span className="text-xs sm:text-sm uppercase font-black leading-none">
                    {currentOffer.discountTag || '30% OFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. GOOGLE MAPS VERIFIED REVIEWS & STORE INFO */}
        <div className="pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Google Verified Customer Reviews</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 5.0 Rating
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Ghauri Town Phase 5-B, Crown King Mall & Residency, Islamabad
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-gray-800 ml-1">5.0 (4 Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GOOGLE_REVIEWS.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-150 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-[#E31837] font-bold flex items-center justify-center text-xs">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{review.author}</p>
                        <p className="text-[10px] text-gray-400">{review.relativeTime}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Google Maps Review</span>
                  <span className="text-emerald-700 font-bold">Verified Diner</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

