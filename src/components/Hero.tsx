/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Newspaper, MapPin, Calendar, ArrowUpRight, MessageSquare, Award, Users, BookOpen } from 'lucide-react';

export default function Hero({ settings }: { settings?: any }) {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white overflow-hidden px-4"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="lg:w-3/5 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center space-x-2 bg-blue-600/30 text-blue-200 text-sm px-4 py-1.5 rounded-full uppercase tracking-wider font-bold mb-6 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>পেশাদার সাংবাদিক</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight leading-none text-white">
            {settings?.heroTitle || 'আরফান আলী'}
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100/90 font-medium max-w-2xl mb-6 leading-relaxed">
            {settings?.heroSubtitle || 'শেরপুর জেলা প্রতিনিধি ও প্রতিষ্ঠাতা সভাপতি, শেরপুর সরকারি কলেজ সাংবাদিক সমিতি।'}
          </p>

          <p className="text-base sm:text-lg text-blue-200/80 max-w-xl mb-8 leading-relaxed">
            {settings?.heroDescription || '২০২০ সাল থেকে নির্ভরযোগ্য, সত্য ও নিরপেক্ষ সংবাদ পরিবেশনে অগ্রগামী। শিক্ষা, উন্নয়ন এবং মানবাধিকার বিষয়ক সংবাদ সংগ্রহ ও উপস্থাপনে প্রতিশ্রুতিবদ্ধ।'}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="flex items-center space-x-2 bg-white text-blue-950 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              <MessageSquare className="w-5 h-5 text-blue-900" />
              <span>যোগাযোগ করুন</span>
            </a>
            <a
              href="#news"
              onClick={(e) => handleScrollTo(e, '#news')}
              className="flex items-center space-x-2 bg-blue-800/80 text-white border border-blue-700 hover:bg-blue-800 hover:border-blue-600 font-bold px-6 py-3 rounded-xl transition transform hover:-translate-y-0.5 duration-200"
            >
              <Newspaper className="w-5 h-5" />
              <span>প্রকাশিত সংবাদসমূহ</span>
            </a>
          </div>

          {/* Core Badges */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-blue-200/70">
            <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>শেরপুর জেলা প্রতিনিধি</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>২০২০ থেকে নিয়োজিত</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>১ম মার্চ ২০২৫ থেকে দ্য ডেইলি ক্যাম্পাস</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card / Profile Mockup */}
        <div className="lg:w-2/5 flex justify-center w-full">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Ambient Circle Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full opacity-20 blur-2xl animate-pulse" />
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full opacity-10 animate-spin-slow" />
            
            {/* Visual Portrait Card */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between p-6 backdrop-blur-md">
              {/* Card Header decoration */}
              <div className="flex justify-between items-start">
                <div className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 text-blue-200 font-extrabold border border-blue-500/20 bg-blue-500/10 rounded-full">
                  পেশাদার পরিচিতি
                </div>
                <Newspaper className="w-4 h-4 text-blue-400" />
              </div>

              {/* Graphic Icon Area representing Journalist */}
              <div className="flex flex-col items-center justify-center py-4 text-blue-100">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-800 to-indigo-950 flex items-center justify-center shadow-lg border border-white/20 mb-4 overflow-hidden relative group">
                  {settings?.logoUrl ? (
                    <img 
                      src={settings.logoUrl} 
                      alt={settings?.heroTitle || 'আরফান আলী'} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                      <span className="text-2xl font-black font-mono tracking-wider">AA</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">{settings?.heroTitle || 'আরফান আলী'}</h3>
                <span className="text-xs text-blue-300 font-medium mt-1">শেরপুর জেলা প্রতিনিধি ও সাংবাদিক</span>
              </div>

              {/* Card Footer Info */}
              <div className="border-t border-white/10 pt-3 text-center text-[10px] text-blue-200/70 font-semibold tracking-wide">
                শেরপুর সরকারি কলেজ সাংবাদিক সমিতি
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Counter Section (Bento Grid Style) */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10 px-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono mb-1">০৫+</span>
          <span className="text-xs sm:text-sm text-blue-200 font-semibold">বছরের অভিজ্ঞতা</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono mb-1">৫০০+</span>
          <span className="text-xs sm:text-sm text-blue-200 font-semibold">প্রকাশিত সংবাদ প্রতিবেদন</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono mb-1">১০+</span>
          <span className="text-xs sm:text-sm text-blue-200 font-semibold">জাতীয় ও আঞ্চলিক গণমাধ্যম</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono mb-1">১টি</span>
          <span className="text-xs sm:text-sm text-blue-200 font-semibold">সাংবাদিক সমিতির প্রতিষ্ঠাতা</span>
        </div>
      </div>
    </section>
  );
}
