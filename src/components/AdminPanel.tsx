/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Plus,
  Edit,
  Trash2,
  Settings,
  MessageSquare,
  Newspaper,
  LogOut,
  Database,
  Save,
  FileText,
  CheckCircle,
  TrendingUp,
  X,
  RefreshCw,
  Phone,
  Link,
  Mail,
  AlertCircle
} from 'lucide-react';
import { NewsReport, ContactMessage, SettingsType } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshPortfolio: () => void;
}

export default function AdminPanel({ onClose, onRefreshPortfolio }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab: 'news' | 'messages' | 'settings' | 'admins'
  const [activeTab, setActiveTab] = useState<'news' | 'messages' | 'settings' | 'admins'>('news');

  // Backend state
  const [newsList, setNewsList] = useState<NewsReport[]>([]);
  const [messageList, setMessageList] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [dbMode, setDbMode] = useState<'MongoDB' | 'Local Storage'>('Local Storage');
  const [adminList, setAdminList] = useState<{ username: string; createdAt: string }[]>([]);

  // Admin account creation state
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminError, setNewAdminError] = useState('');
  const [newAdminSuccess, setNewAdminSuccess] = useState('');

  // Password change state
  const [changePasswordUsername, setChangePasswordUsername] = useState('');
  const [changePasswordNew, setChangePasswordNew] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Loaders and alerts
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // News Editor State
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [newsId, setNewsId] = useState('');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('শিক্ষা');
  const [newsSource, setNewsSource] = useState('দ্য ডেইলি ক্যাম্পাস');
  const [newsContent, setNewsContent] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsUrl, setNewsUrl] = useState('');

  // Settings Editor State
  const [settingsForm, setSettingsForm] = useState<SettingsType>({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    aboutText1: '',
    aboutText2: '',
    aboutQuote: '',
    whatsappNumber: '',
    facebookLink: '',
    emailAddress: '',
    logoUrl: ''
  });

  // Verify authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('arfan_admin_token');
    if (token) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
            loadDashboardData();
          } else {
            localStorage.removeItem('arfan_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('arfan_admin_token');
        });
    }
  }, []);

  // Load Dashboard Data from express API
  const loadDashboardData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('arfan_admin_token') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // 1. Fetch News
      const newsRes = await fetch('/api/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsList(newsData);
      }

      // 2. Fetch Messages
      const msgRes = await fetch('/api/messages', { headers });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessageList(msgData);
      }

      // 3. Fetch Settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setSettingsForm(settingsData);
      }

      // 4. Try to determine if we are in real MongoDB
      try {
        const dbStatusRes = await fetch('/api/db-status');
        if (dbStatusRes.ok) {
          const dbStatusData = await dbStatusRes.json();
          setDbMode(dbStatusData.mode);
        }
      } catch (dbErr) {
        console.error('Failed to load db status:', dbErr);
      }

      // 5. Fetch Admin list (Protected)
      try {
        const adminsRes = await fetch('/api/admins', { headers });
        if (adminsRes.ok) {
          const adminsData = await adminsRes.json();
          setAdminList(adminsData);
          if (adminsData.length > 0 && !changePasswordUsername) {
            setChangePasswordUsername(adminsData[0].username);
          }
        }
      } catch (adminErr) {
        console.error('Failed to load admins:', adminErr);
      }

    } catch (err) {
      console.error('Failed to load admin panel data:', err);
      showError('সার্ভার থেকে ডেটা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(''), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('অনুগ্রহ করে ব্যবহারকারীর নাম এবং পাসওয়ার্ড দুটোই প্রদান করুন।');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('arfan_admin_token', data.token);
        setIsAuthenticated(true);
        loadDashboardData();
        onRefreshPortfolio();
      } else {
        setLoginError(data.error || 'ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড!');
      }
    } catch (err) {
      setLoginError('সার্ভারে যোগাযোগ করা যাচ্ছে না। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('arfan_admin_token');
    setIsAuthenticated(false);
    onClose();
  };

  // News CRUD Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      showError('শিরোনাম এবং সংবাদ বিবরণী অবশ্যই পূরণ করতে হবে।');
      return;
    }

    const token = localStorage.getItem('arfan_admin_token') || '';
    const articlePayload = {
      id: newsId || undefined, // undefined will auto-generate in server
      title: newsTitle.trim(),
      category: newsCategory,
      source: newsSource.trim(),
      fullContent: newsContent.trim(),
      summary: newsSummary.trim() || undefined,
      date: newsDate.trim() || undefined,
      url: newsUrl.trim() || undefined
    };

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articlePayload)
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(newsId ? 'সংবাদটি সফলভাবে আপডেট করা হয়েছে।' : 'নতুন সংবাদ সফলভাবে প্রকাশিত হয়েছে।');
        resetNewsForm();
        loadDashboardData();
        onRefreshPortfolio();
      } else {
        showError(data.error || 'সংবাদ সংরক্ষণ করা যায়নি।');
      }
    } catch (err) {
      showError('সার্ভার ত্রুটি। আবার চেষ্টা করুন।');
    }
  };

  const handleEditNewsClick = (article: NewsReport) => {
    setNewsId(article.id);
    setNewsTitle(article.title);
    setNewsCategory(article.category);
    setNewsSource(article.source);
    setNewsContent(article.fullContent);
    setNewsSummary(article.summary);
    setNewsDate(article.date);
    setNewsUrl(article.url || '');
    setIsEditingNews(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবেই এই সংবাদটি ডিলিট করতে চান?')) return;

    const token = localStorage.getItem('arfan_admin_token') || '';
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showSuccess('সংবাদটি সফলভাবে ডিলিট করা হয়েছে।');
        loadDashboardData();
        onRefreshPortfolio();
      } else {
        const data = await res.json();
        showError(data.error || 'সংবাদ ডিলিট করা সম্ভব হয়নি।');
      }
    } catch (err) {
      showError('সংবাদ ডিলিট করার অনুরোধ ব্যর্থ হয়েছে।');
    }
  };

  const resetNewsForm = () => {
    setNewsId('');
    setNewsTitle('');
    setNewsCategory('শিক্ষা');
    setNewsSource('দ্য ডেইলি ক্যাম্পাস');
    setNewsContent('');
    setNewsSummary('');
    setNewsDate('');
    setNewsUrl('');
    setIsEditingNews(false);
  };

  // Contact Messages Handlers
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('এই বার্তাটি ডিলিট করতে চান?')) return;

    const token = localStorage.getItem('arfan_admin_token') || '';
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showSuccess('বার্তাটি সফলভাবে ইনবক্স থেকে মুছে ফেলা হয়েছে।');
        loadDashboardData();
      } else {
        const data = await res.json();
        showError(data.error || 'বার্তা ডিলিট করা সম্ভব হয়নি।');
      }
    } catch (err) {
      showError('অনুরোধ ব্যর্থ হয়েছে।');
    }
  };

  // Portfolio Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('arfan_admin_token') || '';

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess('আপনার পোর্টফোলিও বিবরণী ও সেটিংস সফলভাবে আপডেট করা হয়েছে।');
        loadDashboardData();
        onRefreshPortfolio();
      } else {
        showError(data.error || 'সেটিংস আপডেট করা যায়নি।');
      }
    } catch (err) {
      showError('সেটিংস আপডেট করতে ব্যর্থ। সার্ভার সংযোগ পরীক্ষা করুন।');
    }
  };

  // Admin account action handlers
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewAdminError('');
    setNewAdminSuccess('');
    
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setNewAdminError('সবগুলো ফিল্ড পূরণ করুন।');
      return;
    }

    const token = localStorage.getItem('arfan_admin_token') || '';
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newAdminUsername, password: newAdminPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setNewAdminSuccess('অ্যাডমিন সফলভাবে তৈরি হয়েছে!');
        setNewAdminUsername('');
        setNewAdminPassword('');
        loadDashboardData();
      } else {
        setNewAdminError(data.error || 'অ্যাডমিন তৈরি করতে ব্যর্থ।');
      }
    } catch (err) {
      setNewAdminError('সার্ভারে যোগাযোগ করা যাচ্ছে না।');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (!changePasswordUsername || !changePasswordNew.trim()) {
      setChangePasswordError('সবগুলো ফিল্ড পূরণ করুন।');
      return;
    }

    const token = localStorage.getItem('arfan_admin_token') || '';
    try {
      const res = await fetch('/api/admins/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: changePasswordUsername, newPassword: changePasswordNew })
      });
      const data = await res.json();
      if (res.ok) {
        setChangePasswordSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
        setChangePasswordNew('');
        loadDashboardData();
      } else {
        setChangePasswordError(data.error || 'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ।');
      }
    } catch (err) {
      setChangePasswordError('সার্ভারে যোগাযোগ করা যাচ্ছে না।');
    }
  };

  const handleDeleteAdminClick = async (targetUser: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবেই "${targetUser}" অ্যাকাউন্টটি ডিলিট করতে চান?`)) return;

    const token = localStorage.getItem('arfan_admin_token') || '';
    try {
      const res = await fetch(`/api/admins/${targetUser}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess('অ্যাডমিন অ্যাকাউন্টটি ডিলিট করা হয়েছে।');
        loadDashboardData();
      } else {
        showError(data.error || 'ডিলিট করতে ব্যর্থ।');
      }
    } catch (err) {
      showError('সার্ভারে যোগাযোগ করা যাচ্ছে না।');
    }
  };

  // Render Login overlay if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-blue-950/95 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-white text-gray-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Login Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 text-white text-center">
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Lock className="w-8 h-8 text-blue-200" />
            </div>
            <h2 className="text-2xl font-black">অ্যাডমিন প্যানেল লগইন</h2>
            <p className="text-blue-200 text-xs font-semibold mt-1">পেশাদার সাংবাদিক আরফান আলীর ডিজিটাল ড্যাশবোর্ড</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {/* Credentials Info Help Box */}
            <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3.5 rounded-xl space-y-1 font-medium">
              <p className="font-bold text-blue-900">🔑 লগইন বিবরণী (নিরাপদ ডিফল্ট):</p>
              <p>ইউজারনেম: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono select-all">admin</code></p>
              <p>পাসওয়ার্ড: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono select-all">securepassword123</code></p>
            </div>

            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl flex items-center space-x-2 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ইউজারনেম</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl focus:outline-none transition font-semibold"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl focus:outline-none transition"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>

            <div className="text-center pt-2 text-xs text-gray-400 font-medium">
              Railway হোস্টিংয়ে MongoDB ডেটাবেজ সংযোগ সক্রিয় থাকবে।
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col overflow-hidden">
      {/* Admin Top Header Navigation bar */}
      <header className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl text-xs font-black font-mono">
            ADMIN
          </div>
          <div>
            <h1 className="text-xl font-black">আরফান আলী | ড্যাশবোর্ড</h1>
            <p className="text-xs text-blue-200/60 font-semibold">কন্টেন্ট ম্যানেজমেন্ট ও লাইভ ডেটাবেজ সেটিংস</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* DB Indicator badge */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 text-xs font-bold">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200">ডেটাবেজ:</span>
            <span className={dbMode === 'MongoDB' ? 'text-emerald-400' : 'text-amber-400'}>
              {dbMode}
            </span>
          </div>

          <button
            onClick={loadDashboardData}
            className="p-2 hover:bg-white/10 rounded-lg text-white transition"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">লগআউট</span>
          </button>

          <button
            onClick={onClose}
            className="bg-white/5 p-2 rounded-lg text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Admin Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Drawer / Sidebar list */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-row md:flex-col p-4 gap-2 shrink-0 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => { setActiveTab('news'); resetNewsForm(); }}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === 'news'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Newspaper className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">সংবাদ আর্টিকেল</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2.5 px-4 py-3 rounded-xl text-sm font-bold transition relative ${
              activeTab === 'messages'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">বার্তা ইনবক্স</span>
            {messageList.length > 0 && (
              <span className="absolute top-2 right-2 md:relative md:top-0 md:right-0 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {messageList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">পোর্টফোলিও সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === 'admins'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">অ্যাডমিন অ্যাকাউন্টস</span>
          </button>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          
          {/* Action Feedback Alerts */}
          {actionSuccess && (
            <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white border border-emerald-800 p-4 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold">{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="fixed bottom-6 right-6 z-50 bg-rose-900 text-white border border-rose-800 p-4 rounded-xl shadow-2xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span className="text-sm font-bold">{actionError}</span>
            </div>
          )}

          {/* STATS OVERVIEW HEADER CARDS (Bento block) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="bg-blue-50 text-blue-900 p-3 rounded-xl shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block">মোট প্রকাশিত সংবাদ</span>
                <strong className="text-2xl font-black text-gray-900 font-mono">{newsList.length} টি</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block">ইনবক্সের বার্তা</span>
                <strong className="text-2xl font-black text-gray-900 font-mono">{messageList.length} টি</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block">সিস্টেম স্ট্যাটাস</span>
                <span className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>লাইভ সক্রিয়</span>
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block">ডেটাবেজ টাইপ</span>
                <span className="text-sm font-black text-indigo-950 font-mono mt-1 block">
                  {dbMode}
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: NEWS ARTICLE MANAGER */}
          {activeTab === 'news' && (
            <div className="space-y-8">
              {/* Write/Edit Section Toggle */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-blue-950">
                  {isEditingNews ? 'সংবাদ সংশোধন করুন' : 'নতুন সংবাদ আর্টিকেল প্রকাশ'}
                </h2>
                {isEditingNews && (
                  <button
                    onClick={resetNewsForm}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg"
                  >
                    নতুন সংবাদ লেখার ফরমে ফিরুন
                  </button>
                )}
              </div>

              {/* News Form Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSaveNews} className="space-y-6">
                  <div className="grid md:grid-cols-12 gap-6">
                    {/* Title */}
                    <div className="md:col-span-8">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">সংবাদের মূল শিরোনাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: শেরপুরে কৃষকদের পাশে স্বেচ্ছাসেবী সংগঠন..."
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-base font-bold"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ক্যাটাগরি</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-bold"
                      >
                        <option value="শিক্ষা">শিক্ষা</option>
                        <option value="উন্নয়ন">উন্নয়ন</option>
                        <option value="মানবিক">মানবিক</option>
                        <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                        <option value="স্থানীয় খবর">স্থানীয় খবর</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Source */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">সংবাদের প্রকাশক উৎস / মাধ্যম</label>
                      <input
                        type="text"
                        placeholder="যেমন: দ্য ডেইলি ক্যাম্পাস"
                        value={newsSource}
                        onChange={(e) => setNewsSource(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>

                    {/* Custom Date (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">প্রকাশের তারিখ (ঐচ্ছিক - ফাঁকা রাখলে আজকের তারিখ বসবে)</label>
                      <input
                        type="text"
                        placeholder="যেমন: ১২ জুলাই, ২০২৬"
                        value={newsDate}
                        onChange={(e) => setNewsDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                      />
                    </div>

                    {/* News Link/URL (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">সংবাদের মূল লিংক / ইউআরএল (ঐচ্ছিক)</label>
                      <input
                        type="url"
                        placeholder="যেমন: https://thedailycampus.com/..."
                        value={newsUrl}
                        onChange={(e) => setNewsUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Summary / Lead info */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">সংবাদ সারসংক্ষেপ (লিড প্যারা - ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="সংবাদের সংক্ষেপ বিবরণী যা হোমপেজ কার্ডে দেখানো হবে..."
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-3 focus:outline-none text-sm leading-relaxed"
                    />
                  </div>

                  {/* Full body */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">মূল সংবাদ বিবরণী</label>
                    <textarea
                      rows={6}
                      placeholder="বিস্তারিত সংবাদের অনুচ্ছেদ সমূহ এখানে লিখুন..."
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-3 focus:outline-none text-base leading-relaxed"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow transition"
                    >
                      <Save className="w-5 h-5" />
                      <span>{newsId ? 'আর্টিকেল আপডেট করুন' : 'সংবাদ প্রকাশ করুন'}</span>
                    </button>
                    {(newsId || newsTitle || newsContent) && (
                      <button
                        type="button"
                        onClick={resetNewsForm}
                        className="text-sm font-bold text-gray-500 hover:bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl transition"
                      >
                        ফাঁকা করুন
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Published News Articles List */}
              <div>
                <h3 className="text-xl font-extrabold text-blue-950 mb-4">প্রকাশিত সংবাদসমূহের তালিকা ({newsList.length})</h3>
                {newsList.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                    {newsList.map((news) => (
                      <div key={news.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded">
                              {news.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 font-mono">
                              {news.source}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] font-semibold text-gray-400">
                              {news.date}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-gray-900 line-clamp-1">{news.title}</h4>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleEditNewsClick(news)}
                            className="flex items-center space-x-1 bg-blue-50 text-blue-900 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>সম্পাদনা</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNews(news.id)}
                            className="flex items-center space-x-1 bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">কোনো সংবাদ আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INBOX MESSAGES VIEW */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-blue-950">পাঠকদের প্রেরিত বার্তা তালিকা ({messageList.length})</h2>
              
              {messageList.length > 0 ? (
                <div className="grid gap-6">
                  {messageList.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3 mb-4">
                        <div>
                          <strong className="text-base font-bold text-gray-900">{msg.name}</strong>
                          <span className="text-xs text-gray-500 block sm:inline sm:ml-2">({msg.email})</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded self-start sm:self-auto">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs font-bold text-blue-900 hover:underline"
                        >
                          সরাসরি ইমেইলে উত্তর দিন
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">ইনবক্স সম্পূর্ণ খালি!</p>
                  <p className="text-sm text-gray-400 mt-1">পাঠকদের প্রেরিত বার্তা এখানে দৃশ্যমান হবে।</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PORTFOLIO MAIN SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-blue-950">পোর্টফোলিও বিবরণী ও সেটিংস সম্পাদনা</h2>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Logo/Profile Image Upload */}
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/60">
                    <h3 className="text-sm font-bold text-blue-900 border-b border-blue-100/60 pb-2 mb-4 flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-700" />
                      <span>প্রোফাইল ছবি / লোগো আপলোড (Profile Logo Image)</span>
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {settingsForm.logoUrl ? (
                          <img src={settingsForm.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">নতুন ছবি সিলেক্ট করুন (জেপিজি/পিএনজি, সর্বোচ্চ ২ মেগাবাইট)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                showError('ছবির সাইজ ২ মেগাবাইটের কম হতে হবে।');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setSettingsForm({ ...settingsForm, logoUrl: event.target.result as string });
                                  showSuccess('ছবিটি সফলভাবে আপলোড করা হয়েছে! পরিবর্তন নিশ্চিত করতে নিচে "পরিবর্তন সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                        />
                        <p className="text-[11px] text-gray-400 font-medium">নোট: আপনার আপলোডকৃত ছবিটি ন্যাভিগেশন বার এবং হোমপেজের ব্যানার কার্ডে প্রদর্শিত হবে।</p>
                        {settingsForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                            className="text-xs font-extrabold text-rose-600 hover:text-rose-800 transition"
                          >
                            ছবি মুছে ফেলুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hero Information */}
                  <div>
                    <h3 className="text-base font-bold text-blue-900 border-b border-gray-100 pb-2 mb-4">হোমপেজ ব্যানার (Hero Section)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">নাম</label>
                        <input
                          type="text"
                          value={settingsForm.heroTitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">পদবী / সংক্ষিপ্ত পরিচিতি</label>
                        <input
                          type="text"
                          value={settingsForm.heroSubtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none font-semibold"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ব্যানার ভূমিকা (Hero Description)</label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroDescription}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm leading-relaxed"
                        required
                      />
                    </div>
                  </div>

                  {/* About Information */}
                  <div>
                    <h3 className="text-base font-bold text-blue-900 border-b border-gray-100 pb-2 mb-4">আমার সম্পর্কে (About Section)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">পরিচিতি প্যারাগ্রাফ ১</label>
                        <textarea
                          rows={3}
                          value={settingsForm.aboutText1}
                          onChange={(e) => setSettingsForm({ ...settingsForm, aboutText1: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm leading-relaxed"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">পরিচিতি প্যারাগ্রাফ ২</label>
                        <textarea
                          rows={3}
                          value={settingsForm.aboutText2}
                          onChange={(e) => setSettingsForm({ ...settingsForm, aboutText2: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm leading-relaxed"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">অনুপ্রেরণামূলক উক্তি (Quote Box)</label>
                        <textarea
                          rows={2}
                          value={settingsForm.aboutQuote}
                          onChange={(e) => setSettingsForm({ ...settingsForm, aboutQuote: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm italic font-medium leading-relaxed"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Connections */}
                  <div>
                    <h3 className="text-base font-bold text-blue-900 border-b border-gray-100 pb-2 mb-4">যোগাযোগ ও সোশ্যাল লিঙ্ক</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Whatsapp */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>হোয়াটসঅ্যাপ নম্বর</span>
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                          required
                        />
                      </div>

                      {/* Facebook */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                          <Link className="w-3.5 h-3.5 text-blue-600" />
                          <span>ফেসবুক লিঙ্ক</span>
                        </label>
                        <input
                          type="text"
                          value={settingsForm.facebookLink}
                          onChange={(e) => setSettingsForm({ ...settingsForm, facebookLink: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-rose-500" />
                          <span>ইমেইল ঠিকানা</span>
                        </label>
                        <input
                          type="email"
                          value={settingsForm.emailAddress}
                          onChange={(e) => setSettingsForm({ ...settingsForm, emailAddress: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-bold">সংরক্ষণ ক্লিক করলে সরাসরি ডেটাবেজে আপডেট হয়ে যাবে।</p>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow transition"
                    >
                      <Save className="w-5 h-5" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN USERS MANAGER */}
          {activeTab === 'admins' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-blue-950">অ্যাডমিন অ্যাকাউন্টস ব্যবস্থাপনা</h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Add new admin */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-blue-900 flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span>নতুন অ্যাডমিন তৈরি</span>
                  </h3>
                  
                  {newAdminError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold">
                      {newAdminError}
                    </div>
                  )}

                  {newAdminSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-semibold">
                      {newAdminSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ইউজারনেম</label>
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="উদা: arfan_admin"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">পাসওয়ার্ড</label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড লিখুন"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
                    >
                      অ্যাডমিন অ্যাকাউন্ট তৈরি করুন
                    </button>
                  </form>
                </div>

                {/* 2. Change admin password */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-blue-900 flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    <span>পাসওয়ার্ড পরিবর্তন</span>
                  </h3>

                  {changePasswordError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold">
                      {changePasswordError}
                    </div>
                  )}

                  {changePasswordSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-semibold">
                      {changePasswordSuccess}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">অ্যাডমিন ইউজার সিলেক্ট করুন</label>
                      <select
                        value={changePasswordUsername}
                        onChange={(e) => setChangePasswordUsername(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                        required
                      >
                        {adminList.map((admin) => (
                          <option key={admin.username} value={admin.username}>
                            {admin.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">নতুন পাসওয়ার্ড</label>
                      <input
                        type="password"
                        value={changePasswordNew}
                        onChange={(e) => setChangePasswordNew(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-blue-600 rounded-xl px-4 py-2.5 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
                    >
                      নতুন পাসওয়ার্ড আপডেট করুন
                    </button>
                  </form>
                </div>

                {/* 3. Existing Admins list */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-blue-900 flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>বর্তমান অ্যাডমিনদের তালিকা</span>
                  </h3>

                  <div className="space-y-3 divide-y divide-gray-50">
                    {adminList.map((admin, index) => (
                      <div key={admin.username} className={`pt-3 flex items-center justify-between ${index === 0 ? 'pt-0' : ''}`}>
                        <div>
                          <p className="text-sm font-bold text-gray-900 font-mono">{admin.username}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">তৈরি হয়েছে: {admin.createdAt}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAdminClick(admin.username)}
                          disabled={adminList.length <= 1}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 transition disabled:opacity-30 disabled:cursor-not-allowed p-1.5 hover:bg-rose-50 rounded-lg"
                          title="অ্যাডমিন ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-400 font-semibold leading-relaxed pt-2">
                    * নিরাপদে থাকার জন্য সিস্টেমে কমপক্ষে একজন অ্যাডমিন অ্যাকাউন্ট থাকা আবশ্যক।
                  </p>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
