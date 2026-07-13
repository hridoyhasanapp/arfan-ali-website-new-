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
  isUsingMongoDB
} from './server/db';

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());

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

    // Direct comparison (for simplicity & config file based workflow) or hashed comparison
    const isUsernameMatch = username === ADMIN_USERNAME;
    let isPasswordMatch = password === ADMIN_PASSWORD;

    // Check if passwords matches (supports plain text for env simplicity or optionally hashed if they want)
    if (!isPasswordMatch && ADMIN_PASSWORD.startsWith('$2')) {
      // It's bcrypt hashed
      try {
        isPasswordMatch = await bcryptjs.compare(password, ADMIN_PASSWORD);
      } catch (e) {
        console.error('Bcrypt comparison failed', e);
      }
    }

    if (isUsernameMatch && isPasswordMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token, username });
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
