/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, Shield, Lock } from 'lucide-react';

export default function Footer({ settings, onOpenAdmin }: { settings?: any; onOpenAdmin: () => void }) {
  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-black text-gray-500 py-12 border-t border-gray-900 relative">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding & Subtitle */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-white font-black text-lg mb-1">
            <Shield className="w-5 h-5 text-blue-500" />
            <span>{settings?.heroTitle || 'আরফান আলী'}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {settings?.heroSubtitle || 'শেরপুর জেলা প্রতিনিধি ও প্রতিষ্ঠাতা সভাপতি, শেরপুর সরকারি কলেজ সাংবাদিক সমিতি।'}
          </p>
        </div>

        {/* Copyright Line */}
        <div className="text-center text-xs text-gray-600 md:order-last flex flex-col items-center md:items-end">
          <p>সর্বস্বত্ব সংরক্ষিত © ২০২৬ {settings?.heroTitle || 'আরফান আলী'}।</p>
          <p className="text-[11px] text-gray-500 font-semibold mt-1">Developed by <span className="text-blue-500 hover:text-blue-400 transition">Hridoy Hasan</span></p>
          <div className="mt-1.5 flex items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className="text-gray-500 hover:text-blue-400 transition flex items-center space-x-1 font-bold text-xs cursor-pointer bg-gray-900/60 px-2 py-1 rounded border border-gray-800/80 hover:border-blue-900/40"
            >
              <Lock className="w-3 h-3 text-blue-500" />
              <span>অ্যাডমিন লগইন (Admin Login)</span>
            </button>
            <span className="text-gray-800">•</span>
            <p className="font-mono text-[10px] text-gray-700">DESIGNED FOR TRUTH & INTEGRITY</p>
          </div>
        </div>

        {/* Back to top button */}
        <button
          onClick={handleScrollToTop}
          className="p-3 bg-gray-900 hover:bg-blue-900 hover:text-white rounded-full transition group"
          title="উপরে যান"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>

      </div>
    </footer>
  );
}
