/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CurrentRoles from './components/CurrentRoles';
import NewsSection from './components/NewsSection';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { NewsReport, SettingsType } from './types';

// Standalone elegant header for individual sub-pages
const PageHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-gradient-to-b from-blue-950 to-blue-900 text-white pt-28 pb-14 px-4 text-center border-b border-blue-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-blue-200/70 mt-3 text-sm sm:text-base max-w-lg mx-auto font-medium">{description}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [news, setNews] = useState<NewsReport[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all site content dynamically
  const fetchAllContent = async () => {
    try {
      // Fetch settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      // Fetch news articles
      const newsRes = await fetch('/api/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }
    } catch (e) {
      console.error('Failed to load portfolio dynamic content:', e);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  // Sync scroll positions to set active section only when on "/" (Home route)
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'current', 'news', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 120; // offset for sticky header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <div className="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white" id="main-portfolio-wrapper">
      <Navbar activeSection={activeSection} onOpenAdmin={() => navigate('/admin')} settings={settings} />
      
      <main className="flex-grow">
        <Routes>
          {/* Main Integrated Home Portfolio Screen */}
          <Route
            path="/"
            element={
              <>
                {/* Hero Banner Section */}
                <Hero settings={settings} />
                
                {/* About Section */}
                <About settings={settings} />
                
                {/* Current Working Roles */}
                <CurrentRoles />

                {/* Dynamic & Interactive News Feed Dashboard */}
                <NewsSection news={news} />
                
                {/* Interactive Experience Timeline */}
                <Timeline />
                
                {/* Contact Form with Local Archive */}
                <Contact settings={settings} />
              </>
            }
          />

          {/* Dedicated Sub-Pages */}
          <Route
            path="/about"
            element={
              <>
                <PageHeader title="আমার সম্পর্কে" description="পেশাদারী সাংবাদিকতা ও আমার ব্যক্তিগত জীবনের মূল আদর্শ এবং মূল্যবোধ।" />
                <About settings={settings} />
              </>
            }
          />

          <Route
            path="/roles"
            element={
              <>
                <PageHeader title="বর্তমান কর্মক্ষেত্র" description="দেশের বিভিন্ন জাতীয় ও অনলাইন গণমাধ্যমে আমার কাজের বিবরণী।" />
                <CurrentRoles />
              </>
            }
          />

          <Route
            path="/news"
            element={
              <>
                <PageHeader title="সংবাদ প্রতিবেদন সমূহ" description="শিক্ষা, ক্যাম্পাস এবং সমসাময়িক গুরুত্বপূর্ণ বিষয় নিয়ে প্রকাশিত সংবাদের তালিকা।" />
                <NewsSection news={news} />
              </>
            }
          />

          <Route
            path="/experience"
            element={
              <>
                <PageHeader title="সাংবাদিকতার অভিজ্ঞতা" description="সাংবাদিকতা ক্যারিয়ারে বিভিন্ন সময় বিভিন্ন সংগঠনে আমার নেতৃত্বের ইতিহাস।" />
                <Timeline />
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <PageHeader title="যোগাযোগ করুন" description="যে কোনো জরুরি তথ্য বা সংবাদ শেয়ার করতে নিচের ফর্ম ব্যবহার করে বার্তা পাঠান।" />
                <Contact settings={settings} />
              </>
            }
          />

          {/* Dedicated Fullscreen Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminPanel
                onClose={() => navigate('/')}
                onRefreshPortfolio={fetchAllContent}
              />
            }
          />
        </Routes>
      </main>

      <Footer settings={settings} onOpenAdmin={() => navigate('/admin')} />
    </div>
  );
}
