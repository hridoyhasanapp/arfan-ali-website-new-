/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [news, setNews] = useState<NewsReport[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);

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

    // Support #admin URL route to auto-open admin panel
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white" id="main-portfolio-wrapper">
      <Navbar activeSection={activeSection} onOpenAdmin={() => setIsAdminOpen(true)} settings={settings} />
      
      <main className="flex-grow">
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
      </main>

      <Footer settings={settings} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Overlay Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', ' '); // clear hash
            }
          }}
          onRefreshPortfolio={fetchAllContent}
        />
      )}
    </div>
  );
}
