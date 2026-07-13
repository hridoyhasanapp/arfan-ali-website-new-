/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Newspaper, MapPin, Users, Calendar, ArrowUpRight } from 'lucide-react';

export default function CurrentRoles() {
  const roles = [
    {
      icon: Newspaper,
      title: 'দ্য ডেইলি ক্যাম্পাস',
      subtitle: '১ মার্চ, ২০২৫ থেকে কর্মরত',
      badge: 'শীর্ষস্থানীয় শিক্ষা গণমাধ্যম',
      desc: 'শিক্ষা বান্ধব দেশের এক নাম্বার অনলাইন গণমাধ্যম দ্য ডেইলি ক্যাম্পাসে সরাসরি যুক্ত হয়ে নির্ভরযোগ্য সংবাদ এবং বিশেষ প্রতিবেদন পরিবেশন করে আসছি।',
      color: 'border-blue-600',
      iconBg: 'bg-blue-50 text-blue-600',
      link: 'https://thedailycampus.com'
    },
    {
      icon: MapPin,
      title: 'শেরপুর জেলা প্রতিনিধি',
      subtitle: 'জাতীয় দৈনিক ও অনলাইন পোর্টাল',
      badge: 'মাঠপর্যায়ের রিপোর্টিং',
      desc: 'জাতীয় দৈনিক "দেশ বর্তমান", জাতীয় দৈনিক "দেশ বার্তা" এবং অনলাইন নিউজ পোর্টাল "তরঙ্গ নিউজ"-এ জেলা প্রতিনিধি হিসেবে অত্যন্ত আস্থার সাথে নিয়োজিত আছি।',
      color: 'border-amber-500',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Users,
      title: 'প্রতিষ্ঠাতা সভাপতি',
      subtitle: 'শেরপুর সরকারি কলেজ সাংবাদিক সমিতি',
      badge: 'নেতৃত্ব ও দক্ষতা উন্নয়ন',
      desc: 'শিক্ষার্থীদের মাঝে বস্তুনিষ্ঠ সাংবাদিকতার চর্চা গড়ে তোলার পাশাপাশি সংবাদ সংগ্রহ, ফিচার লিখন ও গণমাধ্যমের কলাকৌশল শেখার মূল কারিগর ও উদ্যোক্তা।',
      color: 'border-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
    }
  ];

  return (
    <section id="current" className="py-20 px-4 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 inline-block relative pb-4">
            বর্তমান কর্মক্ষেত্র
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-600 rounded-full" />
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            দেশের প্রথম সারির গণমাধ্যমসমূহ এবং ছাত্র সংগঠনে আমার বর্তমান পেশাদারী অবস্থান।
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div
                key={idx}
                className={`bg-white p-8 rounded-2xl shadow-sm border-t-4 ${role.color} hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex justify-between items-center mb-6">
                    <div className={`p-3.5 rounded-xl ${role.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {role.badge}
                    </span>
                  </div>

                  {/* Header Text */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{role.title}</h3>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{role.subtitle}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {role.desc}
                  </p>
                </div>

                {/* Footer Link / Decorative Element */}
                {role.link ? (
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-sm font-bold text-blue-900 hover:text-blue-700 transition"
                    >
                      <span>ওয়েবসাইট পরিদর্শন করুন</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="mt-8 pt-4 border-t border-gray-50 text-xs text-gray-400 font-medium">
                    শেরপুর জেলা শাখা • শেরপুর সরকারি কলেজ
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
