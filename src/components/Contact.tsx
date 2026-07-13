/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Facebook, Send, CheckCircle, Trash2, Inbox, AlertCircle } from 'lucide-react';
import { ContactMessage } from '../types';

export default function Contact({ settings }: { settings?: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Storage for submitted messages
  const [storedMessages, setStoredMessages] = useState<ContactMessage[]>([]);
  const [showInbox, setShowInbox] = useState(false);

  // Load sent messages from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem('arfan_ali_messages');
      if (data) {
        setStoredMessages(JSON.parse(data));
      }
    } catch (e) {
      console.error('Error parsing local messages', e);
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic validation
    if (!name.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('বার্তাটি অন্তত ১০টি বর্ণের হতে হবে।');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Also update local copy for user's personal feedback list
        const localMsg: ContactMessage = data.message;
        const updated = [localMsg, ...storedMessages];
        setStoredMessages(updated);
        try {
          localStorage.setItem('arfan_ali_messages', JSON.stringify(updated));
        } catch (err) {
          console.error('Error saving message to storage', err);
        }

        // Clear input fields
        setName('');
        setEmail('');
        setMessage('');
        setShowSuccess(true);

        // Hide success notification after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setErrorMsg(data.error || 'বার্তা পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে যোগাযোগ করা যাচ্ছে না। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearInbox = () => {
    if (window.confirm('আপনি কি সব জমা দেওয়া বার্তা ডিলিট করতে চান?')) {
      setStoredMessages([]);
      localStorage.removeItem('arfan_ali_messages');
    }
  };

  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = storedMessages.filter((m) => m.id !== id);
    setStoredMessages(filtered);
    localStorage.setItem('arfan_ali_messages', JSON.stringify(filtered));
  };

  const whatsappRaw = settings?.whatsappNumber || '০১৩২৮-৩২০৭৬৮';
  // convert Bengali digits to English for link
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
    <section id="contact" className="py-20 bg-blue-950 text-white scroll-mt-16 px-4 relative">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white inline-block relative pb-4">
            আমার সাথে যোগাযোগ
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-500 rounded-full" />
          </h2>
          <p className="text-blue-200/60 mt-4 max-w-lg mx-auto">
            যেকোনো সংবাদের তথ্য, মতামত অথবা পেশাদার প্রয়োজনে নিচের যেকোনো মাধ্যমে সরাসরি আমার সাথে যোগাযোগ করতে পারেন।
          </p>
        </div>

        {/* Info & Form Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Contact Card */}
            <div className="bg-white/5 border border-white/10 hover:border-blue-500/30 p-6 rounded-2xl flex items-center space-x-5 transition duration-300">
              <div className="bg-blue-600/30 text-blue-300 p-4 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-blue-300/60 text-xs font-bold uppercase tracking-wider">ইমেইল ঠিকানা</p>
                <a
                  href={`mailto:${settings?.emailAddress || 'arfanali606034@gmail.com'}`}
                  className="text-lg font-bold text-white hover:text-blue-300 transition block truncate"
                >
                  {settings?.emailAddress || 'arfanali606034@gmail.com'}
                </a>
              </div>
            </div>

            {/* WhatsApp Contact Card */}
            <div className="bg-white/5 border border-white/10 hover:border-emerald-500/30 p-6 rounded-2xl flex items-center space-x-5 transition duration-300">
              <div className="bg-emerald-600/30 text-emerald-400 p-4 rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-wider">হোয়াটসঅ্যাপ নম্বর</p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white hover:text-emerald-400 transition block"
                >
                  {settings?.whatsappNumber || '০১৩২৮-৩২০৭৬৮'}
                </a>
              </div>
            </div>

            {/* Facebook Contact Card */}
            <div className="bg-white/5 border border-white/10 hover:border-blue-500/30 p-6 rounded-2xl flex items-center space-x-5 transition duration-300">
              <div className="bg-blue-600/30 text-blue-300 p-4 rounded-xl">
                <Facebook className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-blue-300/60 text-xs font-bold uppercase tracking-wider">ফেসবুক প্রোফাইল</p>
                <a
                  href={settings?.facebookLink || 'https://www.facebook.com/arfan.ali.01328320768'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white hover:text-blue-300 transition block truncate"
                >
                  {settings?.heroTitle || 'আরফান আলী'} (Facebook)
                </a>
              </div>
            </div>

            {/* Inbox Access Button representing local submissions */}
            {storedMessages.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => setShowInbox(!showInbox)}
                  className="w-full flex items-center justify-between bg-blue-900/30 border border-blue-500/20 hover:bg-blue-900/50 text-blue-200 text-sm font-bold p-4 rounded-xl transition"
                >
                  <div className="flex items-center space-x-2">
                    <Inbox className="w-4 h-4" />
                    <span>আপনার প্রেরিত বার্তা সমূহ ({storedMessages.length})</span>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono">
                    {showInbox ? 'বন্ধ করুন' : 'দেখুন'}
                  </span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Contact form / Inbox list */}
          <div className="lg:col-span-7">
            {showInbox && storedMessages.length > 0 ? (
              /* Local Inbox Viewer */
              <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <Inbox className="w-5 h-5 text-blue-900" />
                    <h3 className="font-extrabold text-lg text-blue-950">বার্তা সংগ্রহশালা (স্থানীয় স্টোরেজ)</h3>
                  </div>
                  <button
                    onClick={handleClearInbox}
                    className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব মুছুন</span>
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                  {storedMessages.map((msg) => (
                    <div key={msg.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <strong className="block text-sm font-bold text-gray-900">{msg.name}</strong>
                          <span className="text-xs font-medium text-gray-400">{msg.email}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap mt-2">
                        {msg.message}
                      </p>
                      
                      {/* Delete item button */}
                      <button
                        onClick={(e) => handleDeleteSingle(msg.id, e)}
                        className="absolute bottom-3 right-3 text-gray-400 hover:text-rose-600 transition opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50"
                        title="এই বার্তাটি মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowInbox(false)}
                    className="text-xs font-bold text-blue-900 hover:underline"
                  >
                    নতুন বার্তা লিখুন
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl relative">
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="bg-rose-900/30 border border-rose-500/20 text-rose-200 text-sm font-semibold p-4 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-2">
                      আপনার নাম <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name-input"
                      placeholder="যেমন: আরশাদ হাসান"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-base text-white placeholder-blue-300/30 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email-input" className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-2">
                      আপনার ইমেইল <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email-input"
                      placeholder="যেমন: example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-base text-white placeholder-blue-300/30 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message-input" className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-2">
                      আপনার বার্তা <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="message-input"
                      rows={4}
                      placeholder="মতামত বা তথ্য এখানে লিখুন..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-base text-white placeholder-blue-300/30 focus:outline-none focus:ring-1 focus:ring-blue-500 transition resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>বার্তা পাঠান</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Successful Submit Toast banner inside Card */}
                {showSuccess && (
                  <div className="absolute inset-0 bg-blue-900 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ease-in-out">
                    <CheckCircle className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black mb-2 text-white">ধন্যবাদ!</h3>
                    <p className="text-blue-100 leading-relaxed max-w-sm mb-6 text-sm sm:text-base">
                      আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আরফান আলী শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                    </p>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl transition"
                    >
                      আরেকটি বার্তা পাঠান
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
