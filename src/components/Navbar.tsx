/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Globe, Award, MessageSquare, BookOpen, Newspaper, Lock } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onOpenAdmin: () => void;
  settings?: any;
}

export default function Navbar({ activeSection, onOpenAdmin, settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'আমার সম্পর্কে', href: '#about', icon: BookOpen },
    { label: 'বর্তমান কর্মক্ষেত্র', href: '#current', icon: Award },
    { label: 'সংবাদ প্রতিবেদন', href: '#news', icon: Newspaper },
    { label: 'কাজের অভিজ্ঞতা', href: '#experience', icon: Globe },
    { label: 'যোগাযোগ', href: '#contact', icon: MessageSquare },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of sticky navbar
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

  const whatsappRaw = settings?.whatsappNumber || '০১৩২৮-৩২০৭৬৮';
  const bnToEnDigits = (str: string) => {
    const map: { [key: string]: string } = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '-': ''
    };
    return str.split('').map(c => map[c] !== undefined ? map[c] : c).join('');
  };
  const waEnNumber = bnToEnDigits(whatsappRaw);
  const waLink = `https://wa.me/88${waEnNumber}`;

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-3'
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo/Name */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#root')}
          className="flex items-center space-x-2 text-lg lg:text-xl font-bold tracking-tight text-blue-950 transition duration-300 hover:text-blue-700 whitespace-nowrap"
          id="navbar-logo"
        >
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="w-8 h-8 rounded-full object-cover mr-1.5 border border-blue-200" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <span className="bg-blue-900 text-white p-1.5 rounded-lg text-xs mr-1.5 font-mono">AA</span>
          )}
          <span>{settings?.heroTitle || 'আরফান আলী'}</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" id="navbar-desktop-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-blue-900 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="hidden xl:inline-block w-3.5 h-3.5 opacity-70" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2.5 whitespace-nowrap" id="navbar-desktop-action">
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1 bg-gray-50 text-blue-900 border border-blue-200 hover:bg-blue-100 px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg text-[11px] xl:text-xs font-bold transition cursor-pointer shadow-sm whitespace-nowrap"
            title="অ্যাডমিন ড্যাশবোর্ড"
          >
            <Lock className="w-3 h-3 text-blue-800" />
            <span>অ্যাডমিন লগইন</span>
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg text-[11px] xl:text-xs shadow-sm hover:shadow transition duration-200 whitespace-nowrap"
          >
            <Phone className="w-3 h-3" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg focus:outline-none transition-all"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6 text-blue-900" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-x-0 top-[65px] bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`flex items-center space-x-3 p-3 rounded-lg text-base font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span>{item.label}</span>
              </a>
            );
          })}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            <button
              onClick={() => { setIsOpen(false); onOpenAdmin(); }}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition text-sm cursor-pointer"
            >
              <Lock className="w-4 h-4 text-blue-800" />
              <span>অ্যাডমিন ড্যাশবোর্ড</span>
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow transition"
            >
              <Phone className="w-5 h-5" />
              <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
