import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/admin/stats', config);
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-xs text-neutral-500">Loading Dashboard Metrics...</div>;
  }

  const kpis = [
    { title: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { title: 'Active Catalog', value: stats.totalProducts, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { title: 'Registered Clients', value: stats.totalUsers, icon: Users, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting */}
      <div>
        <h2 className="font-serif text-2xl tracking-wider text-neutral-900 font-normal">
          Welcome back, {user?.name}
        </h2>
        <p className="text-xs text-neutral-500 font-light mt-1">
          Here is your store summary and order fulfillment status.
        </p>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 border border-neutral-200 shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-medium">
                  {kpi.title}
                </span>
                <span className="text-2xl font-serif font-bold text-neutral-900 mt-1 block">
                  {kpi.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/products"
          className="p-4 bg-white border border-neutral-200 hover:border-black transition flex items-center justify-between group shadow-sm text-xs"
        >
          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider">Catalogue Management</h4>
            <p className="text-neutral-500 text-[11px]">Add, edit, or restock luxury designs</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/orders"
          className="p-4 bg-white border border-neutral-200 hover:border-black transition flex items-center justify-between group shadow-sm text-xs"
        >
          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider">Process Orders</h4>
            <p className="text-neutral-500 text-[11px]">Update order status & shipping tracking</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/banners"
          className="p-4 bg-white border border-neutral-200 hover:border-black transition flex items-center justify-between group shadow-sm text-xs"
        >
          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider">Hero Banners</h4>
            <p className="text-neutral-500 text-[11px]">Update campaign sliders & announcements</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-white border border-neutral-200 shadow-sm">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-serif text-base uppercase tracking-wider text-neutral-900 font-medium">
            Recent Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-neutral-700 hover:text-black"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 font-serif">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">
                      {ord.customerInfo?.name || 'Guest'}
                      <span className="block text-[10px] text-neutral-400">{ord.shippingAddress?.city}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {formatPrice(ord.totalPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs uppercase tracking-wider font-semibold underline text-neutral-800 hover:text-black"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-neutral-400">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
