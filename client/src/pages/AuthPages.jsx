import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from || (isAdmin ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@fatimakhan.com');
      setPassword('admin123');
    } else {
      setEmail('customer@fatimakhan.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-neutral-200 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium">Welcome Back</span>
          <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900 font-normal mt-1">
            Sign In
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-neutral-600">Password</label>
              <span className="text-[11px] text-neutral-400 hover:text-black cursor-pointer">Forgot?</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins Helper */}
        <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2">
            Quick Fill Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 bg-neutral-900 text-fk-gold font-medium rounded flex items-center justify-center space-x-1 hover:bg-black transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              onClick={() => handleQuickFill('customer')}
              className="py-1.5 px-2 bg-neutral-100 text-neutral-800 font-medium rounded flex items-center justify-center space-x-1 hover:bg-neutral-200 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          New to Fatima Khan Official?{' '}
          <Link to="/register" className="font-semibold text-neutral-900 underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password, phone);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-neutral-200 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium">Create Account</span>
          <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900 font-normal mt-1">
            Register
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-600 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="Ayesha Khan"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">Phone Number / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="+92 300 1234567"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-neutral-900 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
