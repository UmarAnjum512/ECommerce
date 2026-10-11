import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, CreditCard, Banknote, Building2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, subtotal, shippingFee, discountAmount, total, clearCart } = useCart();
  const { formatPrice, currency, rates } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine: user?.addresses && user.addresses[0] ? user.addresses[0].addressLine : '',
    city: user?.addresses && user.addresses[0] ? user.addresses[0].city : '',
    postalCode: user?.addresses && user.addresses[0] ? user.addresses[0].postalCode : '',
    country: user?.addresses && user.addresses[0] ? user.addresses[0].country : 'Pakistan',
    paymentMethod: 'COD',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          addressLine: formData.addressLine,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          title: item.title,
          image: item.image,
          price: item.unitPrice,
          quantity: item.quantity,
          size: item.size,
          heightOption: item.heightOption,
          selectedAddons: item.selectedAddons || [],
          itemTotal: item.itemTotal,
        })),
        currency: currency,
        exchangeRate: rates[currency]?.rate || 1,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const config = user?.token
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};

      const { data } = await axios.post('/api/orders', orderPayload, config);

      clearCart();
      navigate(`/order-success/${data.orderNumber}`);
    } catch (err) {
      console.error('Checkout error', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl tracking-widest uppercase text-center text-neutral-900 mb-10 font-normal">
          Luxury Checkout
        </h1>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Customer & Shipping (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 border border-neutral-200 shadow-sm space-y-8">
            {/* 1. Contact Information */}
            <div>
              <h2 className="font-serif text-base uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 mb-4 font-medium">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div>
              <h2 className="font-serif text-base uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 mb-4 font-medium">
                2. Delivery Address
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 bg-white focus:border-black focus:outline-none"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Street Address / House No. *</label>
                  <input
                    type="text"
                    name="addressLine"
                    required
                    placeholder="House / Apartment #, Street, Area"
                    value={formData.addressLine}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-600 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Lahore / Karachi / Islamabad"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Special Tailoring Instructions / Notes</label>
                  <textarea
                    name="notes"
                    rows="2"
                    placeholder="Any specific height, fitting notes, or delivery timing instructions..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div>
              <h2 className="font-serif text-base uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 mb-4 font-medium">
                3. Payment Selection
              </h2>
              <div className="space-y-3 text-xs">
                <label className="flex items-center space-x-3 p-3.5 border border-neutral-200 cursor-pointer hover:border-black transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="text-black focus:ring-0"
                  />
                  <Banknote className="w-5 h-5 text-neutral-700" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Cash on Delivery (COD)</span>
                    <span className="text-neutral-500 text-[11px]">Pay with cash upon parcel arrival at your doorstep.</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3.5 border border-neutral-200 cursor-pointer hover:border-black transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={formData.paymentMethod === 'Bank Transfer'}
                    onChange={handleChange}
                    className="text-black focus:ring-0"
                  />
                  <Building2 className="w-5 h-5 text-neutral-700" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Direct Bank Wire / Online Transfer</span>
                    <span className="text-neutral-500 text-[11px]">Transfer to Fatima Khan Official HBL / Meezan Bank account.</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3.5 border border-neutral-200 cursor-pointer hover:border-black transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={formData.paymentMethod === 'Credit Card'}
                    onChange={handleChange}
                    className="text-black focus:ring-0"
                  />
                  <CreditCard className="w-5 h-5 text-neutral-700" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Credit / Debit Card</span>
                    <span className="text-neutral-500 text-[11px]">Visa, MasterCard, or UnionPay international cards.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-4">
              <h2 className="font-serif text-base uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-3 font-medium">
                Order Review ({cartItems.length} items)
              </h2>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex space-x-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-18 object-cover object-top bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif font-medium text-neutral-900">{item.title}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-fk-gold">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-neutral-900">{formatPrice(item.itemTotal)}</span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-neutral-200 pt-3 text-xs space-y-2 text-neutral-600">
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
                  <span>Total Amount</span>
                  <span className="text-xl font-serif">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Place Formal Order • {formatPrice(total)}</span>
                )}
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="p-4 bg-white border border-neutral-200 text-xs text-neutral-500 space-y-2 font-light">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-fk-gold flex-shrink-0" />
                <span>Encrypted 256-bit secure checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-fk-gold flex-shrink-0" />
                <span>Tracked worldwide delivery with dispatch notification</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
