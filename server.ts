/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

// Load env variables
dotenv.config();

import {
  connectDB,
  getNews,
  saveNewsArticle,
  deleteNewsArticle,
  getMessages,
  saveContactMessage,
  deleteContactMessage,
  getPortfolioSettings,
  updatePortfolioSettings,
  isUsingMongoDB,
  getAdmins,
  createAdmin,
  updateAdminPassword,
  deleteAdmin
} from './server/db';

const app = express();
const PORT = 3000;

// Body parser middleware with higher limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Auth helper credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'securepassword123';
const JWT_SECRET = process.env.JWT_SECRET || 'arfan-ali-portfolio-secret-token-key-2026';

// --- Auth Middleware ---
function authenticateAdmin(req: express.Request & { admin?: any }, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'অননুমোদিত প্রবেশাধিকার। টোকেন অনুপস্থিত।' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'সেশন শেষ বা অবৈধ টোকেন।' });
  }
}

async function startServer() {
  // Connect to Database
  await connectDB();

  // --- API Routes ---

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'ব্যবহারকারীর নাম এবং পাসওয়ার্ড দুটোই প্রদান করুন।' });
    }

    try {
      // 1. Try DB Admin check
      const dbAdmins = await getAdmins();
      const dbAdmin = dbAdmins.find(a => a.username === username);

      if (dbAdmin) {
        const isDbPasswordMatch = await bcryptjs.compare(password, dbAdmin.passwordHash);
        if (isDbPasswordMatch) {
          const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
          return res.json({ success: true, token, username });
        }
      }

      // 2. Fallback check from environment variables (for resilience)
      const isUsernameMatch = username === ADMIN_USERNAME;
      let isPasswordMatch = password === ADMIN_PASSWORD;

      if (isUsernameMatch) {
        if (!isPasswordMatch && ADMIN_PASSWORD.startsWith('$2')) {
          try {
            isPasswordMatch = await bcryptjs.compare(password, ADMIN_PASSWORD);
          } catch (e) {
            console.error('Bcrypt comparison failed', e);
          }
        }
        if (isPasswordMatch) {
          const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
          return res.json({ success: true, token, username });
        }
      }
    } catch (dbErr: any) {
      console.error('Database login lookup failed, trying env fallback:', dbErr);
      // fallback straight to env
      const isUsernameMatch = username === ADMIN_USERNAME;
      const isPasswordMatch = password === ADMIN_PASSWORD;
      if (isUsernameMatch && isPasswordMatch) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ success: true, token, username });
      }
    }

    return res.status(401).json({ error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড!' });
  });

  // Auth: Verify Token
  app.post('/api/auth/verify', (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ valid: false });
    }
    try {
      jwt.verify(token, JWT_SECRET);
      return res.json({ valid: true });
    } catch {
      return res.json({ valid: false });
    }
  });

  // News: Get all news articles
  app.get('/api/news', async (req, res) => {
    try {
      const articles = await getNews();
      res.json(articles);
    } catch (err: any) {
      res.status(500).json({ error: 'নিউজ লোড করতে সমস্যা হয়েছে: ' + err.message });
    }
  });

  // News: Create/Update article (Protected)
  app.post('/api/news', authenticateAdmin, async (req, res) => {
    try {
      const article = req.body;
      if (!article.title || !article.category || !article.fullContent) {
        return res.status(400).json({ error: 'শিরোনাম, ক্যাটাগরি এবং বিস্তারিত অংশ অবশ্যই পূরণ করতে হবে।' });
      }

      // If it doesn't have an ID, generate a new one
      if (!article.id) {
        article.id = `news-${Date.now()}`;
      }

      // Generate summary if missing
      if (!article.summary) {
        article.summary = article.fullContent.slice(0, 150) + '...';
      }

      // Auto set read time if missing
      if (!article.readTime) {
        const wordCount = article.fullContent.split(/\s+/).length;
        const speed = 100; // Bengali words per min approx
        const readMin = Math.ceil(wordCount / speed);
        article.readTime = `${readMin || 1} মিনিট`;
      }

      // Auto set date if missing
      if (!article.date) {
        article.date = new Date().toLocaleDateString('bn-BD', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      }

      const saved = await saveNewsArticle(article);
      res.json({ success: true, article: saved });
    } catch (err: any) {
      res.status(500).json({ error: 'সংবাদ সংরক্ষণ করতে ব্যর্থ: ' + err.message });
    }
  });

  // News: Delete article (Protected)
  app.delete('/api/news/:id', authenticateAdmin, async (req, res) => {
    try {
      const deleted = await deleteNewsArticle(req.params.id);
      if (deleted) {
        res.json({ success: true, message: 'সংবাদটি সফলভাবে ডিলিট করা হয়েছে।' });
      } else {
        res.status(404).json({ error: 'কোনো সংবাদ খুঁজে পাওয়া যায়নি।' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'সংবাদ ডিলিট করতে ব্যর্থ: ' + err.message });
    }
  });

  // Messages: Submit Contact Message (Public)
  app.post('/api/messages', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'সবগুলো ঘর সঠিকভাবে পূরণ করুন।' });
      }

      const newMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleString('bn-BD', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };

      const saved = await saveContactMessage(newMessage);
      res.json({ success: true, message: saved });
    } catch (err: any) {
      res.status(500).json({ error: 'বার্তা পাঠাতে সমস্যা হয়েছে: ' + err.message });
    }
  });

  // Messages: Get all messages (Protected)
  app.get('/api/messages', authenticateAdmin, async (req, res) => {
    try {
      const msgs = await getMessages();
      res.json(msgs);
    } catch (err: any) {
      res.status(500).json({ error: 'বার্তাগুলো লোড করতে ব্যর্থ: ' + err.message });
    }
  });

  // Messages: Delete message (Protected)
  app.delete('/api/messages/:id', authenticateAdmin, async (req, res) => {
    try {
      const deleted = await deleteContactMessage(req.params.id);
      if (deleted) {
        res.json({ success: true, message: 'বার্তাটি ডিলিট করা হয়েছে।' });
      } else {
        res.status(404).json({ error: 'কোনো বার্তা খুঁজে পাওয়া যায়নি।' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'বার্তা ডিলিট করতে ব্যর্থ: ' + err.message });
    }
  });

  // Portfolio Settings: Get
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await getPortfolioSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: 'সেটিংস লোড করা সম্ভব হয়নি: ' + err.message });
    }
  });

  // Database Connection Status Endpoint
  app.get('/api/db-status', (req, res) => {
    res.json({ mode: isUsingMongoDB() ? 'MongoDB' : 'Local Storage' });
  });

  // Portfolio Settings: Save (Protected)
  app.put('/api/settings', authenticateAdmin, async (req, res) => {
    try {
      const settings = req.body;
      const updated = await updatePortfolioSettings(settings);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'সেটিংস আপডেট করতে ব্যর্থ: ' + err.message });
    }
  });

  // --- Admin User Management (Protected) ---
  
  // Get all admins
  app.get('/api/admins', authenticateAdmin, async (req, res) => {
    try {
      const list = await getAdmins();
      // Map to omit hashes for security
      const safeList = list.map(a => ({
        username: a.username,
        createdAt: a.createdAt || 'N/A'
      }));
      res.json(safeList);
    } catch (err: any) {
      res.status(500).json({ error: 'অ্যাডমিনদের তালিকা লোড করতে ব্যর্থ: ' + err.message });
    }
  });

  // Create new admin
  app.post('/api/admins', authenticateAdmin, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।' });
      }

      const trimmedUser = username.trim().toLowerCase();
      if (trimmedUser.length < 3) {
        return res.status(400).json({ error: 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।' });
      }

      const list = await getAdmins();
      const exists = list.some(a => a.username.toLowerCase() === trimmedUser);
      if (exists) {
        return res.status(400).json({ error: 'এই ইউজারনেম দিয়ে ইতিমধ্যেই অ্যাডমিন তৈরি করা আছে।' });
      }

      const passwordHash = await bcryptjs.hash(password, 10);
      const newAdmin = {
        username: trimmedUser,
        passwordHash,
        createdAt: new Date().toLocaleDateString('bn-BD')
      };

      await createAdmin(newAdmin);
      res.json({ success: true, message: 'নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি করা হয়েছে।' });
    } catch (err: any) {
      res.status(500).json({ error: 'অ্যাডমিন তৈরি করতে ব্যর্থ: ' + err.message });
    }
  });

  // Change password for an admin
  app.put('/api/admins/password', authenticateAdmin, async (req, res) => {
    try {
      const { username, newPassword } = req.body;
      if (!username || !newPassword) {
        return res.status(400).json({ error: 'ইউজারনেম এবং নতুন পাসওয়ার্ড অবশ্যই পূরণ করতে হবে।' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      }

      const hash = await bcryptjs.hash(newPassword, 10);
      const updated = await updateAdminPassword(username.trim().toLowerCase(), hash);

      if (updated) {
        res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' });
      } else {
        res.status(404).json({ error: 'কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি।' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ: ' + err.message });
    }
  });

  // Delete an admin
  app.delete('/api/admins/:username', authenticateAdmin, async (req, res) => {
    try {
      const targetUser = req.params.username.toLowerCase().trim();
      
      const list = await getAdmins();
      if (list.length <= 1) {
        return res.status(400).json({ error: 'সিস্টেমে কমপক্ষে একজন অ্যাডমিন থাকা আবশ্যক। আপনি শেষ অ্যাডমিন ডিলিট করতে পারবেন না।' });
      }

      const deleted = await deleteAdmin(targetUser);
      if (deleted) {
        res.json({ success: true, message: 'অ্যাডমিন অ্যাকাউন্টটি সফলভাবে ডিলিট করা হয়েছে।' });
      } else {
        res.status(404).json({ error: 'অ্যাডমিন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'অ্যাডমিন ডিলিট করতে ব্যর্থ: ' + err.message });
    }
  });


  // --- Vite Integration & Static Assets ---

  if (process.env.NODE_ENV !== 'production') {
    // Development Mode: Use Vite's Dev Server as Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve built files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Fatal crash on server start:', error);
  process.exit(1);
});
