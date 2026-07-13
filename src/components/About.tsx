/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Target, Heart, Scale } from 'lucide-react';

export default function About({ settings }: { settings?: any }) {
  const values = [
    {
      icon: ShieldCheck,
      title: 'বস্তুনিষ্ঠতা ও সত্যতা',
      desc: 'সংবাদের নির্ভরযোগ্যতা রক্ষায় যেকোনো মূল্যে সত্য ও বাস্তবভিত্তিক তথ্য উপস্থাপনে অবিচল।'
    },
    {
      icon: Scale,
      title: 'নিরপেক্ষতা',
      desc: 'যেকোনো ব্যক্তিগত, রাজনৈতিক বা সামাজিক প্রভাবমুক্ত থেকে সত্যের পক্ষে সংবাদ পরিবেশন।'
    },
    {
      icon: Target,
      title: 'দায়িত্বশীলতা',
      desc: 'সমাজে ইতিবাচক পরিবর্তন আনতে প্রান্তিক মানুষের অধিকার ও কণ্ঠস্বর মূলধারায় তুলে ধরা।'
    },
    {
      icon: Heart,
      title: 'তরুণদের উদ্বুদ্ধকরণ',
      desc: 'সুস্থ সাংবাদিকতা চর্চার মাধ্যমে তরুণদের মেধা ও নৈতিকতা বিকাশে নেতৃত্ব দেওয়া।'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 inline-block relative pb-4">
            আমার সম্পর্কে
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-600 rounded-full" />
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            ২০২০ সাল থেকে সত্য ও নিষ্ঠার সাথে গণমাধ্যম ও সংবাদ সেবায় নিয়োজিত একনিষ্ঠ সাংবাদিক।
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Description */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              সত্যের সন্ধানে ও ন্যায়ের পক্ষে প্রতিনিয়ত কলম সৈনিক হিসেবে কাজ করে যাচ্ছি
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {settings?.aboutText1 || (
                <>
                  আমি <strong className="text-blue-950 font-bold">আরফান আলী</strong>। ২০২০ সালের শেষের দিকে অনলাইন নিউজ পোর্টালে কাজের মধ্য দিয়ে আমার সাংবাদিকতা জীবনের যাত্রা শুরু হয়। এরপর ক্রমান্বয়ে দেশের মূলধারার বেশ কয়েকটি প্রিন্ট ও অনলাইন গণমাধ্যমে অত্যন্ত নিষ্ঠার সাথে কাজ করে আসছি।
                </>
              )}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {settings?.aboutText2 || (
                <>
                  বর্তমানে শিক্ষাবান্ধব দেশের এক নাম্বার গণমাধ্যম হিসেবে পরিচিত <strong className="text-blue-700 font-bold">"দ্য ডেইলি ক্যাম্পাস"</strong>-এর সাথে যুক্ত আছি। সাংবাদিকতার পাশাপাশি তরুণদের সুস্থ ও ইতিবাচক সাংবাদিকতায় উদ্বুদ্ধ করতে আমি নেতৃত্ব দিচ্ছি বিভিন্ন ছাত্রসংগঠন ও সাংবাদিক সমিতির।
                </>
              )}
            </p>

            {/* Quote Block */}
            <div className="border-l-4 border-blue-600 bg-blue-50/60 p-6 rounded-r-xl">
              <p className="italic text-blue-950 font-medium text-lg leading-relaxed">
                "{settings?.aboutQuote || 'সাংবাদিকতা কেবল একটি পেশা নয়, এটি সমাজ পরিবর্তনের এক মহৎ হাতিয়ার। নিরপেক্ষ সংবাদ পরিবেশন ও সমাজ সংস্কারের দায়িত্ব নিয়েই আমি প্রতিটি দিন কাজ করি।'}"
              </p>
              <span className="block mt-2 text-sm font-bold text-blue-800">— {settings?.heroTitle || 'আরফান আলী'}</span>
            </div>
          </div>

          {/* Core Values Bento Grid */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50/80 hover:bg-blue-50/40 p-5 rounded-2xl border border-gray-100 transition duration-300 flex flex-col items-start"
                >
                  <div className="bg-blue-100 text-blue-900 p-2.5 rounded-xl mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{val.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
