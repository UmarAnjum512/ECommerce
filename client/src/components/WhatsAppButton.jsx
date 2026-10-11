import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs bg-white border border-neutral-200 shadow-2xl p-4 rounded-sm text-xs animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <span className="font-serif font-semibold text-neutral-900">Mirha Fashion Concierge</span>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-neutral-600 my-2 leading-relaxed font-light">
            Welcome to Mirha Fashion. Connect directly with our couture styling consultant for custom sizing, bridal orders, or immediate assistance.
          </p>
          <a
            href="https://wa.me/923172043468?text=Hello%20Mirha%20Fashion,%20I%20would%20like%20to%20inquire%20about%20your%20collection"
            target="_blank"
            rel="noreferrer"
            className="block text-center py-2 bg-green-600 hover:bg-green-700 text-white font-medium uppercase tracking-wider rounded transition"
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-3 md:px-4 md:py-3 rounded-full shadow-2xl transition transform hover:scale-105"
        title="Chat with Mirha Fashion on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider">
          Chat With Us
        </span>
      </button>
    </div>
  );
}
