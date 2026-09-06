import React, { useState } from 'react';
import { Star, Plus, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/format';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Format review count matching reference style (12.5k+, 1.2k+, 850+)
  const formattedReviewCount = () => {
    if (!product.reviewCount) return '1.2k+';
    if (product.reviewCount >= 1000) {
      return `${(product.reviewCount / 1000).toFixed(1)}k+`;
    }
    return `${product.reviewCount}+`;
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-3xl border border-gray-150/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col justify-between p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top Controls Row: Badge & Heart Favorite */}
      <div className="flex items-center justify-between z-10 w-full mb-1">
        {product.badge ? (
          <span
            className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs ${
              product.badge === 'BESTSELLER'
                ? 'bg-[#E31837] text-white'
                : product.badge === "CHEF'S PICK"
                ? 'bg-[#005A36] text-white'
                : product.badge === 'POPULAR'
                ? 'bg-[#E31837] text-white'
                : 'bg-gray-800 text-white'
            }`}
          >
            {product.badge}
          </span>
        ) : (
          <span className="w-2" />
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-[#E31837] transition active:scale-90"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorite ? 'fill-[#E31837] text-[#E31837]' : 'stroke-[1.8]'
            }`}
          />
        </button>
      </div>

      {/* Circular Delicious Food Plate in Center (Matching Reference Photo) */}
      <div className="relative py-2 flex items-center justify-center">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[#FBF7F0] p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-500">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>

        {/* Sold out overlay if unavailable */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#E31837] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="w-3.5 h-3.5 fill-[#FFA500] text-[#FFA500]" />
            <span className="text-xs font-bold text-gray-900">
              {product.rating ? product.rating.toFixed(1) : '4.9'}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              ({formattedReviewCount()})
            </span>
          </div>
        </div>

        {/* Price & Red Plus Add Button */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            {formatPrice(product.price)}
          </span>

          <button
            disabled={!product.isAvailable}
            onClick={(e) => onQuickAdd(product, e)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm active:scale-90 ${
              product.isAvailable
                ? 'bg-[#E31837] hover:bg-[#C9142B] text-white hover:scale-110 shadow-red-500/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Add to order"
            aria-label={`Add ${product.name} to order`}
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
          </button>
        </div>
      </div>
    </div>
  );
};
