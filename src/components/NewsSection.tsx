/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, X, ArrowRight, BookOpen, Share2, MapPin, Tag } from 'lucide-react';
import { MOCK_NEWS_REPORTS } from '../data';
import { NewsReport } from '../types';

export default function NewsSection({ news }: { news?: NewsReport[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [activeReport, setActiveReport] = useState<NewsReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['সব', 'শিক্ষা', 'উন্নয়ন', 'মানবিক', 'ক্যাম্পাস', 'স্থানীয় খবর'];

  const activeNewsFeed = news && news.length > 0 ? news : MOCK_NEWS_REPORTS;

  // Filter & Search Logic
  const filteredReports = useMemo(() => {
    return activeNewsFeed.filter((report) => {
      const matchesCategory = selectedCategory === 'সব' || report.category === selectedCategory;
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.fullContent.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, activeNewsFeed]);

  const handleShare = (id: string, title: string) => {
    // Simulated copy link
    const url = `${window.location.origin}/#news/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="news" className="py-20 px-4 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 inline-block relative pb-4">
            সংবাদ প্রতিবেদনসমূহ
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-600 rounded-full" />
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            শেরপুর জেলা থেকে আমার প্রেরিত ও প্রকাশিত সাম্প্রতিক সংবাদসমূহের সংগ্রহশালা।
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-blue-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="সংবাদ খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* News Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Category Badge & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg">
                      <Tag className="w-3 h-3" />
                      <span>{report.category}</span>
                    </span>
                    <div className="flex items-center text-gray-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3
                    onClick={() => setActiveReport(report)}
                    className="text-xl font-extrabold text-gray-900 group-hover:text-blue-900 transition-colors duration-200 cursor-pointer line-clamp-2 leading-snug mb-3"
                  >
                    {report.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-3 leading-relaxed mb-4">
                    {report.summary}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/40">
                  <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {report.source}
                  </span>
                  
                  <div className="flex items-center space-x-4">
                    {/* Share icon */}
                    <button
                      onClick={() => handleShare(report.id, report.title)}
                      className="text-gray-400 hover:text-blue-600 transition duration-150 relative"
                      title="লিঙ্ক কপি করুন"
                    >
                      <Share2 className="w-4 h-4" />
                      {copiedId === report.id && (
                        <span className="absolute bottom-6 right-0 bg-blue-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                          কপি হয়েছে!
                        </span>
                      )}
                    </button>

                    {/* View Details button */}
                    <button
                      onClick={() => setActiveReport(report)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-950 hover:text-blue-700 transition"
                    >
                      <span>বিস্তারিত পড়ুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">দুঃখিত, কোনো সংবাদ প্রতিবেদন পাওয়া যায়নি।</p>
            <p className="text-gray-400 text-sm mt-1">অনুগ্রহ করে অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন।</p>
          </div>
        )}

        {/* Full Article Modal Overlay */}
        {activeReport && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
              
              {/* Sticky Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded">
                  {activeReport.category}
                </span>
                <button
                  onClick={() => setActiveReport(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-400 mb-4">
                  <div className="flex items-center text-blue-800 font-bold">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span>শেরপুর জেলা প্রতিনিধি</span>
                  </div>
                  <div>•</div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>{activeReport.date}</span>
                  </div>
                  <div>•</div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>পড়ার সময়: {activeReport.readTime}</span>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug mb-6">
                  {activeReport.title}
                </h1>

                {/* Reporter Credit Banner */}
                <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">সংবাদদাতা:</span>
                    <strong className="text-sm font-bold text-blue-950">আরফান আলী</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">প্রকাশক:</span>
                    <span className="text-xs font-bold text-blue-800 font-mono">{activeReport.source}</span>
                  </div>
                </div>

                {/* Detailed News Paragraphs */}
                <div className="prose prose-blue max-w-none text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
                  {activeReport.fullContent}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                <span className="text-xs text-gray-500 font-bold">সর্বস্বত্ব সংরক্ষিত © আরফান আলী</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleShare(activeReport.id, activeReport.title)}
                    className="flex items-center space-x-1.5 text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl shadow-sm transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>শেয়ার লিঙ্ক</span>
                  </button>
                  <button
                    onClick={() => setActiveReport(null)}
                    className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
