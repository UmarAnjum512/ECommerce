import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import { MessageCircle, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, Heart } from 'lucide-react';

export default function ProductDetail() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${identifier}`);
        setProduct(data);
        setActiveImage(data.images && data.images[0] ? data.images[0] : '');
        setSelectedSize(data.sizes && data.sizes[0] ? data.sizes[0] : 'M');
        setSelectedHeight(data.heightOptions && data.heightOptions[0] ? data.heightOptions[0] : 'Standard (45-48 inches)');
        setSelectedAddons([]);

        // Fetch related products
        const relatedRes = await axios.get(`/api/products?category=${data.category}`);
        setRelatedProducts(relatedRes.data.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-neutral-100 aspect-[3/4] w-full"></div>
          <div className="space-y-4">
            <div className="h-8 bg-neutral-100 w-3/4"></div>
            <div className="h-4 bg-neutral-100 w-1/4"></div>
            <div className="h-6 bg-neutral-100 w-1/3"></div>
            <div className="h-32 bg-neutral-100 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="font-serif text-2xl mb-4">Design Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">The requested garment could not be retrieved from our archives.</p>
        <Link to="/shop" className="py-2.5 px-6 bg-black text-white text-xs uppercase tracking-widest font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Add-on toggle logic
  const handleToggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Dynamic calculated price
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const unitPrice = Number(product.price) + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedHeight, selectedAddons, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedHeight, selectedAddons, quantity);
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Mirha Fashion! I want to inquire about: "${product.title}" (${product.sku}). ` +
    `Size: ${selectedSize}, Height: ${selectedHeight}. Total: $${unitPrice}. URL: ${window.location.href}`
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-[11px] text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-black">Collections</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-medium">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* 2. Image Gallery Column (Left) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 overflow-hidden border transition ${
                      activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 bg-neutral-100 overflow-hidden aspect-[3/4]">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-top transition duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* 3. Product Info & Purchase Column (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-neutral-800 space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400 mb-1">
                <span>{product.collectionName || product.category}</span>
                <span>SKU: {product.sku || 'FK-COUTURE'}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase text-neutral-900 font-normal mb-3">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline space-x-3 pb-4 border-b border-neutral-200">
                <span className="text-xl md:text-2xl font-bold tracking-wider text-neutral-900">
                  {formatPrice(unitPrice)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.isReadyToShip && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-green-700 bg-green-50 px-2.5 py-1">
                    Ready To Ship (3-5 Days)
                  </span>
                )}
              </div>

              {/* Brief Description */}
              <p className="text-xs text-neutral-600 font-light leading-relaxed my-4">
                {product.description}
              </p>

              {/* SIZE SELECTION */}
              <div className="my-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="uppercase tracking-widest font-semibold text-neutral-900">Select Size:</span>
                  <span className="text-neutral-400 underline cursor-pointer text-[11px]">Size Guide</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'Custom']).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs uppercase tracking-wider font-medium border transition ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* HEIGHT / SHIRT LENGTH SELECTOR (Mirha Fashion signature!) */}
              {product.heightOptions && product.heightOptions.length > 0 && (
                <div className="my-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="uppercase tracking-widest font-semibold text-neutral-900">
                      Shirt Length / Height:
                    </span>
                  </div>
                  <select
                    value={selectedHeight}
                    onChange={(e) => setSelectedHeight(e.target.value)}
                    className="w-full text-xs border border-neutral-300 py-2.5 px-3 bg-white focus:outline-none focus:border-black font-medium tracking-wide"
                  >
                    {product.heightOptions.map((h, i) => (
                      <option key={i} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ADD-ONS SELECTOR (Dupatta, Pants, Inner slip) */}
              {product.addons && product.addons.length > 0 && (
                <div className="my-5 p-4 bg-neutral-50 border border-neutral-200">
                  <span className="block text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                    Add-ons & Matching Coordinates:
                  </span>
                  <div className="space-y-2.5">
                    {product.addons.map((addon) => {
                      const isChecked = selectedAddons.some((a) => a.name === addon.name);
                      return (
                        <label
                          key={addon.name}
                          className="flex items-start space-x-3 text-xs cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddon(addon)}
                            className="mt-0.5 rounded border-neutral-300 text-black focus:ring-0"
                          />
                          <div className="flex-1 flex justify-between">
                            <div>
                              <span className="font-medium text-neutral-900">{addon.name}</span>
                              {addon.description && (
                                <p className="text-[10px] text-neutral-500 font-light">{addon.description}</p>
                              )}
                            </div>
                            <span className="font-semibold text-neutral-900 ml-2">
                              +{formatPrice(addon.price)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUANTITY & ACTIONS */}
              <div className="flex items-center space-x-3 my-6">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-neutral-500 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-neutral-500 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition shadow-lg"
                >
                  Add To Shopping Bag
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition mb-3 border border-neutral-900"
              >
                Buy It Now
              </button>

              {/* Direct WhatsApp Inquiry Button */}
              <a
                href={`https://wa.me/923172043468?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>

              {/* Success Notification */}
              {addedMessage && (
                <div className="mt-3 p-2 bg-green-50 text-green-800 text-xs text-center font-medium animate-fade-in flex items-center justify-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Added to your shopping bag!</span>
                </div>
              )}
            </div>

            {/* 4. Trust Badges & Delivery Info */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>Worldwide Delivery</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                <span>100% Authentic Handcraft</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw className="w-4 h-4 text-neutral-700" />
                <span>Custom Tailoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Detailed Tabs: Description, Fabric & Embellishments, Care */}
        <div className="mt-16 pt-10 border-t border-neutral-200">
          <div className="flex justify-center space-x-8 border-b border-neutral-200 pb-3 text-xs uppercase tracking-widest font-medium">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 transition ${
                activeTab === 'description' ? 'border-b-2 border-black text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('fabric')}
              className={`pb-2 transition ${
                activeTab === 'fabric' ? 'border-b-2 border-black text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Fabric & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-2 transition ${
                activeTab === 'delivery' ? 'border-b-2 border-black text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Delivery & Care
            </button>
          </div>

          <div className="max-w-3xl mx-auto py-8 text-xs text-neutral-600 leading-relaxed font-light">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Each piece is designed to ensure prestige, comfort, and an artistic silhouette suitable for weddings, festive occasions, and formal soirées.
                </p>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="space-y-3">
                <p className="font-semibold text-neutral-800">Fabric Composition:</p>
                <p>{product.fabricDetails}</p>
                <p className="font-semibold text-neutral-800 mt-3">Techniques & Embellishments:</p>
                <p>Hand-done zardozi, kora, dabka, cutdana, sequins, and resham threadwork.</p>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-3">
                <p className="font-semibold text-neutral-800">Delivery Timelines:</p>
                <p>{product.deliveryTimeline}</p>
                <p className="font-semibold text-neutral-800 mt-3">Care Instructions:</p>
                <p>{product.careInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* 6. Complete The Look / Related Designs */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-200">
            <h3 className="font-serif text-2xl uppercase tracking-widest text-center text-neutral-900 mb-8 font-normal">
              COMPLETE THE LOOK
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
