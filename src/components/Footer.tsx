import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-monaco-deep text-monaco-ivory border-t-2 border-monaco-gold/30 pt-16 pb-10">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Top Section matching Reference Image */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-monaco-gold/20">
          {/* Brand Logo on the left */}
          <div className="text-center md:text-left">
            <a href="#home" className="inline-block group focus:outline-none">
              <span className="font-serif tracking-[0.25em] text-2xl sm:text-3xl font-bold text-monaco-ivory group-hover:text-monaco-gold transition-colors">
                MONACO
              </span>
              <span className="block text-[10px] tracking-[0.4em] uppercase text-monaco-gold font-medium -mt-1">
                RESTAURANT
              </span>
            </a>
            <p className="text-xs text-monaco-cream/60 mt-2 max-w-xs font-light">
              Premium fine dining experience blending Mediterranean spirit with classical culinary artistry.
            </p>
          </div>

          {/* Navigation Links in Center separated by subtle vertical gold pipes */}
          <nav
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs uppercase tracking-widest text-monaco-ivory/80"
            aria-label="Footer Navigation"
          >
            <a href="#home" className="hover:text-monaco-gold transition-colors">
              Home
            </a>
            <span className="text-monaco-gold/40 hidden sm:inline">|</span>
            <a href="#story" className="hover:text-monaco-gold transition-colors">
              Our Story
            </a>
            <span className="text-monaco-gold/40 hidden sm:inline">|</span>
            <a href="#menu" className="hover:text-monaco-gold transition-colors">
              Menu
            </a>
            <span className="text-monaco-gold/40 hidden sm:inline">|</span>
            <a href="#gallery" className="hover:text-monaco-gold transition-colors">
              Gallery
            </a>
            <span className="text-monaco-gold/40 hidden sm:inline">|</span>
            <a href="#reservations" className="hover:text-monaco-gold transition-colors">
              Reservations
            </a>
          </nav>

          {/* Social Icons on the right in gold outline circles */}
          <div className="flex items-center space-x-3.5">
            {/* Instagram SVG */}
            <a
              href={RESTAURANT_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-monaco-gold/50 hover:border-monaco-gold flex items-center justify-center text-monaco-gold hover:bg-monaco-gold hover:text-monaco-deep transition-all duration-300 shadow-sm"
              aria-label="Monaco Restaurant on Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook SVG */}
            <a
              href={RESTAURANT_INFO.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-monaco-gold/50 hover:border-monaco-gold flex items-center justify-center text-monaco-gold hover:bg-monaco-gold hover:text-monaco-deep transition-all duration-300 shadow-sm"
              aria-label="Monaco Restaurant on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
              </svg>
            </a>

            {/* YouTube SVG */}
            <a
              href={RESTAURANT_INFO.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-monaco-gold/50 hover:border-monaco-gold flex items-center justify-center text-monaco-gold hover:bg-monaco-gold hover:text-monaco-deep transition-all duration-300 shadow-sm"
              aria-label="Monaco Restaurant on YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Info bar */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-xs text-monaco-cream/70 border-b border-monaco-gold/10">
          <div className="flex items-center justify-center md:justify-start space-x-2.5">
            <MapPin className="w-4 h-4 text-monaco-gold flex-shrink-0" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-2.5">
            <Phone className="w-4 h-4 text-monaco-gold flex-shrink-0" />
            <span>{RESTAURANT_INFO.phone}</span>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-2.5">
            <Mail className="w-4 h-4 text-monaco-gold flex-shrink-0" />
            <span>{RESTAURANT_INFO.email}</span>
          </div>
        </div>

        {/* Bottom Copyright Text matching Reference Image */}
        <div className="pt-8 text-center text-xs tracking-wider text-monaco-cream/50">
          <p>© 2026 Monaco Restaurant. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
