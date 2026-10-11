import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Image as ImageIcon,
  Mail,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 text-center shadow-xl">
          <ShieldCheck className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="font-serif text-2xl uppercase tracking-wider mb-2">Admin Access Required</h2>
          <p className="text-xs text-neutral-500 mb-6">
            You must be authenticated with administrative privileges to view the Fatima Khan management panel.
          </p>
          <button
            onClick={() => navigate('/login', { state: { from: '/admin' } })}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Collections', path: '/admin/collections', icon: FolderTree },
    { name: 'Banners & Sliders', path: '/admin/banners', icon: ImageIcon },
    { name: 'Subscribers & Inquiries', path: '/admin/inquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row text-neutral-800">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-neutral-900 text-white flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-800">
            <Link to="/" className="block">
              <span className="font-serif text-xl tracking-widest uppercase block text-white font-normal">
                FATIMA KHAN
              </span>
              <span className="text-[9px] tracking-widest3 uppercase text-fk-gold block -mt-0.5">
                ADMIN CONSOLE
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-3 font-medium tracking-wider uppercase transition rounded ${
                    isActive
                      ? 'bg-neutral-800 text-fk-gold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-neutral-500">Live</span>
          </Link>

          <div className="px-3 py-2 flex items-center justify-between bg-neutral-800/40 rounded">
            <div>
              <p className="font-semibold text-white truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] text-neutral-400">Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-neutral-400 hover:text-red-400 p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-neutral-200 py-4 px-6 md:px-8 flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-wider uppercase text-neutral-900 font-medium">
            Management Portal
          </h1>
          <div className="text-xs text-neutral-500">
            Store Status: <span className="text-green-600 font-semibold">Online & Connected</span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
