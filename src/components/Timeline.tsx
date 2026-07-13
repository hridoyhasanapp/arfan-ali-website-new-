/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TIMELINE_DATA } from '../data';
import { Calendar, Award, ChevronDown, ChevronUp, Radio, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<string | null>('1'); // Expand first item by default

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <section id="experience" className="py-20 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 inline-block relative pb-4">
            সাংবাদিকতার সুদীর্ঘ পথচলা
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-600 rounded-full" />
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            ২০২০ সালের প্রাথমিক অনলাইন জার্নালিজম থেকে শুরু করে আজকের মূলধারার জাতীয় গণমাধ্যমসমূহ পর্যন্ত আমার অভিজ্ঞতার রূপরেখা।
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative border-l-2 border-blue-200 ml-4 md:ml-32 space-y-8">
          {TIMELINE_DATA.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isLatest = index === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="relative pl-8 md:pl-10 group"
              >
                
                {/* Timeline Circle Node Icon indicator */}
                <span
                  className={`absolute -left-3.5 top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isLatest
                      ? 'bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white border-blue-600 text-blue-600'
                  }`}
                >
                  {isLatest ? (
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </span>

                {/* Desktop Left-Side Period Display (Float layout) */}
                <div className="hidden md:block absolute right-full mr-8 top-1.5 text-right w-24">
                  <span className="text-sm font-bold text-blue-950 block whitespace-nowrap">
                    {item.period}
                  </span>
                  {isLatest && (
                    <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold mt-1 uppercase tracking-wide">
                      <Radio className="w-2.5 h-2.5" />
                      <span>চলতি</span>
                    </span>
                  )}
                </div>

                {/* Main Accordion Card Content */}
                <motion.div
                  onClick={() => toggleExpand(item.id)}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={`bg-white p-6 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                    isExpanded
                      ? 'border-blue-300 shadow-md'
                      : 'border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      {/* Mobile Period Indicator */}
                      <div className="md:hidden flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full">
                          {item.period}
                        </span>
                        {isLatest && (
                          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span>চলতি</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-950 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-blue-800 mt-1">
                        {item.organization}
                      </p>
                    </div>

                    {/* Expand Chevron controls */}
                    <div className="text-gray-400 hover:text-blue-900 p-1 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  {item.highlight && (
                    <div className="mt-3 inline-flex items-center space-x-1 bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.highlight}</span>
                    </div>
                  )}

                  {/* Accordion Expandable Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {item.description}
                          </p>
                          
                          {/* Visual badges of skills practiced during this tenure */}
                          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md">সংবাদ সংগ্রহ</span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md">তদন্তমূলক প্রতিবেদন</span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md">ফিচার ও সাক্ষাৎকার</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
