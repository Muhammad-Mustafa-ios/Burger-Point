import React, { useState } from 'react';
import { Search, Flame, X, SlidersHorizontal } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { ProductCard } from './ProductCard';
import { CategoryIcon } from './CategoryIcon';
import { Product } from '../types';

interface MenuViewProps {
  onSelectProduct: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onSelectProduct }) => {
  const {
    settings,
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart
  } = useRestaurant();

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      onSelectProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  // Filter products by category and search query
  const filteredProducts = products.filter((prod) => {
    const categoryMatch =
      selectedCategory === 'all' || prod.categoryId === selectedCategory;

    const queryMatch =
      !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && queryMatch;
  });

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 text-gray-900 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Header Title and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8590C]">
              Freshly Prepared to Order
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#18191D] tracking-tight leading-none mt-1">
              {settings.name.toUpperCase()} MENU
            </h1>
          </div>

          {/* Quick Search inside Menu */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E8590C] shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Circular Categories Strip */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {/* "All" button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col items-center justify-center min-w-[70px] group transition-all`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#18191D] text-[#F26722] shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-[#E8590C]'
              }`}
            >
              <span className="font-display text-base font-black">ALL</span>
            </div>
            <span className="text-xs font-bold text-gray-900 mt-2 text-center">
              All Items
            </span>
          </button>

          {/* Category circles */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center justify-center min-w-[70px] group transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#18191D] text-[#F26722] shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-[#E8590C]'
                  }`}
                >
                  <CategoryIcon
                    name={cat.name}
                    className={`w-6 h-6 ${isSelected ? 'text-[#F26722]' : 'text-gray-700'}`}
                  />
                </div>
                <span className="text-xs font-bold text-gray-900 mt-2 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <Flame className="w-12 h-12 mx-auto text-[#E8590C] mb-3 opacity-60" />
            <h3 className="text-base font-bold text-gray-900">No dishes match your search</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              Try adjusting your search terms or picking another food category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-full bg-[#E8590C] text-white text-xs font-bold hover:bg-[#F26722] transition shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
