import React from 'react';
import { Award, Compass, HeartHandshake } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant';

export const OurStory: React.FC = () => {
  return (
    <section id="story" className="bg-monaco-forest py-20 lg:py-32 text-monaco-ivory relative overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-monaco-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story Editorial Photograph */}
          <div className="lg:col-span-6 relative">
            {/* Gold Frame Outline Accent */}
            <div className="absolute -inset-3 rounded-3xl border border-monaco-gold/40 transform -rotate-1 pointer-events-none hidden sm:block" />

            <div className="relative rounded-2xl overflow-hidden shadow-luxury-dark border-2 border-monaco-gold/60">
              <img
                src={RESTAURANT_INFO.storyImage}
                alt="Monaco Restaurant chefs preparing gourmet dishes"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-monaco-deep/70 via-transparent to-transparent pointer-events-none" />

              {/* Heritage Tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-monaco-deep/90 backdrop-blur-md border border-monaco-gold/40">
                <p className="font-serif italic text-monaco-gold text-sm sm:text-base">
                  "Culinary perfection is not an accident; it is the symphony of passion, patience, and unyielding discipline."
                </p>
                <p className="text-[11px] uppercase tracking-widest text-monaco-cream/70 font-semibold mt-2">
                  — Chef Antoine Dubois, Executive Culinary Director
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-monaco-gold">
                <span className="w-1.5 h-1.5 bg-monaco-gold rotate-45" />
                <span className="text-xs uppercase tracking-[0.25em] font-semibold">
                  THE MONACO HERITAGE
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-monaco-ivory">
                Every Dish Tells a Story of Craft & Passion.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-monaco-cream/80 font-light leading-relaxed">
              At Monaco Restaurant, we believe every meal should be an unforgettable experience. Our chefs combine carefully selected ingredients, authentic culinary techniques, and artistic presentation to create dishes that bring people together.
            </p>

            {/* Three Culinary Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-monaco-dark/60 border border-monaco-gold/30 space-y-2">
                <Award className="w-6 h-6 text-monaco-gold" />
                <h4 className="font-serif font-bold text-base text-monaco-ivory">Master Technique</h4>
                <p className="text-xs text-monaco-cream/70 leading-normal">
                  Classical French & Mediterranean culinary disciplines elevated with modern flair.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-monaco-dark/60 border border-monaco-gold/30 space-y-2">
                <Compass className="w-6 h-6 text-monaco-gold" />
                <h4 className="font-serif font-bold text-base text-monaco-ivory">Artisan Sourcing</h4>
                <p className="text-xs text-monaco-cream/70 leading-normal">
                  Daily harvests from organic regional producers and certified sustainable fisheries.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-monaco-dark/60 border border-monaco-gold/30 space-y-2">
                <HeartHandshake className="w-6 h-6 text-monaco-gold" />
                <h4 className="font-serif font-bold text-base text-monaco-ivory">Warm Hospitality</h4>
                <p className="text-xs text-monaco-cream/70 leading-normal">
                  Intuitive, gracious service tailored to every milestone, romance, and celebration.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#reservations"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-monaco-gold hover:text-monaco-goldSoft group"
              >
                <span>Experience Our Hospitality</span>
                <span className="w-6 h-0.5 bg-monaco-gold group-hover:w-10 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
