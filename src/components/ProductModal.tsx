import React, { useState } from 'react';
import { X, Star, Plus, Minus, Check, Flame } from 'lucide-react';
import { Product } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../lib/format';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  // Initialize defaults for options if not already chosen
  const handleSelectOption = (optionName: string, choiceLabel: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: choiceLabel }));
  };

  // Calculate customized unit price
  let extraCost = 0;
  if (product.options) {
    product.options.forEach((opt) => {
      const selected = selectedOptions[opt.name];
      if (selected) {
        const choice = opt.choices.find((c) => c.label === selected);
        if (choice) extraCost += choice.price;
      }
    });
  }

  const unitPrice = product.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, specialNotes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#161920] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-orange-400 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-60 w-full overflow-hidden bg-black">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161920] via-transparent to-black/30" />
          {product.badge && (
            <span className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-wide">
                {product.name}
              </h2>
              <span className="text-xl font-black text-orange-400">
                {formatPrice(unitPrice)}
              </span>
            </div>

            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {product.rating.toFixed(1)} ({product.reviewCount} customer reviews)
              </span>
              {product.calories && <span>• {product.calories}</span>}
            </div>
          </div>

          {/* Customization Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Customize Your Order
              </h4>

              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-300">
                    <span>{opt.name}</span>
                    <span className="text-gray-500">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map((choice) => {
                      const isPicked =
                        selectedOptions[opt.name] === choice.label ||
                        (!selectedOptions[opt.name] && choice.price === 0);

                      return (
                        <button
                          key={choice.label}
                          type="button"
                          onClick={() => handleSelectOption(opt.name, choice.label)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                            isPicked
                              ? 'border-orange-500 bg-orange-500/10 text-white'
                              : 'border-white/10 bg-[#1b1f28] text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <span>{choice.label}</span>
                          <span className="font-bold text-orange-400">
                            {choice.price > 0 ? `+${formatPrice(choice.price)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Special Kitchen Notes / Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. No pickles, extra sauce, well done..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1b1f28] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Quantity & Add to Cart footer */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-4">
            <div className="flex items-center bg-[#1b1f28] border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-600/30'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order!
                </>
              ) : (
                <>
                  <span>Add to Order</span>
                  <span>•</span>
                  <span>{formatPrice(totalPrice)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
