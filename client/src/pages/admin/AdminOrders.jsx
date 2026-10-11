import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Eye, Truck, Check, X, Search, Filter } from 'lucide-react';

export default function AdminOrders() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const query = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const { data } = await axios.get(`/api/orders${query}`, config);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/orders/${orderId}/status`,
        { orderStatus: newStatus, trackingNumber: trackingInput || undefined },
        config
      );
      setOrders(orders.map((o) => (o._id === orderId ? data : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(data);
      }
      setUpdateMsg(`Order status updated to ${newStatus}`);
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-wider uppercase text-neutral-900 font-normal">
            Orders Fulfillment
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Monitor client bookings, update stitching status, and enter international courier dispatch tracking.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-neutral-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-neutral-300 py-2 px-3 bg-white focus:outline-none font-medium"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {updateMsg && (
        <div className="p-3 bg-green-50 text-green-800 text-xs border border-green-200 animate-fade-in flex items-center space-x-1">
          <Check className="w-4 h-4" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* 2. Orders Table */}
      <div className="bg-white border border-neutral-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Pieces</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status & Tracking</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-neutral-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-neutral-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 px-4 font-serif font-bold text-neutral-900">
                    {ord.orderNumber}
                    <span className="block text-[10px] text-neutral-400 font-normal">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-neutral-800">{ord.customerInfo?.name}</p>
                    <p className="text-[11px] text-neutral-500">{ord.customerInfo?.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">
                    {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {ord.orderItems?.length || 1} item(s)
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 font-serif">
                    {formatPrice(ord.totalPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className={`text-[11px] font-semibold uppercase tracking-wider py-1 px-2 border border-neutral-300 rounded focus:outline-none cursor-pointer ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-green-50 text-green-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-50 text-blue-800'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {ord.trackingNumber && (
                      <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                        Trk: {ord.trackingNumber}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setTrackingInput(ord.trackingNumber || '');
                      }}
                      className="p-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded"
                      title="View Full Order Info"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto text-xs space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Order Dossier</span>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">{selectedOrder.orderNumber}</h3>
                <p className="text-neutral-500 text-[11px]">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client & Destination Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 border border-neutral-200">
              <div>
                <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-1">Customer</h4>
                <p className="font-medium text-neutral-800">{selectedOrder.customerInfo?.name}</p>
                <p className="text-neutral-600">{selectedOrder.customerInfo?.email}</p>
                <p className="text-neutral-600">{selectedOrder.customerInfo?.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-1">Shipping Address</h4>
                <p className="text-neutral-700">{selectedOrder.shippingAddress?.addressLine}</p>
                <p className="text-neutral-700">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                <p className="text-neutral-700 font-semibold">{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Tailoring Notes if any */}
            {selectedOrder.notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-semibold block mb-0.5">Special Instructions / Custom Fitting:</span>
                <p className="font-light">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Items Table */}
            <div>
              <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-2">Ordered Items</h4>
              <div className="divide-y divide-neutral-100 border border-neutral-200">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-12 h-14 object-cover object-top bg-neutral-100" />
                      <div>
                        <p className="font-serif font-medium text-neutral-900">{item.title}</p>
                        <p className="text-[10px] text-neutral-500">Size: {item.size} • Height: {item.heightOption || 'Standard'}</p>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-[10px] text-fk-gold font-medium">
                            + {item.selectedAddons.map((a) => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Qty: {item.quantity}</span>
                      <span className="font-semibold text-neutral-900 font-serif">{formatPrice(item.itemTotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Tracking Dispatch Input */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2">
              <label className="block font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
                Courier Tracking Airway Bill (AWB) #
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. DHL-984210492 or TCS-3829104"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 border border-neutral-300 p-2 bg-white font-mono text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder._id, selectedOrder.orderStatus)}
                  className="px-4 py-2 bg-black text-white uppercase tracking-wider font-semibold text-xs hover:bg-neutral-800"
                >
                  Save Tracking
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
              <div className="text-sm font-bold text-neutral-900">
                Total: <span className="font-serif text-lg">{formatPrice(selectedOrder.totalPrice)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-neutral-900 text-white uppercase tracking-widest font-semibold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
