import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    totalItems,
  } = useCart();

  const handleNavigate = (targetId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', `#${targetId}`);
    }, 120);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with luxury blur */}
      <div
        className="absolute inset-0 bg-monaco-deep/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-monaco-ivory shadow-2xl border-l border-monaco-gold/40 flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 bg-monaco-forest text-monaco-ivory border-b border-monaco-gold/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-monaco-gold" />
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide">Your Selection</h3>
                <p className="text-xs text-monaco-cream/70 font-light">
                  {totalItems} {totalItems === 1 ? 'dish' : 'dishes'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-monaco-dark text-monaco-cream hover:text-monaco-gold transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items list or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-monaco-cream border-2 border-monaco-gold/40 flex items-center justify-center text-monaco-gold">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-monaco-forest">
                    Your Cart is Empty
                  </h4>
                  <p className="text-xs text-monaco-mutedText max-w-xs leading-relaxed">
                    Explore our chef's signature pasta, dry-aged steaks, and artisanal dishes to begin your culinary journey.
                  </p>
                </div>
                <a
                  href="#menu"
                  onClick={handleNavigate('menu')}
                  className="px-6 py-2.5 rounded-full bg-monaco-forest text-monaco-cream text-xs uppercase tracking-wider font-semibold hover:bg-monaco-gold hover:text-monaco-deep transition-all shadow-sm inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Browse Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-monaco-gold/20">
                  <span className="text-xs uppercase tracking-wider text-monaco-mutedText font-semibold">
                    Selected Items
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-monaco-terracotta hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {items.map(({ dish, quantity }) => (
                  <div
                    key={dish.id}
                    className="p-3 bg-monaco-cardBg border border-monaco-gold/30 rounded-2xl flex items-center space-x-3.5 shadow-sm hover:border-monaco-gold transition-colors"
                  >
                    {/* Dish Thumbnail */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-monaco-gold/50 flex-shrink-0">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Dish Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-sm font-bold text-monaco-forest truncate">
                        {dish.name}
                      </h5>
                      <p className="text-xs text-monaco-terracotta font-semibold mt-0.5">
                        ${dish.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(dish.id, -1)}
                          className="w-6 h-6 rounded-full bg-monaco-ivory border border-monaco-gold/40 flex items-center justify-center text-monaco-forest hover:bg-monaco-gold hover:text-monaco-deep transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-monaco-darkText w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(dish.id, 1)}
                          className="w-6 h-6 rounded-full bg-monaco-ivory border border-monaco-gold/40 flex items-center justify-center text-monaco-forest hover:bg-monaco-gold hover:text-monaco-deep transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="text-right flex flex-col items-end space-y-2">
                      <span className="font-serif font-bold text-sm text-monaco-darkText">
                        ${(dish.price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(dish.id)}
                        className="text-monaco-mutedText hover:text-red-600 transition-colors p-1"
                        title="Remove dish"
                        aria-label={`Remove ${dish.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer: Totals and Reservation CTA */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FFF5E6] border-t border-monaco-gold/40 space-y-4">
              <div className="space-y-1.5 text-xs text-monaco-darkText">
                <div className="flex justify-between">
                  <span className="text-monaco-mutedText">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-monaco-mutedText">Estimated Dining Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-monaco-forest pt-2 border-t border-monaco-gold/30">
                  <span>Estimated Total</span>
                  <span className="font-serif text-lg text-monaco-forest">${total.toFixed(2)}</span>
                </div>
              </div>

              <a
                href="#reservations"
                onClick={handleNavigate('reservations')}
                className="w-full py-3.5 px-4 rounded-full bg-monaco-forest hover:bg-monaco-deep text-monaco-ivory font-serif font-semibold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-md group cursor-pointer"
              >
                <span>Proceed to Reservation</span>
                <ArrowRight className="w-4 h-4 text-monaco-gold transition-transform group-hover:translate-x-1" />
              </a>

              <p className="text-[11px] text-center text-monaco-mutedText leading-tight">
                Dishes in your cart can be pre-ordered or prepared fresh upon table arrival.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
