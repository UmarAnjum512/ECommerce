import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Plus, Edit2, Trash2, Search, X, Check, Eye } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function AdminProducts() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    description: '',
    fabricDetails: '',
    category: 'Formals',
    collectionName: "Endless Summer '26",
    price: 0,
    originalPrice: 0,
    images: [],
    hoverImage: '',
    sizes: 'XS, S, M, L, XL, Custom',
    heightOptions: 'Standard (45-48 inches), Tall (54-56 inches), Custom Length',
    addons: '', // format: "Matching Silk Pants:35, Handcrafted Dupatta:45"
    countInStock: 10,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: true,
    deliveryTimeline: 'Ready to Ship: 3-5 working days',
    careInstructions: 'Dry clean only',
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      sku: `FK-${Date.now().toString().slice(-4)}`,
      description: '',
      fabricDetails: 'Pure Raw Silk with organza lace borders and handcrafted resham finishes.',
      category: 'Formals',
      collectionName: "Endless Summer '26",
      price: 150,
      originalPrice: 180,
      images: [],
      hoverImage: '',
      sizes: 'XS, S, M, L, XL, Custom',
      heightOptions: 'Standard (45-48 inches), Tall (54-56 inches), Custom Length',
      addons: 'Matching Silk Pants:35, Silk Dupatta:45',
      countInStock: 10,
      isFeatured: true,
      isReadyToShip: false,
      isNewArrival: true,
      deliveryTimeline: 'Ready to Ship: 3-5 working days',
      careInstructions: 'Dry clean only',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      title: prod.title,
      sku: prod.sku || '',
      description: prod.description,
      fabricDetails: prod.fabricDetails || '',
      category: prod.category,
      collectionName: prod.collectionName || '',
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      images: prod.images ? [...prod.images] : [],
      hoverImage: prod.hoverImage || '',
      sizes: prod.sizes ? prod.sizes.join(', ') : 'XS, S, M, L, XL, Custom',
      heightOptions: prod.heightOptions ? prod.heightOptions.join(', ') : '',
      addons: prod.addons
        ? prod.addons.map((a) => `${a.name}:${a.price}`).join(', ')
        : '',
      countInStock: prod.countInStock || 10,
      isFeatured: Boolean(prod.isFeatured),
      isReadyToShip: Boolean(prod.isReadyToShip),
      isNewArrival: Boolean(prod.isNewArrival),
      deliveryTimeline: prod.deliveryTimeline || '',
      careInstructions: prod.careInstructions || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this luxury piece?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      // Parse comma separated addons
      const parsedAddons = formData.addons
        ? formData.addons.split(',').map((item) => {
            const [name, price] = item.split(':');
            return {
              name: name.trim(),
              price: Number(price ? price.trim() : 0),
            };
          }).filter((a) => a.name)
        : [];

      // Parse images array
      const parsedImages = formData.images;

      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        countInStock: Number(formData.countInStock),
        images: parsedImages,
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        heightOptions: formData.heightOptions.split(',').map((h) => h.trim()).filter(Boolean),
        addons: parsedAddons,
      };

      if (editingId) {
        const { data } = await axios.put(`/api/products/${editingId}`, payload, config);
        setProducts(products.map((p) => (p._id === editingId ? data : p)));
      } else {
        const { data } = await axios.post('/api/products', payload, config);
        setProducts([data, ...products]);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-wider uppercase text-neutral-900 font-normal">
            Product Catalogue
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Manage Mirha Fashion designer creations, pricing, add-ons, and availability.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Design</span>
        </button>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white p-4 border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-md border border-neutral-300 px-3 py-2 bg-neutral-50">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-neutral-300 py-1.5 px-3 bg-white focus:outline-none font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Formals">Formals</option>
            <option value="Luxury Pret">Luxury Pret</option>
            <option value="Digital Silk Prints">Digital Silk Prints</option>
            <option value="Ready to Ship">Ready to Ship</option>
            <option value="Mommy & Me">Mommy & Me</option>
          </select>
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-white border border-neutral-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Design</th>
              <th className="py-3 px-4">Category / Collection</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Ready to Ship</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-neutral-400">
                  Loading catalogue...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-neutral-400">
                  No products matched your criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50/60">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images && p.images[0] ? p.images[0] : ''}
                        alt={p.title}
                        className="w-12 h-14 object-cover object-top bg-neutral-100 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-medium text-neutral-900 text-sm">{p.title}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">
                    <span className="block font-medium text-neutral-800">{p.category}</span>
                    <span className="text-[10px] text-neutral-400">{p.collectionName}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {formatPrice(p.price)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{p.countInStock}</span>
                  </td>
                  <td className="py-3 px-4">
                    {p.isReadyToShip ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-semibold rounded">
                        YES
                      </span>
                    ) : (
                      <span className="text-neutral-400">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.isFeatured ? (
                      <span className="px-2 py-0.5 bg-neutral-900 text-fk-gold text-[10px] font-semibold rounded">
                        FEATURED
                      </span>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                        title="Edit Design"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded"
                        title="Delete Design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="font-serif text-xl uppercase tracking-wider text-neutral-900 font-medium">
                {editingId ? 'Edit Couture Piece' : 'Add New Couture Piece'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                    placeholder="e.g. Midnight Kaftan"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-neutral-300 p-2 bg-white focus:border-black focus:outline-none"
                  >
                    <option value="Formals">Formals</option>
                    <option value="Luxury Pret">Luxury Pret</option>
                    <option value="Digital Silk Prints">Digital Silk Prints</option>
                    <option value="Ready to Ship">Ready to Ship</option>
                    <option value="Mommy & Me">Mommy & Me</option>
                    <option value="Basics">Basics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Collection Name</label>
                  <input
                    type="text"
                    value={formData.collectionName}
                    onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                    placeholder="e.g. Endless Summer '26"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Product Images * (pehli image main hogi)</label>
                <ImageUploader multiple required value={formData.images} onChange={(urls) => setFormData({ ...formData, images: urls })} />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Hover Image (2nd image displayed on hover)</label>
                <ImageUploader value={formData.hoverImage} onChange={(url) => setFormData({ ...formData, hoverImage: url })} />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  placeholder="Editorial description of embroidery, silhouette, and festive styling..."
                ></textarea>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Fabric & Handwork Details</label>
                <input
                  type="text"
                  value={formData.fabricDetails}
                  onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                  placeholder="e.g. Pure Silk Organza, zardozi, kora, dabka needlesmithing"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">
                  Add-on Options (Format: Name:Price, Name:Price)
                </label>
                <input
                  type="text"
                  value={formData.addons}
                  onChange={(e) => setFormData({ ...formData, addons: e.target.value })}
                  className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none font-mono text-[11px]"
                  placeholder="Matching Silk Pants:35, Silk Dupatta:45"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 py-2 border-t border-neutral-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-neutral-300 text-black focus:ring-0"
                  />
                  <span className="text-neutral-800 font-medium">Feature on Homepage</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isReadyToShip}
                    onChange={(e) => setFormData({ ...formData, isReadyToShip: e.target.checked })}
                    className="rounded border-neutral-300 text-black focus:ring-0"
                  />
                  <span className="text-neutral-800 font-medium">Ready To Ship</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-neutral-300 text-black focus:ring-0"
                  />
                  <span className="text-neutral-800 font-medium">New Arrival Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 text-neutral-700 uppercase tracking-widest font-semibold text-xs hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white uppercase tracking-widest font-semibold text-xs hover:bg-neutral-800 transition"
                >
                  {editingId ? 'Save Changes' : 'Publish Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
