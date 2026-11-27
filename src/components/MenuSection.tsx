import React, { useState } from 'react';
import { ChevronRight, Check, ShoppingBag } from 'lucide-react';
import { MENU_CATEGORIES, ALL_MENU_ITEMS } from '../data/menu';
import { useCart } from '../context/CartContext';
import type { MenuCategory } from '../types/menu';

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory['id']>('pasta');
  const { addToCart, items } = useCart();

  const activeCategoryData = MENU_CATEGORIES.find((cat) => cat.id === selectedCategory)!;
  const currentItems = ALL_MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const isItemInCart = (id: string) => items.some((item) => item.dish.id === id);

  return (
    <section
      id="menu"
      className="bg-monaco-ivory py-20 lg:py-28 text-monaco-darkText relative overflow-hidden scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="flex items-center space-x-4 mb-10 lg:mb-14">
          <h2 className="font-serif tracking-[0.2em] text-sm sm:text-base uppercase text-monaco-forest font-bold">
            OUR MENU
          </h2>
          <div className="flex-1 h-[1px] bg-monaco-gold/40 max-w-xs" />
        </div>

        {/* Main Menu Layout: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Vertical Category Pill Selector */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3.5">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 gap-3 no-scrollbar">
              {MENU_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between w-full min-w-[190px] lg:min-w-0 px-4 py-3 rounded-full transition-all duration-300 text-left group shadow-sm focus:outline-none ${
                      isSelected
                        ? 'bg-monaco-cream text-monaco-forest border-2 border-monaco-gold shadow-md'
                        : 'bg-monaco-deep text-monaco-cream/90 hover:bg-monaco-forest border border-monaco-gold/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Thumbnail circle */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-monaco-gold/50 flex-shrink-0">
                        <img
                          src={cat.thumbnail}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="font-serif font-semibold text-base tracking-wide">
                        {cat.name}
                      </span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isSelected ? 'text-monaco-forest' : 'text-monaco-gold/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Category Heading & Product Cards */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Category Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-monaco-forest tracking-tight">
                {activeCategoryData.name}
              </h3>
              <p className="text-sm sm:text-base text-monaco-terracotta font-serif italic">
                {activeCategoryData.subtitle}
              </p>
            </div>

            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-4">
              {currentItems.map((dish) => {
                const inCart = isItemInCart(dish.id);

                return (
                  <div
                    key={dish.id}
                    className="bg-monaco-cardBg border border-monaco-gold/40 hover:border-monaco-gold rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-luxury group"
                  >
                    <div>
                      {/* Food Image with Floating Badge */}
                      <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-4">
                        <div className="w-full h-full rounded-full p-1 border border-monaco-gold/50 bg-monaco-ivory shadow-sm overflow-hidden">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        {dish.badge && (
                          <span className="absolute -top-1 -right-1 bg-monaco-gold text-monaco-deep text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md z-10 border border-monaco-deep/10 whitespace-nowrap">
                            {dish.badge}
                          </span>
                        )}
                      </div>

                      {/* Dish Details */}
                      <div className="text-center space-y-1.5">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-monaco-forest group-hover:text-monaco-terracotta transition-colors leading-snug">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-monaco-mutedText line-clamp-2 px-1">
                          {dish.description}
                        </p>
                        <p className="text-base font-bold text-monaco-darkText pt-1">
                          ${dish.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="pt-4 mt-2 border-t border-monaco-gold/20">
                      <button
                        onClick={() => addToCart(dish)}
                        className={`w-full py-2.5 px-3 rounded-full flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                          inCart
                            ? 'bg-monaco-forest text-monaco-gold ring-1 ring-monaco-gold'
                            : 'bg-monaco-gold/90 hover:bg-monaco-gold text-monaco-deep hover:shadow-gold-glow'
                        }`}
                        aria-label={`Add ${dish.name} to Cart`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <span>Add to Cart</span>
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
