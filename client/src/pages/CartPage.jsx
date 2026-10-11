import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-neutral-300 stroke-1" />
        <h1 className="font-serif text-3xl tracking-widest uppercase mb-3">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-neutral-500 font-light mb-8 max-w-sm mx-auto">
          Explore our latest collection of silk kaftans, formal couture, and luxury pret.
        </p>
        <Link
          to="/shop"
          className="inline-block py-3 px-8 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl tracking-widest uppercase text-center text-neutral-900 mb-10 font-normal">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items Table (8 cols) */}
          <div className="lg:col-span-8">
            <div className="border-b border-neutral-200 pb-3 hidden md:grid grid-cols-12 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-neutral-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 items-center gap-4 text-xs">
                  {/* Product Info */}
                  <div className="col-span-6 flex space-x-4 w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover object-top flex-shrink-0 bg-neutral-100"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-serif text-sm font-medium text-neutral-900">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Size: {item.size}</p>
                        {item.heightOption && (
                          <p className="text-[11px] text-neutral-500">Length: {item.heightOption}</p>
                        )}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <div className="text-[10px] text-fk-gold font-medium mt-1">
                            {item.selectedAddons.map((addon, aIdx) => (
                              <div key={aIdx}>+ {addon.name} ({formatPrice(addon.price)})</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 text-[11px] flex items-center space-x-1 mt-2 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-center font-medium text-neutral-700 hidden md:block">
                    {formatPrice(item.unitPrice)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="col-span-2 flex items-center justify-center border border-neutral-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-neutral-500 hover:text-black"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-neutral-500 hover:text-black"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right font-semibold text-neutral-900 text-sm">
                    {formatPrice(item.itemTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-neutral-200">
              <Link to="/shop" className="text-xs uppercase tracking-wider underline font-medium">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 uppercase tracking-wider hover:underline"
              >
                Clear Bag
              </button>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-50 p-6 border border-neutral-200 space-y-4">
              <h2 className="font-serif text-lg tracking-wider uppercase text-neutral-900 border-b border-neutral-200 pb-3">
                Order Summary
              </h2>

              {/* Coupon form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2 text-xs">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. MIRHA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 border border-neutral-300 p-2 uppercase tracking-wider bg-white focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 bg-black text-white uppercase tracking-widest font-semibold text-[11px] hover:bg-neutral-800 transition"
                >
                  Apply
                </button>
              </form>

              {couponCode && (
                <div className="flex justify-between items-center text-xs text-green-700 bg-green-50 p-2">
                  <span>Code {couponCode} applied ({discountPercent}% off)</span>
                  <button onClick={removeCoupon} className="text-red-500 font-semibold hover:underline">
                    Remove
                  </button>
                </div>
              )}

              <div className="text-xs space-y-2 pt-2 border-t border-neutral-200 text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm font-bold text-neutral-900">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-neutral-400 text-center font-light pt-2">
                Taxes and duty included where applicable. Worldwide express shipping via DHL / FedEx.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
