import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Clock, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [formalsProducts, setFormalsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, productsRes] = await Promise.all([
          axios.get('/api/banners'),
          axios.get('/api/products'),
        ]);

        setBanners(bannersRes.data);
        const prods = productsRes.data;
        setLatestProducts(prods.slice(0, 4));
        setFormalsProducts(prods.filter((p) => p.category === 'Formals').slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Editorial Slider */}
      <HeroSlider banners={banners} />

      {/* 2. Brand Value Highlights Bar */}
      <div className="border-b border-neutral-100 bg-neutral-50 py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-neutral-800">
            <Truck className="w-4 h-4 text-fk-gold" />
            <span className="text-[11px] uppercase tracking-wider font-medium">Worldwide Shipping</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-neutral-800">
            <Sparkles className="w-4 h-4 text-fk-gold" />
            <span className="text-[11px] uppercase tracking-wider font-medium">Artisanal Zardozi Handwork</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-neutral-800">
            <Clock className="w-4 h-4 text-fk-gold" />
            <span className="text-[11px] uppercase tracking-wider font-medium">Express Ready to Ship</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-neutral-800">
            <ShieldCheck className="w-4 h-4 text-fk-gold" />
            <span className="text-[11px] uppercase tracking-wider font-medium">100% Pure Silk Fabrics</span>
          </div>
        </div>
      </div>

      {/* 3. Section: LATEST COLLECTION (Matching fatimakhanofficial.com) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium block">
              Curated Edit '26
            </span>
            <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-neutral-900 font-normal mt-1">
              LATEST COLLECTION
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 md:mt-0 text-xs uppercase tracking-widest text-neutral-700 hover:text-black font-semibold flex items-center space-x-1 group"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse space-y-3">
                <div className="bg-neutral-100 aspect-[3/4] w-full"></div>
                <div className="h-4 bg-neutral-100 w-3/4 mx-auto"></div>
                <div className="h-3 bg-neutral-100 w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Feature Banner: FORMALS SPOTLIGHT (Matching fatimakhanofficial.com) */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner Hero Card */}
          <div className="relative mb-12 overflow-hidden bg-neutral-900 aspect-[21/9] max-h-[460px] group">
            <img
              src="https://www.fatimakhanofficial.com/images/thumbs/0008357_bvcbvcn.jpeg"
              alt="Fatima Khan Formals"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center p-6 text-white">
              <span className="text-[10px] md:text-xs uppercase tracking-widest3 text-neutral-300 mb-2">
                Haute Couture & Heritage
              </span>
              <h2 className="font-serif text-3xl md:text-5xl tracking-widest uppercase font-normal mb-3">
                FORMALS
              </h2>
              <p className="text-xs md:text-sm font-light max-w-lg tracking-wider text-neutral-200 mb-6 px-4">
                Traditional silhouettes with delicate signature embroideries; your definite go-to for the festive season.
              </p>
              <Link
                to="/shop?category=Formals"
                className="py-2.5 px-8 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-white transition-colors duration-300 border border-white"
              >
                View Full Formals Edit
              </Link>
            </div>
          </div>

          {/* Formals Product Carousel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {formalsProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Category Spotlight Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium">
            Discover
          </span>
          <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-neutral-900 font-normal mt-1">
            EXPLORE BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tile 1 */}
          <Link
            to="/shop?collection=Endless Summer '26"
            className="group relative overflow-hidden aspect-[4/5] bg-neutral-100 block"
          >
            <img
              src="https://www.fatimakhanofficial.com/images/thumbs/0010448_midnight-kaftan_1000.jpeg"
              alt="Digital Silk Prints"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-center">
              <span className="text-[10px] uppercase tracking-widest font-light text-neutral-300">
                Printed Silks
              </span>
              <h3 className="font-serif text-xl uppercase tracking-widest font-normal my-1">
                DIGITAL SILK PRINTS
              </h3>
              <span className="text-[11px] uppercase tracking-widest underline underline-offset-4 text-white font-medium">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Tile 2 */}
          <Link
            to="/shop?readyToShip=true"
            className="group relative overflow-hidden aspect-[4/5] bg-neutral-100 block"
          >
            <img
              src="https://www.fatimakhanofficial.com/images/thumbs/0010487_mint-garden_1000.jpeg"
              alt="Ready to Ship"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-center">
              <span className="text-[10px] uppercase tracking-widest font-light text-neutral-300">
                Express Delivery
              </span>
              <h3 className="font-serif text-xl uppercase tracking-widest font-normal my-1">
                READY TO SHIP
              </h3>
              <span className="text-[11px] uppercase tracking-widest underline underline-offset-4 text-white font-medium">
                Flat 25% Off
              </span>
            </div>
          </Link>

          {/* Tile 3 */}
          <Link
            to="/shop?category=Luxury Pret"
            className="group relative overflow-hidden aspect-[4/5] bg-neutral-100 block"
          >
            <img
              src="https://www.fatimakhanofficial.com/images/thumbs/0010467_blush-blossom_1000.jpeg"
              alt="Luxury Pret"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-center">
              <span className="text-[10px] uppercase tracking-widest font-light text-neutral-300">
                Couture Daywear
              </span>
              <h3 className="font-serif text-xl uppercase tracking-widest font-normal my-1">
                LUXURY PRET
              </h3>
              <span className="text-[11px] uppercase tracking-widest underline underline-offset-4 text-white font-medium">
                Explore Edit
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Brand Story & Craftsmanship Showcase */}
      <section className="bg-neutral-900 text-white py-20 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] uppercase tracking-widest3 text-fk-gold font-semibold block mb-2">
            HEIRLOOM HERITAGE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase font-normal mb-6">
            THE ART OF FATIMA KHAN COUTURE
          </h2>
          <div className="w-16 h-px bg-fk-gold mx-auto mb-6"></div>
          <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed tracking-wider mb-8">
            Founded in 2012, the Fatima Khan label has defined contemporary Pakistani haute couture. Renowned for innovative fabric manipulations, rich hand-woven raw silks, intricate kora and dabka needlesmithing, each garment is handcrafted by master artisans to deliver timeless elegance and prestigious celebration.
          </p>
          <a
            href="https://wa.me/923033333705?text=Hello%20Fatima%20Khan%20Official,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20bridal/formal%20appointment"
            target="_blank"
            rel="noreferrer"
            className="inline-block py-3 px-8 bg-transparent text-white border border-white text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition duration-300"
          >
            Book Bespoke Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
