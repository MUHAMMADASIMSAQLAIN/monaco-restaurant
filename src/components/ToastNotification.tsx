import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { recentlyAddedDish, setIsCartOpen } = useCart();

  if (!recentlyAddedDish) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-monaco-deep/95 border-2 border-monaco-gold rounded-2xl p-4 shadow-luxury-dark backdrop-blur-md animate-slideUp text-monaco-ivory">
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-monaco-gold/60 flex-shrink-0">
          <img
            src={recentlyAddedDish.image}
            alt={recentlyAddedDish.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-monaco-gold font-bold">
            Added to Cart
          </p>
          <h5 className="font-serif text-sm font-semibold truncate text-monaco-ivory">
            {recentlyAddedDish.name}
          </h5>
          <p className="text-xs font-semibold text-monaco-goldSoft">
            ${recentlyAddedDish.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="p-2 rounded-full bg-monaco-forest hover:bg-monaco-gold hover:text-monaco-deep text-monaco-gold transition-colors flex-shrink-0"
          aria-label="View cart"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
