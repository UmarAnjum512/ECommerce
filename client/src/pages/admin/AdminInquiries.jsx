import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, MessageSquare } from 'lucide-react';

export default function AdminInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/inquiries', config);
        setInquiries(data);
      } catch (err) {
        console.error('Error fetching inquiries', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl tracking-wider uppercase text-neutral-900 font-normal">
          Subscribers & Client Leads
        </h2>
        <p className="text-xs text-neutral-500 font-light">
          Audience emails captured from the newsletter signup and bridal concierge forms.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Name / Phone</th>
              <th className="py-3 px-4">Channel Type</th>
              <th className="py-3 px-4">Date Subscribed</th>
              <th className="py-3 px-4">Message / Request</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-neutral-400">
                  Loading subscribers...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-neutral-400">
                  No subscribers or inquiries yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-neutral-50/60">
                  <td className="py-3 px-4 font-semibold text-neutral-900 font-mono">
                    {inq.email}
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    {inq.name || '-'} {inq.phone ? `(${inq.phone})` : ''}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] uppercase tracking-wider font-semibold rounded">
                      {inq.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {new Date(inq.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 font-light max-w-xs truncate">
                    {inq.message || 'Newsletter Subscription'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
