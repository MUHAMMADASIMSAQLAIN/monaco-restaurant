import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/menu';

export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<(typeof GALLERY_IMAGES)[0] | null>(null);

  const categories = ['All', 'Interior', 'Culinary', 'Fine Dining', 'Cellar', 'Ambience'];

  const filteredImages =
    activeFilter === 'All'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="bg-monaco-ivory py-20 lg:py-28 text-monaco-darkText relative scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 lg:mb-14">
          <div className="inline-flex items-center space-x-2 text-monaco-terracotta">
            <span className="w-1.5 h-1.5 bg-monaco-gold rotate-45" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-monaco-forest">
              VISUAL EXPERIENCES
            </span>
            <span className="w-1.5 h-1.5 bg-monaco-gold rotate-45" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-monaco-forest">
            Moments at Monaco
          </h2>

          <p className="text-sm text-monaco-mutedText">
            Glimpse into the warmth, culinary theatre, and refined grandeur that await you.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-monaco-forest text-monaco-gold shadow-sm'
                    : 'bg-monaco-cream text-monaco-darkText hover:bg-monaco-gold/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-monaco-gold/40 hover:border-monaco-gold transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-monaco-deep/90 via-monaco-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase tracking-widest text-monaco-gold font-bold">
                  {item.category}
                </span>
                <h4 className="font-serif text-lg font-bold text-monaco-ivory mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-monaco-cream/80 line-clamp-2 mt-1">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center space-x-1.5 text-xs text-monaco-gold font-semibold uppercase tracking-wider">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>View Full Photo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-monaco-deep rounded-3xl overflow-hidden border-2 border-monaco-gold shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-monaco-deep/80 text-monaco-cream hover:text-monaco-gold transition-colors border border-monaco-gold/40"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full Image */}
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black/40">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Image Details */}
            <div className="p-6 bg-monaco-forest text-monaco-ivory border-t border-monaco-gold/30">
              <span className="text-xs uppercase tracking-widest text-monaco-gold font-bold">
                {selectedImage.category}
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1 text-monaco-ivory">
                {selectedImage.title}
              </h3>
              <p className="text-sm text-monaco-cream/80 mt-1 leading-relaxed">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
