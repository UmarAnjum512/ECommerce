import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, X, FolderTree } from 'lucide-react';

export default function AdminCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [tag, setTag] = useState('NEW');

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get('/api/collections');
      setCollections(data);
    } catch (err) {
      console.error('Failed to load collections', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/collections', { name, description, bannerImage, tag }, config);
      setCollections([...collections, data]);
      setName('');
      setDescription('');
      setBannerImage('');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating collection');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this collection?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/collections/${id}`, config);
        setCollections(collections.filter((c) => c._id !== id));
      } catch (err) {
        alert('Failed to delete collection');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl tracking-wider uppercase text-neutral-900 font-normal">
            Collections Manager
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Organize garments under seasonal edits like Endless Summer, Formals, and Digital Silk Prints.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div key={col._id} className="bg-white border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/9] bg-neutral-100">
                <img
                  src={col.bannerImage || 'https://www.fatimakhanofficial.com/images/thumbs/0010520_fatimadk.jpeg'}
                  alt={col.name}
                  className="w-full h-full object-cover object-center"
                />
                {col.tag && (
                  <span className="absolute top-2 left-2 bg-black text-white text-[9px] uppercase tracking-wider py-1 px-2 font-semibold">
                    {col.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-medium text-neutral-900">{col.name}</h3>
                <p className="text-xs text-neutral-500 font-light mt-1 line-clamp-2">{col.description}</p>
                <span className="inline-block mt-2 font-mono text-[10px] text-neutral-400">/{col.slug}</span>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => handleDelete(col._id)}
                className="text-neutral-400 hover:text-red-600 p-1"
                title="Delete Collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200 mb-4">
              <h3 className="font-serif text-lg uppercase tracking-wider text-neutral-900 font-medium">
                Add Seasonal Collection
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endless Summer '26"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Banner Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://...banner.jpeg"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="NEW / FESTIVE / EXCLUSIVE"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Collection narrative and mood..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                ></textarea>
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
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
