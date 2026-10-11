import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderNumber}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">Generating Your Couture Invoice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 md:p-12 border border-neutral-200 shadow-sm text-center">
          <CheckCircle2 className="w-16 h-16 text-neutral-900 mx-auto mb-4 stroke-1" />
          <span className="text-[10px] uppercase tracking-widest3 text-fk-gold font-bold block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900 font-normal mb-2">
            Thank You For Your Order
          </h1>
          <p className="text-xs text-neutral-500 font-light mb-6">
            A confirmation receipt has been generated. Our couture ateliers will begin preparing your order shortly.
          </p>

          {/* Order Details Card */}
          <div className="bg-neutral-50 p-6 border border-neutral-200 text-left my-6 space-y-4 text-xs">
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-neutral-200 gap-2">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Order Reference</span>
                <span className="font-serif text-base font-bold text-neutral-900 tracking-wider">
                  {order?.orderNumber || orderNumber}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Status</span>
                <span className="inline-block px-2.5 py-0.5 bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-semibold rounded">
                  {order?.orderStatus || 'Processing'}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-neutral-200">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-1">Customer Details</span>
                <p className="font-semibold text-neutral-800">{order?.customerInfo?.name}</p>
                <p className="text-neutral-600 font-light">{order?.customerInfo?.email}</p>
                <p className="text-neutral-600 font-light">{order?.customerInfo?.phone}</p>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-1">Delivery Destination</span>
                <p className="text-neutral-700 font-light">{order?.shippingAddress?.addressLine}</p>
                <p className="text-neutral-700 font-light">{order?.shippingAddress?.city}, {order?.shippingAddress?.country}</p>
                <p className="text-neutral-500 text-[11px] mt-1">Payment Method: {order?.paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            {order?.orderItems && (
              <div className="py-2 space-y-3">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Purchased Pieces</span>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-12 h-14 object-cover object-top bg-neutral-200" />
                      <div>
                        <p className="font-medium text-neutral-900">{item.title}</p>
                        <p className="text-[10px] text-neutral-500">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-800">{formatPrice(item.itemTotal)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>Total Paid / Payable</span>
              <span className="text-base font-serif">{formatPrice(order?.totalPrice || 0)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
            >
              Continue Shopping
            </Link>
            <a
              href={`https://wa.me/923033333705?text=Hello%20Fatima%20Khan%20Official,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${order?.orderNumber || orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Track via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
