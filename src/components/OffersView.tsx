import React from 'react';
import { Tag, Sparkles, ArrowRight, Percent, Check, Gift } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { formatPrice } from '../lib/format';

export const OffersView: React.FC<{
  onSelectProduct: (product: Product) => void;
  onNavigateMenu: () => void;
}> = ({ onSelectProduct, onNavigateMenu }) => {
  const { products, addToCart, setSelectedCategory, settings } = useRestaurant();
  const dealProducts = products.filter(
    (p) => p.categoryId === 'cat-deals' || p.badge === 'HOT DEAL' || p.badge === 'BEST VALUE'
  );

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      onSelectProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  const offerBanners = settings.offerBanners?.filter((b) => b.isActive) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 text-gray-900">
      {/* Offers Hero Header */}
      <div className="rounded-3xl bg-[#005A36] p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-[#E31837]" />
            Exclusive Deals & Feasts
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            Special Value Combos & Discounts
          </h1>

          <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
            Smashed burgers, crispy zinger fillets, BBQ wings, loaded fries, and refreshing drinks bundled together at unbeatable prices in Ghauri Town, Islamabad.
          </p>
        </div>
      </div>

      {/* Dynamic Offer Banners from Admin */}
      {offerBanners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {offerBanners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-3xl p-6 relative overflow-hidden border border-gray-150 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ backgroundColor: banner.backgroundColor || '#EAF4EC' }}
            >
              <div className="space-y-2 text-center sm:text-left">
                {banner.badge && (
                  <span className="bg-white text-[#005A36] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    {banner.badge}
                  </span>
                )}
                <h3 className="font-black text-2xl text-gray-900 uppercase leading-tight">
                  {banner.title}
                </h3>
                <p className="text-xs text-gray-600 max-w-xs">{banner.subtitle}</p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('cat-deals');
                      onNavigateMenu();
                    }}
                    className="px-5 py-2 rounded-full bg-[#E31837] hover:bg-[#C9142B] text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
                  >
                    {banner.buttonText || 'Order Deal'}
                  </button>
                </div>
              </div>

              {/* Banner Image with Discount Tag */}
              <div className="relative shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-32 h-32 sm:w-40 sm:h-32 object-cover rounded-2xl shadow-md border-2 border-white"
                />
                {banner.discountTag && (
                  <div className="absolute -top-2 -right-2 bg-[#E31837] text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md border-2 border-white">
                    {banner.discountTag}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deals list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            All Value Deals & Platter Combos
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            {dealProducts.length} Deals Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
