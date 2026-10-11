import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010538_fkdddk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010539_fkmbbbb.jpeg',
    title: "VIVRE FORMAL '26",
    subtitle: 'Signature Luxury Couture & Bridal Masterpieces',
    link: '/shop?collection=Formals',
  },
  {
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010520_fatimadk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010521_fatimamb.jpeg',
    title: "ENDLESS SUMMER '26",
    subtitle: 'Pure Silk Botanicals & Contemporary Silhouettes',
    link: "/shop?collection=Endless Summer '26",
  },
  {
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010442_dkbannerfk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010443_bannermbfk.jpeg',
    title: 'FESTIVE COUTURE',
    subtitle: 'Traditional Zardozi, Kora, Dabka & Resham Artistry',
    link: '/shop?category=Formals',
  },
];

export default function HeroSlider({ banners = [] }) {
  const slides = banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 group aspect-[16/9] md:aspect-[21/9] max-h-[720px]">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Picture element for responsive desktop / mobile banners */}
          <picture>
            <source media="(min-width: 768px)" srcSet={slide.desktopImage} />
            <img
              src={slide.mobileImage || slide.desktopImage}
              alt={slide.title || 'Fatima Khan Banner'}
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {/* Luxury Text Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col items-center justify-end md:justify-center p-6 md:p-12 text-center text-white pb-12 md:pb-0">
            {slide.title && (
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl tracking-widest uppercase mb-2 font-normal drop-shadow-md">
                {slide.title}
              </h2>
            )}
            {slide.subtitle && (
              <p className="text-xs sm:text-sm tracking-widest uppercase font-light max-w-xl mb-6 text-neutral-200 drop-shadow">
                {slide.subtitle}
              </p>
            )}
            <Link
              to={slide.link || '/shop'}
              className="inline-block py-2.5 px-8 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-white transition-colors duration-300 shadow-lg border border-white"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white bg-black bg-opacity-40 hover:bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white bg-black bg-opacity-40 hover:bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
