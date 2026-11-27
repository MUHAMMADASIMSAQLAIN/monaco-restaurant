import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant';

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative bg-monaco-forest pt-28 sm:pt-36 lg:pt-40 pb-28 lg:pb-36 overflow-hidden text-monaco-ivory"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-monaco-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] bg-monaco-dark/80 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative Gold Rings & Diamonds in Background */}
      <div className="absolute top-16 right-1/4 opacity-20 pointer-events-none hidden lg:block">
        <div className="w-72 h-72 rounded-full border border-monaco-gold" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Small Gold Experience Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-monaco-dark/70 border border-monaco-gold/40">
              <span className="w-1.5 h-1.5 bg-monaco-gold rotate-45 inline-block" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-monaco-gold">
                {RESTAURANT_INFO.tagline}
              </span>
              <span className="w-1.5 h-1.5 bg-monaco-gold rotate-45 inline-block" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.12] tracking-tight text-monaco-ivory">
              Where Every Meal <br className="hidden sm:inline" />
              Becomes a <span className="italic font-normal text-monaco-gold">Memory.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-monaco-cream/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              {RESTAURANT_INFO.subheadline}
            </p>

            {/* Action Buttons matching the reference image */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 pt-2">
              {/* Explore Menu -> Warm cream/gold pill */}
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-monaco-cream text-monaco-deep font-semibold text-sm tracking-wider uppercase hover:bg-monaco-gold hover:text-monaco-deep transition-all duration-300 shadow-luxury group"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Book a Table -> Dark green pill with gold border */}
              <a
                href="#reservations"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-monaco-forest/80 border border-monaco-gold text-monaco-cream font-medium text-sm tracking-wider uppercase hover:bg-monaco-gold/20 hover:text-monaco-gold transition-all duration-300"
              >
                <span>Book a Table</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>
            </div>

            {/* Subtle Highlights Bar */}
            <div className="pt-6 border-t border-monaco-gold/20 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-monaco-gold">3★</p>
                <p className="text-xs uppercase tracking-wider text-monaco-cream/70">Michelin Pedigree</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-monaco-gold">800+</p>
                <p className="text-xs uppercase tracking-wider text-monaco-cream/70">Cellar Reserves</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-monaco-gold">100%</p>
                <p className="text-xs uppercase tracking-wider text-monaco-cream/70">Organic Sourced</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Gourmet Food Photograph & Gold Circular Framing */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Circular decorative gold halo ring */}
            <div className="absolute inset-0 m-auto w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] rounded-full border border-monaco-gold/40 -rotate-12 pointer-events-none flex items-center justify-between p-3">
              <span className="w-2.5 h-2.5 bg-monaco-gold rotate-45" />
              <span className="w-2.5 h-2.5 bg-monaco-gold rotate-45" />
            </div>

            {/* Second outer gold dashed accent */}
            <div className="absolute inset-0 m-auto w-[360px] sm:w-[460px] lg:w-[520px] h-[360px] sm:h-[460px] lg:h-[520px] rounded-full border border-dashed border-monaco-gold/20 pointer-events-none" />

            {/* Food Image Container with Gold Border */}
            <div className="relative z-10 w-[290px] sm:w-[380px] lg:w-[440px] h-[290px] sm:h-[380px] lg:h-[440px] rounded-full overflow-hidden p-2.5 bg-gradient-to-tr from-monaco-gold/60 via-monaco-goldSoft/30 to-monaco-forest shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
                <img
                  src={RESTAURANT_INFO.heroImage}
                  alt="Monaco Restaurant Gourmet Roasted Lamb Rack with Herbs"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                {/* Soft gradient overlay for cinematic luxury depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-monaco-deep/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Luxury Tag badge */}
            <div className="absolute -bottom-2 sm:bottom-4 right-2 sm:right-6 bg-monaco-deep/90 backdrop-blur-md border border-monaco-gold/50 px-4 py-2.5 rounded-2xl shadow-luxury-dark text-left z-20 hidden sm:block">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-monaco-gold" />
                <span className="text-[11px] uppercase tracking-wider text-monaco-gold font-semibold">Chef's Selection</span>
              </div>
              <p className="font-serif text-sm text-monaco-ivory font-medium mt-0.5">Roasted Lamb Rack & Vintage Pinot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Organic Curved Bottom Transition into Warm Cream Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-16 lg:h-20 text-monaco-cream preserve-3d"
        >
          <path
            d="M0,0 C320,80 720,95 1080,45 C1240,20 1360,35 1440,55 L1440,90 L0,90 Z"
            fill="#FFF1D9"
          />
        </svg>
      </div>
    </section>
  );
};
