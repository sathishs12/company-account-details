'use client';

import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className="bg-[#02343F] text-[#F0EDCC] px-6 py-4 mt-auto">
      <div className="max-w-screen-xl mx-auto text-center">
        {/* Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center mx-auto gap-2 text-[#F0EDCC] hover:text-white transition"
        >
          <span className="text-sm font-medium">
            {expanded ? 'Hide Details' : 'Show Footer Info'}
          </span>
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>

        {/* Expandable Content */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 text-left">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-3">About CBU-Bank</h3>
              <p className="text-sm leading-relaxed">
                CBU-Bank is committed to providing secure and seamless banking services.
                We prioritize innovation, trust, and customer satisfaction.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="/services" className="hover:underline">Services</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
                <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-3">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" /> +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5" /> support@cbu-bank.com
                </li>
                <li className="flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5" /> www.cbu-bank.com
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom line */}
        <div className="mt-6 border-t border-[#F0EDCC]/20 pt-4 text-sm">
          <p>© {currentYear} CBU-Bank. All rights reserved.</p>
          {/* <p className="mt-1 text-xs text-[#F0EDCC]/70">
            Designed & developed with ❤️ using React & TailwindCSS
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
