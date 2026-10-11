import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function FlyoutCart() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    total,
    totalItems,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* 1. Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-serif text-lg tracking-wider uppercase text-neutral-900 font-normal">
              Shopping Bag ({totalItems})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-neutral-500 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 text-neutral-300 flex items-center justify-center">
                  <Tag className="w-12 h-12 stroke-1" />
                </div>
                <p className="font-serif text-base text-neutral-700 mb-2">Your shopping bag is empty</p>
                <p className="text-xs text-neutral-400 font-light mb-6">
                  Discover timeless Pakistani couture pieces and ready-to-ship silks.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3 pb-4 border-b border-neutral-100 last:border-none"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover object-top flex-shrink-0 bg-neutral-100"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-neutral-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <p className="text-[11px] text-neutral-500 mt-0.5">Size: {item.size}</p>
                      {item.heightOption && (
                        <p className="text-[11px] text-neutral-500">Length: {item.heightOption}</p>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[10px] text-fk-gold font-medium mt-1 space-y-0.5">
                          {item.selectedAddons.map((addon, aIdx) => (
                            <div key={aIdx}>+ {addon.name} ({formatPrice(addon.price)})</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Unit Total */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-50">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-neutral-900 text-sm">
                        {formatPrice(item.itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. Footer & Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. FATIMA10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 text-xs border border-neutral-300 py-1.5 px-3 uppercase tracking-wider focus:outline-none focus:border-black bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition"
                >
                  Apply
                </button>
              </form>

              {couponCode && (
                <div className="flex justify-between items-center text-xs text-green-700 bg-green-50 p-2 rounded">
                  <span>{couponMessage || `Code ${couponCode} active`}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 text-[10px] uppercase tracking-wider font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="text-xs space-y-1.5 pt-2 text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE (Over $200)' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-900">
                  <span>Total</span>
                  <span className="text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black underline"
                >
                  View Full Cart & Custom Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
