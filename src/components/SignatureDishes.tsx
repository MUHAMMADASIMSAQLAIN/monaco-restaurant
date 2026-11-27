import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { SIGNATURE_DISHES } from '../data/menu';
import { useCart } from '../context/CartContext';

export const SignatureDishes: React.FC = () => {
  const { addToCart, items } = useCart();

  const isItemInCart = (id: string) => items.some((item) => item.dish.id === id);

  const circularPositions = [
    { top: '0%', left: '50%', transform: 'translate(-50%, -10%)' },
    { top: '18%', left: '84%', transform: 'translate(-40%, -10%)' },
    { top: '68%', left: '84%', transform: 'translate(-40%, -20%)' },
    { top: '84%', left: '50%', transform: 'translate(-50%, -10%)' },
    { top: '68%', left: '16%', transform: 'translate(-60%, -20%)' },
    { top: '18%', left: '16%', transform: 'translate(-60%, -10%)' },
  ];

  return (
    <section
      id="dishes"
      className="relative bg-monaco-cream py-16 sm:py-20 lg:py-28 xl:py-32 2xl:py-36 overflow-hidden text-monaco-darkText"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* DESKTOP CIRCULAR COMPOSITION - Responsively scales across screen sizes */}
        <div className="hidden lg:block relative w-[820px] h-[740px] xl:w-[940px] xl:h-[820px] 2xl:w-[1040px] 2xl:h-[880px] mx-auto">
          {/* Main Decorative Gold Circular Outline */}
          <div className="absolute inset-0 m-auto w-[600px] h-[600px] xl:w-[680px] xl:h-[680px] 2xl:w-[760px] 2xl:h-[760px] rounded-full border border-monaco-gold/50 pointer-events-none flex items-center justify-between px-2">
            <span className="w-3 h-3 bg-monaco-gold rotate-45 -ml-1.5" />
            <span className="w-3 h-3 bg-monaco-gold rotate-45 -mr-1.5" />
          </div>

          {/* Central Title Branding */}
          <div className="absolute inset-0 m-auto w-64 xl:w-72 2xl:w-80 h-64 xl:h-72 2xl:h-80 rounded-full flex flex-col items-center justify-center text-center z-20 pointer-events-none">
            <span className="font-serif italic text-2xl xl:text-3xl text-monaco-terracotta">Our</span>
            <h2 className="font-serif text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-monaco-forest leading-none my-1">
              Signature
            </h2>
            <h2 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-semibold tracking-tight text-monaco-forest leading-none">
              Dishes
            </h2>
            <div className="w-12 xl:w-16 h-0.5 bg-monaco-gold mt-3 mx-auto" />
          </div>

          {/* Six Circular Dishes */}
          {SIGNATURE_DISHES.map((dish, index) => {
            const pos = circularPositions[index];
            const inCart = isItemInCart(dish.id);

            return (
              <div
                key={dish.id}
                className="absolute flex flex-col items-center text-center group cursor-pointer transition-transform duration-300 hover:scale-105 z-30"
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: pos.transform,
                  width: '180px',
                }}
              >
                <div className="relative w-32 h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 rounded-full p-1 border-2 border-monaco-gold/60 bg-monaco-ivory shadow-lg group-hover:border-monaco-gold group-hover:shadow-gold-glow transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish);
                    }}
                    className={`absolute -top-1 -right-1 w-8 h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center text-xs transition-all duration-200 shadow-md ${
                      inCart
                        ? 'bg-monaco-forest text-monaco-gold ring-2 ring-monaco-gold'
                        : 'bg-monaco-forest text-monaco-ivory hover:bg-monaco-gold hover:text-monaco-deep'
                    }`}
                    title={`Add ${dish.name} to Cart`}
                    aria-label={`Add ${dish.name} to Cart`}
                  >
                    {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="font-serif text-base xl:text-lg font-semibold text-monaco-forest mt-3 tracking-wide group-hover:text-monaco-terracotta transition-colors">
                  {dish.name}
                </h3>

                <p className="text-sm xl:text-base font-semibold text-monaco-darkText/90 mt-0.5">
                  ${dish.price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* MOBILE & TABLET LAYOUT */}
        <div className="block lg:hidden space-y-10">
          <div className="text-center space-y-2">
            <span className="font-serif italic text-xl text-monaco-terracotta">Our</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-monaco-forest">
              Signature Dishes
            </h2>
            <div className="w-16 h-0.5 bg-monaco-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center max-w-2xl sm:max-w-4xl mx-auto">
            {SIGNATURE_DISHES.map((dish) => {
              const inCart = isItemInCart(dish.id);

              return (
                <div
                  key={dish.id}
                  className="flex flex-col items-center text-center max-w-[170px] sm:max-w-[200px] group"
                >
                  <div className="relative w-28 sm:w-36 h-28 sm:h-36 rounded-full p-1 border-2 border-monaco-gold/60 bg-monaco-ivory shadow-md">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <button
                      onClick={() => addToCart(dish)}
                      className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md transition-all ${
                        inCart
                          ? 'bg-monaco-forest text-monaco-gold ring-2 ring-monaco-gold'
                          : 'bg-monaco-forest text-monaco-ivory hover:bg-monaco-gold hover:text-monaco-deep'
                      }`}
                      aria-label={`Add ${dish.name} to Cart`}
                    >
                      {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-semibold text-monaco-forest mt-3 leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-sm font-semibold text-monaco-darkText/80 mt-1">
                    ${dish.price.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
