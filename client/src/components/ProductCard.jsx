import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const mainImg = product.images && product.images[0] ? product.images[0] : '';
  const secondImg = product.hoverImage || (product.images && product.images[1] ? product.images[1] : mainImg);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'M', 'Standard (45-48 inches)', [], 1);
  };

  return (
    <div
      className="group flex flex-col text-center transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Box */}
      <Link
        to={`/product/${product.slug || product._id}`}
        className="relative block w-full overflow-hidden bg-neutral-100 aspect-[3/4]"
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {product.isReadyToShip && (
            <span className="bg-black text-white text-[9px] uppercase tracking-wider py-1 px-2 font-medium">
              Ready to Ship
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-red-600 text-white text-[9px] uppercase tracking-wider py-1 px-2 font-medium">
              New
            </span>
          )}
        </div>

        {/* Primary Image */}
        <img
          src={mainImg}
          alt={product.title}
          className={`w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
            isHovered && secondImg ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Hover Secondary Image (Mirha Fashion style dual image flip) */}
        {secondImg && (
          <img
            src={secondImg}
            alt={product.title}
            className={`w-full h-full object-cover object-top absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* View Detail Overlay Button */}
        <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="block w-full py-2.5 bg-black bg-opacity-90 text-white text-[11px] uppercase tracking-widest font-medium text-center shadow-lg hover:bg-neutral-800 transition">
            View Detail
          </span>
        </div>
      </Link>

      {/* Details Box */}
      <div className="pt-4 pb-2 px-1 flex flex-col flex-grow items-center">
        {/* Category / Collection subtitle */}
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
          {product.collectionName || product.category}
        </span>

        {/* Product Title */}
        <h3 className="font-serif text-base tracking-wide text-neutral-900 group-hover:text-fk-gold transition-colors line-clamp-1 mb-1">
          <Link to={`/product/${product.slug || product._id}`}>{product.title}</Link>
        </h3>

        {/* Description snippet */}
        <p className="text-[11px] text-neutral-500 font-light line-clamp-2 max-w-xs mb-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-center space-x-2">
          <span className="text-sm font-semibold tracking-wider text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="mt-2 text-[10px] uppercase tracking-widest font-semibold text-neutral-700 hover:text-black underline underline-offset-4 transition"
        >
          Quick Add to Bag
        </button>
      </div>
    </div>
  );
}
