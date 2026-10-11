import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function AdminBanners() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '/shop',
    desktopImage: '',
    mobileImage: '',
    type: 'hero',
    order: 1,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/banners/admin', config);
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/banners', formData, config);
      setBanners([...banners, data]);
      setIsModalOpen(false);
    } catch (err) {
      alert('Error creating banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner slide?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/banners/${id}`, config);
        setBanners(banners.filter((b) => b._id !== id));
      } catch (err) {
        alert('Failed to delete banner');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl tracking-wider uppercase text-neutral-900 font-normal">
            Banners & Sliders
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Manage homepage runway carousel slides and campaign announcement visuals.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-[21/9] bg-neutral-900">
                <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-end text-white">
                  <h3 className="font-serif text-base uppercase font-normal drop-shadow">{banner.title || 'Untitled Banner'}</h3>
                  <p className="text-[11px] text-neutral-200 font-light">{banner.subtitle}</p>
                </div>
              </div>
              <div className="p-4 text-xs space-y-1 text-neutral-600">
                <p><span className="font-semibold text-neutral-800">CTA Link:</span> {banner.link}</p>
                <p><span className="font-semibold text-neutral-800">Sort Priority:</span> {banner.order}</p>
                <p><span className="font-semibold text-neutral-800">Active:</span> {banner.isActive ? 'Visible' : 'Hidden'}</p>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => handleDelete(banner._id)}
                className="text-neutral-400 hover:text-red-600 p-1"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200 mb-4">
              <h3 className="font-serif text-lg uppercase tracking-wider text-neutral-900 font-medium">
                Add Runway Banner
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. ENDLESS SUMMER '26"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Sub-caption</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Silk Botanicals & Contemporary Silhouettes"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Desktop Image *</label>
                <ImageUploader required value={formData.desktopImage} onChange={(url) => setFormData({ ...formData, desktopImage: url })} />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Mobile Image (Optional)</label>
                <ImageUploader value={formData.mobileImage} onChange={(url) => setFormData({ ...formData, mobileImage: url })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Target Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
