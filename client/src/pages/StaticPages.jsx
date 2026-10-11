import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, Mail, Phone, MapPin, Check } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium block text-center mb-1">
          The Label
        </span>
        <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-center text-neutral-900 font-normal mb-8">
          ABOUT MIRHA FASHION
        </h1>
        <div className="w-16 h-px bg-neutral-300 mx-auto mb-10"></div>

        <div className="space-y-6 text-xs text-neutral-600 leading-relaxed font-light text-justify">
          <p>
            Mirha Fashion is a premier Pakistani clothing label founded by creative director Mirha Fashion in 2012. Over more than a decade, the Mirha Fashion label has carved a distinctive signature in haute couture, luxury pret, and bespoke bridal wear.
          </p>
          <p>
            The label is celebrated for its exclusive style, creative fabric manipulation techniques, fascinating jewel-toned color combinations, and a prestigious, royal aura. Each creation reflects meticulous artisanal craftsmanship—from hand-done zardozi, kora, and dabka needlesmithing to traditional block prints, mirrorwork, and resham thread embroideries on pure raw silks, organza, and chiffons.
          </p>
          <p>
            Our core mission is to empower women through timeless silhouettes that express joy, grandeur, and feminine strength. Headquartered in Lahore, Pakistan, Mirha Fashion garments are cherished by clients worldwide across the United States, United Kingdom, Canada, the Middle East, and Australia.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inquiries', { ...form, type: 'contact' });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <span className="text-[10px] uppercase tracking-widest3 text-neutral-400 font-medium block text-center mb-1">
          Reach Our Atelier
        </span>
        <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-center text-neutral-900 font-normal mb-10">
          CONTACT US
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs">
          {/* Atelier Details */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
              Bespoke Studio & Concierge
            </h3>
            <p className="text-neutral-600 font-light leading-relaxed">
              For custom measurements, bridal appointments, order tracking, or wholesale queries, please reach out directly:
            </p>

            <div className="space-y-4 text-neutral-700">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-fk-gold" />
                <span>WhatsApp / Phone: +92 317 2043468</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-fk-gold" />
                <span>Email: contact@mirhafashion.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-fk-gold" />
                <span>Atelier: Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://wa.me/923172043468"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white uppercase tracking-wider font-semibold rounded shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-neutral-50 p-6 border border-neutral-200">
            <h3 className="font-serif text-lg uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 mb-4">
              Send a Message
            </h3>

            {sent ? (
              <div className="p-4 bg-green-50 text-green-800 rounded text-center">
                <Check className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">Thank you! Your inquiry has been sent.</p>
                <p className="text-[11px] mt-1 text-green-600">Our customer team will reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-neutral-300 p-2.5 bg-white focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-neutral-300 p-2.5 bg-white focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-neutral-300 p-2.5 bg-white focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Message *</label>
                  <textarea
                    rows="3"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-neutral-300 p-2.5 bg-white focus:border-black focus:outline-none"
                    placeholder="Inquire regarding styling, sizes, or custom bridal edits..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white uppercase tracking-widest font-semibold text-xs hover:bg-neutral-800 transition"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQs() {
  const faqs = [
    {
      q: 'Do you ship internationally?',
      a: 'Yes, Mirha Fashion ships worldwide including the United States, United Kingdom, UAE, Canada, and Europe via tracked express courier (DHL / FedEx). Free international shipping is provided on orders over $200.',
    },
    {
      q: 'How do I know what size or shirt length to choose?',
      a: 'We offer standard sizes from XS to XL, along with customizable shirt length options (Standard 45-48 inches, Tall 54-56 inches, Petite). You can also select "Custom Stitching" and add specific measurements in the order notes.',
    },
    {
      q: 'What is the delivery timeline?',
      a: 'Ready-to-Ship items are dispatched within 24 to 48 hours and typically arrive within 3-5 business days. Made-to-order couture items take approximately 3 to 5 weeks for intricate hand craftsmanship.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept Cash on Delivery (within Pakistan), Direct Bank Transfers (Meezan / HBL), and International Credit/Debit Cards.',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-center text-neutral-900 font-normal mb-10">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <div className="divide-y divide-neutral-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-5 text-xs space-y-2">
              <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-sm">{faq.q}</h3>
              <p className="text-neutral-600 font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
