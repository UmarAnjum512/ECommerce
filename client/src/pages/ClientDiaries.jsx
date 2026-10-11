import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Heart } from 'lucide-react';

const DIARIES = [
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0006067_nadine_1000.jpeg',
    client: 'Alizeh Shah in Nadine Formal Angharka',
    occasion: 'Lahore Wedding Soirée',
  },
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0006143_zarminay_1000.jpeg',
    client: 'Sana Javed in Zarminay Fusion Jacket',
    occasion: 'Karachi Fashion Week',
  },
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0010448_midnight-kaftan_1000.jpeg',
    client: 'Momina Mustehsan in Midnight Kaftan',
    occasion: 'Eid Celebrations in Islamabad',
  },
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0008317_seashell-pearl_1000.jpeg',
    client: 'Maya Ali in Seashell Pearl Ensemble',
    occasion: 'Festive Evening Reception',
  },
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0008248_shahnoor_1000.jpeg',
    client: 'Kinza Hashmi in Shahnoor Angharka',
    occasion: 'Sangeet Festivities',
  },
  {
    image: 'https://www.fatimakhanofficial.com/images/thumbs/0008331_gulnar_1000.jpeg',
    client: 'Hania Aamir in Gulnar Regal Set',
    occasion: 'Mehendi Ceremony',
  },
];

export default function ClientDiaries() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium block mb-1">
            Real Moments & Celebrations
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-neutral-900 font-normal">
            CLIENT DIARIES
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-2 max-w-md mx-auto">
            Graceful women around the globe adorned in timeless Fatima Khan Couture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DIARIES.map((item, idx) => (
            <div key={idx} className="group flex flex-col bg-neutral-50 border border-neutral-200 overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.client}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href="https://www.instagram.com/fatimakhanfashion/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-serif text-sm font-medium text-neutral-900 mb-1">{item.client}</h3>
                <p className="text-[11px] text-neutral-500 font-light uppercase tracking-wider">{item.occasion}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-neutral-900 text-white text-center">
          <h3 className="font-serif text-xl uppercase tracking-widest mb-2 font-normal">Share Your Moment</h3>
          <p className="text-xs text-neutral-300 font-light max-w-md mx-auto mb-4">
            Tag <span className="font-mono text-fk-gold">@fatimakhanfashion</span> on Instagram to be featured in our Client Diaries editorial.
          </p>
          <a
            href="https://www.instagram.com/fatimakhanfashion/"
            target="_blank"
            rel="noreferrer"
            className="inline-block py-2.5 px-6 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition"
          >
            Visit Our Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
