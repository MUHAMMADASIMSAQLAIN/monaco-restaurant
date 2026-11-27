import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'story', 'dishes', 'menu', 'gallery', 'reservations'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Our Story', href: '#story', id: 'story' },
    { name: 'Menu', href: '#menu', id: 'menu' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Reservations', href: '#reservations', id: 'reservations' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-monaco-deep/95 backdrop-blur-md shadow-luxury-dark py-3 border-b border-monaco-gold/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="group flex flex-col items-start focus:outline-none"
            aria-label="Monaco Restaurant Home"
          >
            <span className="font-serif tracking-[0.25em] text-xl sm:text-2xl font-bold text-monaco-ivory group-hover:text-monaco-gold transition-colors duration-200">
              MONACO
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.38em] uppercase text-monaco-gold font-medium -mt-0.5">
              RESTAURANT
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-monaco-gold font-semibold'
                      : 'text-monaco-ivory/80 hover:text-monaco-gold font-medium'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-monaco-gold rounded-full shadow-gold-glow animate-pulse" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons: Cart & Reservation CTA */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Table reservation pill button (desktop) */}
            <a
              href="#reservations"
              className="hidden lg:inline-flex items-center space-x-2 text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-monaco-gold/60 text-monaco-gold hover:bg-monaco-gold hover:text-monaco-deep transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-monaco-dark/80 hover:bg-monaco-forest border border-monaco-gold/40 hover:border-monaco-gold text-monaco-gold transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-monaco-gold/50"
              aria-label={`View cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-monaco-deep bg-monaco-gold rounded-full ring-2 ring-monaco-deep animate-scaleIn">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-monaco-ivory hover:text-monaco-gold focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-monaco-deep/98 border-b border-monaco-gold/20 px-6 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 text-base uppercase tracking-widest transition-colors ${
                  activeSection === link.id
                    ? 'text-monaco-gold font-semibold'
                    : 'text-monaco-ivory/80 hover:text-monaco-gold'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-monaco-gold/20 flex flex-col space-y-3">
            <a
              href="#reservations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-monaco-gold text-monaco-deep font-semibold text-sm tracking-wider uppercase shadow-gold-glow"
            >
              Reserve a Table
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
