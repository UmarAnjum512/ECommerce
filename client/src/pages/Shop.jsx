import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Active filters from URL query
  const currentCategory = searchParams.get('category') || 'All';
  const currentCollection = searchParams.get('collection') || 'All';
  const readyToShip = searchParams.get('readyToShip') === 'true';
  const newArrival = searchParams.get('newArrival') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        // Build query string
        const params = new URLSearchParams();
        if (currentCategory && currentCategory !== 'All') params.append('category', currentCategory);
        if (currentCollection && currentCollection !== 'All') params.append('collection', currentCollection);
        if (readyToShip) params.append('readyToShip', 'true');
        if (newArrival) params.append('newArrival', 'true');
        if (featured) params.append('featured', 'true');
        if (keyword) params.append('keyword', keyword);
        if (sort) params.append('sort', sort);

        const [prodsRes, colsRes] = await Promise.all([
          axios.get(`/api/products?${params.toString()}`),
          axios.get('/api/collections'),
        ]);

        setProducts(prodsRes.data);
        setCollections(colsRes.data);
      } catch (err) {
        console.error('Error loading shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === false) {
      next.delete(key);
    } else {
      next.set(key, value.toString());
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const categoriesList = ['All', 'Formals', 'Luxury Pret', 'Digital Silk Prints', 'Ready to Ship', 'Mommy & Me', 'Basics'];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Shop Page Header */}
      <div className="border-b border-neutral-200 py-10 bg-neutral-50 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium block mb-1">
            Mirha Fashion Collection
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-neutral-900 font-normal">
            {keyword ? `Search: "${keyword}"` : currentCollection !== 'All' ? currentCollection : currentCategory !== 'All' ? currentCategory : 'ALL COLLECTIONS'}
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-2 max-w-lg mx-auto">
            Discover bespoke craftsmanship, hand-embroidered silhouettes, and radiant silk designs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. Controls & Active Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200 text-xs">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="lg:hidden flex items-center space-x-2 py-2 px-4 border border-neutral-300 font-medium uppercase tracking-wider"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Result Count */}
          <div className="text-neutral-500 tracking-wider">
            Showing <span className="font-semibold text-black">{products.length}</span> pieces
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400 uppercase tracking-wider">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent font-medium border border-neutral-300 py-1.5 px-3 text-xs focus:ring-0 focus:border-black cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Badges */}
        {(currentCategory !== 'All' || currentCollection !== 'All' || readyToShip || newArrival || keyword) && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-neutral-400 font-light">Applied Filters:</span>
            {currentCategory !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 text-[11px] rounded-full">
                <span>Category: {currentCategory}</span>
                <button onClick={() => updateParam('category', 'All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {currentCollection !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 text-[11px] rounded-full">
                <span>Collection: {currentCollection}</span>
                <button onClick={() => updateParam('collection', 'All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {readyToShip && (
              <span className="inline-flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 text-[11px] rounded-full">
                <span>Ready to Ship</span>
                <button onClick={() => updateParam('readyToShip', false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {keyword && (
              <span className="inline-flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 text-[11px] rounded-full">
                <span>Keyword: {keyword}</span>
                <button onClick={() => updateParam('keyword', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-900 underline font-medium hover:text-black ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 3. Main Grid Layout (Sidebar + Products) */}
        <div className="flex pt-8 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0 space-y-8 text-xs">
            {/* Categories */}
            <div>
              <h3 className="font-serif text-sm uppercase tracking-widest font-semibold border-b border-neutral-200 pb-2 mb-3">
                Categories
              </h3>
              <ul className="space-y-2">
                {categoriesList.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => updateParam('category', cat)}
                      className={`block w-full text-left py-1 hover:text-black transition ${
                        currentCategory === cat ? 'font-bold text-black' : 'text-neutral-500 font-light'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div>
              <h3 className="font-serif text-sm uppercase tracking-widest font-semibold border-b border-neutral-200 pb-2 mb-3">
                Collections
              </h3>
              <ul className="space-y-2">
                <li key="all-cols">
                  <button
                    onClick={() => updateParam('collection', 'All')}
                    className={`block w-full text-left py-1 hover:text-black transition ${
                      currentCollection === 'All' ? 'font-bold text-black' : 'text-neutral-500 font-light'
                    }`}
                  >
                    All Collections
                  </button>
                </li>
                {collections.map((col) => (
                  <li key={col._id}>
                    <button
                      onClick={() => updateParam('collection', col.name)}
                      className={`block w-full text-left py-1 hover:text-black transition ${
                        currentCollection === col.name ? 'font-bold text-black' : 'text-neutral-500 font-light'
                      }`}
                    >
                      {col.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ready to Ship Toggle */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={readyToShip}
                  onChange={(e) => updateParam('readyToShip', e.target.checked)}
                  className="rounded border-neutral-300 text-black focus:ring-0"
                />
                <span className="font-medium text-neutral-800">Ready to Ship Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse space-y-3">
                    <div className="bg-neutral-100 aspect-[3/4] w-full"></div>
                    <div className="h-4 bg-neutral-100 w-3/4 mx-auto"></div>
                    <div className="h-3 bg-neutral-100 w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-neutral-50 p-8 border border-neutral-100">
                <h3 className="font-serif text-lg text-neutral-800 mb-2">No items found</h3>
                <p className="text-xs text-neutral-500 font-light mb-6">
                  No designs matched your selected filters. Try choosing another category or clearing filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
