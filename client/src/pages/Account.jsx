import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Package, User, MapPin, LogOut } from 'lucide-react';

export default function Account() {
  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between pb-8 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium">My Account</span>
            <h1 className="font-serif text-3xl uppercase tracking-widest text-neutral-900 font-normal">
              {user.name}
            </h1>
            <p className="text-xs text-neutral-500 font-light">{user.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-100 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-xl tracking-wider uppercase text-neutral-900 font-medium flex items-center space-x-2">
              <Package className="w-5 h-5 text-neutral-600" />
              <span>Order History ({orders.length})</span>
            </h2>

            {loading ? (
              <div className="text-center py-12 text-xs text-neutral-400">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 border border-neutral-200 text-center">
                <p className="text-xs text-neutral-500 mb-4 font-light">You have placed no orders yet.</p>
                <Link
                  to="/shop"
                  className="inline-block py-2.5 px-6 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white p-6 border border-neutral-200 shadow-sm text-xs space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-neutral-100 pb-3 gap-2">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Order No.</span>
                      <span className="font-serif font-bold text-neutral-900 text-sm tracking-wide">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Placed on</span>
                      <span className="text-neutral-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Status</span>
                      <span className="inline-block px-2.5 py-0.5 bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-semibold rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Total</span>
                      <span className="font-bold text-neutral-900 text-sm font-serif">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-neutral-50">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.title} className="w-10 h-12 object-cover object-top bg-neutral-100" />
                          <div>
                            <p className="font-medium text-neutral-900">{item.title}</p>
                            <p className="text-[10px] text-neutral-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-neutral-800">{formatPrice(item.itemTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-neutral-100 text-[11px]">
                    <span className="text-neutral-500">Payment: {order.paymentMethod}</span>
                    <Link
                      to={`/order-success/${order.orderNumber}`}
                      className="text-black font-semibold uppercase tracking-wider hover:underline"
                    >
                      View Receipt & Tracking →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Profile Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 shadow-sm text-xs space-y-4">
              <h3 className="font-serif text-base uppercase tracking-wider text-neutral-900 font-medium border-b border-neutral-200 pb-2 flex items-center space-x-2">
                <User className="w-4 h-4 text-neutral-700" />
                <span>Account Profile</span>
              </h3>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Full Name</span>
                <p className="font-medium text-neutral-800">{user.name}</p>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Email Address</span>
                <p className="font-medium text-neutral-800">{user.email}</p>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Contact Phone</span>
                <p className="font-medium text-neutral-800">{user.phone || 'Not added'}</p>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Account Role</span>
                <p className="font-medium text-neutral-800 uppercase tracking-wider text-[11px]">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
