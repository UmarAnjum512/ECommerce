import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Instagram, Facebook, Youtube, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post('/api/inquiries', { email, type: 'newsletter' });
      setSubmitted(true);
      setMsg('Thank you for subscribing to Mirha Fashion.');
      setEmail('');
    } catch (err) {
      setMsg('Thank you for subscribing!');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-12 border-b border-neutral-800 text-xs">
          {/* Column 1: About Us */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-medium border-b border-neutral-800 pb-2 inline-block">
              ABOUT US
            </h4>
            <p className="text-neutral-400 leading-relaxed font-light">
              Mirha Fashion is a luxury clothing label founded by Mirha Fashion in 2012. The Mirha Fashion label is best known for their exclusive style, creative fabric techniques, fascinating colors, and prestigious look.
            </p>
            <p className="text-neutral-400 leading-relaxed font-light">
              Our aim is to provide latest fashionable trends and exclusive clothing which express the emotion of joy and happiness.
            </p>
          </div>

          {/* Column 2: Quick Links & Social */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-medium border-b border-neutral-800 pb-2 inline-block">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 font-light">
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition">FAQs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shop?readyToShip=true" className="hover:text-white transition">Ready to Ship Edit</Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="block uppercase tracking-wider text-[10px] text-neutral-500 mb-2">
                Follow Our Journey
              </span>
              <div className="flex space-x-4 text-neutral-400">
                <a
                  href="https://www.instagram.com/mirhafashion/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition p-1"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/mirhafashion"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition p-1"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCo4x9FmK0p_JEAu7AnQL0Zg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition p-1"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-medium border-b border-neutral-800 pb-2 inline-block">
              NEWSLETTER
            </h4>
            <p className="text-neutral-400 leading-relaxed font-light">
              Subscribe to stay updated on our latest collections, runway previews, and exclusive VIP events.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition flex items-center justify-center flex-shrink-0"
                >
                  {loading ? '...' : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {submitted && (
                <div className="flex items-center space-x-1 text-green-400 text-[11px] pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{msg}</span>
                </div>
              )}
            </form>

            <div className="pt-3 text-[11px] text-neutral-500">
              WhatsApp Concierge: <span className="text-neutral-300 font-mono">+92 317 2043468</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-light">
          <p>© 2026 MIRHA FASHION. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span>Pakistani Luxury Couture</span>
            <span>•</span>
            <span>Worldwide Express Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
