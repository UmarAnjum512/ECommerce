import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const ANNOUNCEMENTS = [
  { text: "Vivre Formal '26 | Coming Soon", link: "/shop?collection=Formals" },
  { text: "Endless Summer '26 | Shop Now", link: "/shop?collection=Endless Summer '26" },
  { text: "Flat 25% OFF Ready to Ship Collection", link: "/shop?readyToShip=true" },
];

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showHelloBar, setShowHelloBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Ready to Ship', path: '/shop?readyToShip=true', badge: 'Flat 25% Off' },
    { name: "Endless Summer '26", path: "/shop?collection=Endless Summer '26", badge: 'New' },
    {
      name: 'New Arrivals',
      path: '/shop?newArrival=true',
      sublinks: [
        { name: "Endless Summer '26", path: "/shop?collection=Endless Summer '26" },
        { name: 'Layan - Printed Silk Pret', path: '/shop?collection=Digital Silk Prints' },
        { name: 'Twice As Nice - Mommy And Me', path: '/shop?collection=Mommy & Me' },
        { name: 'Formals Festive Edit', path: '/shop?collection=Formals' },
      ],
    },
    { name: 'Digital Silk Prints', path: '/shop?collection=Digital Silk Prints' },
    { name: 'Formals', path: '/shop?category=Formals' },
    { name: 'Luxury Pret', path: '/shop?category=Luxury Pret' },
    { name: 'Best Sellers', path: '/shop?featured=true' },
    { name: 'Mommy & Me', path: '/shop?collection=Mommy & Me' },
    { name: 'Client Diaries', path: '/client-diaries' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* 1. Rotating Announcement Hello Bar */}
      {showHelloBar && (
        <div className="bg-fk-black text-white text-[11px] uppercase tracking-widest py-2 px-4 relative flex items-center justify-center text-center transition-all duration-300">
          <Link
            to={ANNOUNCEMENTS[announcementIdx].link}
            className="hover:underline transition-opacity duration-500 ease-in-out font-medium"
          >
            {ANNOUNCEMENTS[announcementIdx].text}
          </Link>
          <button
            onClick={() => setShowHelloBar(false)}
            className="absolute right-4 text-neutral-400 hover:text-white text-xs"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Header Top Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu Trigger & Currency Selector */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-800 hover:text-black"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-neutral-600 font-medium">
              <span className="uppercase tracking-wider">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-semibold uppercase tracking-wider text-black border-none focus:ring-0 cursor-pointer py-1 px-1.5 hover:text-fk-gold"
              >
                <option value="USD">USD ($)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Center: Brand Luxury Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase text-neutral-900 block font-normal leading-tight group-hover:opacity-85 transition-opacity">
                FATIMA KHAN
              </span>
              <span className="text-[9px] md:text-[10px] tracking-widest3 uppercase text-neutral-500 block font-light -mt-1">
                OFFICIAL COUTURE
              </span>
            </Link>
          </div>

          {/* Right: Icons (Search, Account, Cart, WhatsApp) */}
          <div className="flex items-center space-x-3 md:space-x-5 text-neutral-800">
            {/* Admin Badge link if logged in as admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center space-x-1 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold bg-neutral-900 text-fk-gold rounded hover:bg-black transition"
                title="Go to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 hover:text-fk-gold transition-colors"
              title="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-1.5 hover:text-fk-gold transition-colors flex items-center space-x-1"
                title="User Account"
              >
                <User className="w-5 h-5" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-xl rounded-none py-2 text-xs z-50 animate-fade-in">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-100 font-semibold text-neutral-900 truncate">
                        {user.name}
                        <span className="block text-[10px] text-neutral-400 font-normal uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 font-medium"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                      >
                        My Orders & Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-100 text-neutral-500">
                        Welcome to Fatima Khan
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 font-semibold text-neutral-800 hover:bg-neutral-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-neutral-600 hover:bg-neutral-50"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Flyout Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-fk-gold transition-colors relative flex items-center"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="ml-1 text-xs font-semibold">({totalItems})</span>
            </button>

            {/* WhatsApp Direct Chat */}
            <a
              href="https://wa.me/923033333705?text=Hello%20Fatima%20Khan%20Official,%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-green-600 transition-colors hidden sm:block"
              title="Direct WhatsApp Inquiry"
            >
              <MessageCircle className="w-5 h-5 text-neutral-800 hover:text-green-600 transition-colors" />
            </a>
          </div>
        </div>

        {/* 3. Search Bar Expansion Drawer */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-neutral-100 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection, dresses, silk kaftans, formals..."
                className="w-full text-sm border-b border-neutral-400 py-1.5 px-2 focus:outline-none focus:border-black placeholder:text-neutral-400 font-light"
                autoFocus
              />
              <button
                type="submit"
                className="ml-3 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 bg-neutral-900 text-white hover:bg-black transition"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* 4. Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center space-x-5 xl:space-x-7 py-3 border-t border-neutral-100">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.sublinks && setActiveDropdown(link.name)}
              onMouseLeave={() => link.sublinks && setActiveDropdown(null)}
            >
              <Link
                to={link.path}
                className="relative py-1 text-[12px] uppercase tracking-wider text-neutral-700 hover:text-black font-medium transition-colors flex items-center space-x-1"
              >
                {link.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] text-red-600 font-semibold tracking-normal whitespace-nowrap">
                    {link.badge}
                  </span>
                )}
                <span>{link.name}</span>
                {link.sublinks && <ChevronDown className="w-3 h-3 text-neutral-400" />}
              </Link>

              {/* Mega Dropdown menu */}
              {link.sublinks && activeDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-fade-in">
                  {link.sublinks.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className="block px-5 py-2.5 text-xs text-neutral-700 hover:text-black hover:bg-neutral-50 tracking-wide border-b border-neutral-50 last:border-none"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 5. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <span className="font-serif text-lg tracking-widest uppercase">FATIMA KHAN</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-600 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Currency Selector for Mobile */}
              <div className="my-4 p-2.5 bg-neutral-50 rounded flex items-center justify-between text-xs">
                <span className="text-neutral-500 uppercase tracking-wider font-medium">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent font-semibold uppercase tracking-wider text-black border-none text-xs focus:ring-0"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (Rs)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col divide-y divide-neutral-100">
                {navLinks.map((link) => (
                  <div key={link.name} className="py-2.5">
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-xs uppercase tracking-wider font-medium text-neutral-800"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[10px] text-red-600 font-semibold">{link.badge}</span>
                      )}
                    </Link>
                    {link.sublinks && (
                      <div className="pl-3 pt-2 space-y-2">
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-[11px] text-neutral-500 hover:text-black"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 text-xs">
              <a
                href="https://wa.me/923033333705"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-green-600 text-white font-medium uppercase tracking-wider rounded text-center mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-black text-fk-gold font-semibold uppercase tracking-wider mb-2"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
