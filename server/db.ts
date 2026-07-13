/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// --- Types ---
export interface NewsArticleType {
  id: string;
  title: string;
  category: string;
  date: string;
  source: string;
  summary: string;
  fullContent: string;
  readTime: string;
  url?: string;
}

export interface MessageType {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface SettingsType {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutText1: string;
  aboutText2: string;
  aboutQuote: string;
  whatsappNumber: string;
  facebookLink: string;
  emailAddress: string;
  logoUrl?: string;
}

export interface AdminType {
  username: string;
  passwordHash: string;
  createdAt: string;
}

// Default Data Seeds
const DEFAULT_NEWS: NewsArticleType[] = [
  {
    id: 'news-1',
    title: 'শেরপুরে বন্যা দুর্গতদের পাশে স্বেচ্ছাসেবী সংগঠন, বিতরণ করা হচ্ছে ত্রাণ সামগ্রী',
    category: 'মানবিক',
    date: '১০ জুলাই, ২০২৬',
    source: 'দ্য ডেইলি ক্যাম্পাস',
    summary: 'শেরপুর জেলার ঝিনাইগাতী ও নালিতাবাড়ী উপজেলার বন্যাকবলিত প্রত্যন্ত এলাকার মানুষের পাশে দাঁড়িয়েছে শেরপুর সরকারি কলেজ সাংবাদিক সমিতিসহ বিভিন্ন স্বেচ্ছাসেবী সংগঠন। শুকনো খাবার ও চিকিৎসা সহায়তার মাধ্যমে প্রায় সহস্রাধিক পরিবারকে সাহায্য করা হচ্ছে।',
    fullContent: 'শেরপুর জেলার ঝিনাইগাতী ও নালিতাবাড়ী উপজেলার পাহাড়ি ঢল ও অতিবৃষ্টির কারণে সৃষ্ট বন্যায় ক্ষতিগ্রস্তদের পাশে দাঁড়িয়েছেন স্থানীয় স্বেচ্ছাসেবী ও সামাজিক সংগঠনগুলো। বন্যার পানি উপচে পড়ে নিম্নাঞ্চলের বাড়িঘর তলিয়ে গেছে এবং বিশুদ্ধ পানির তীব্র সংকট দেখা দিয়েছে।\n\nশেরপুর সরকারি কলেজ সাংবাদিক সমিতির প্রতিষ্ঠাতা সভাপতি আরফান আলীর নেতৃত্বে একটি টিম বন্যাকবলিত অঞ্চলগুলো পরিদর্শন করেন এবং শুকনো খাবার, ওরস্যালাইন ও বিশুদ্ধ পানি বিতরণ কার্যক্রম পরিচালনা করেন। আরফান আলী বলেন, "এই সংকটময় মুহূর্তে সকলের সম্মিলিত উদ্যোগ অত্যন্ত প্রয়োজন। আমরা আমাদের জায়গা থেকে সর্বোচ্চ চেষ্টা করছি মানুষের পাশে দাঁড়াতে।" স্থানীয় প্রশাসনও বন্যাকবলিত পরিবারগুলোতে ত্রাণ পৌঁছানোর কাজ করছে।',
    readTime: '৩ মিনিট',
    url: 'https://thedailycampus.com/education/12345/sherpur-flood-relief'
  },
  {
    id: 'news-2',
    title: 'শিক্ষার মান উন্নয়নে শেরপুর সরকারি কলেজে নতুন লাইব্রেরি ভবনের উদ্বোধন',
    category: 'শিক্ষা',
    date: '২৮ জুন, ২০২৬',
    source: 'দ্য ডেইলি ক্যাম্পাস',
    summary: 'শিক্ষার্থীদের জ্ঞান অর্জনের আধুনিক পরিবেশ নিশ্চিত করতে শেরপুর সরকারি কলেজে এক বিশাল লাইব্রেরি ভবনের উদ্বোধন করা হয়েছে। এখানে থাকছে ই-লাইব্রেরি সুবিধা ও প্রায় ১০ হাজার বইয়ের সংগ্রহশালা।',
    fullContent: 'শেরপুর জেলার ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠান শেরপুর সরকারি কলেজে শিক্ষার্থীদের দীর্ঘদিনের দাবি অবশেষে পূরণ হয়েছে। কলেজে একটি আধুনিক সুযোগ-সুবিধাসম্পন্ন নতুন লাইব্রেরি ভবন উদ্বোধন করা হয়েছে।\n\nনতুন এই লাইব্রেরিতে শিক্ষার্থীদের জন্য থাকছে শীতাতপ নিয়ন্ত্রিত পড়ার কক্ষ, দ্রুতগতির ইন্টারনেটসহ কম্পিউটার ব্যবহারের সুবিধা এবং প্রায় দশ হাজার শিক্ষণীয় ও গবেষণামূলক বই। উদ্বোধনী অনুষ্ঠানে কলেজের অধ্যক্ষ মহোদয় বলেন, "এই লাইব্রেরি আমাদের শিক্ষার্থীদের মেধা ও মননশীলতা বৃদ্ধিতে একটি ঐতিহাসিক ভূমিকা পালন করবে।" শেরপুর সরকারি কলেজ সাংবাদিক সমিতি এই কার্যক্রমটিকে স্বাগত জানিয়ে এর সুষ্ঠু ব্যবহারের জন্য আহ্বান জানিয়েছে।',
    readTime: '৪ মিনিট',
    url: 'https://thedailycampus.com/education/12346/sherpur-college-library'
  },
  {
    id: 'news-3',
    title: 'শেরপুরের পর্যটন কেন্দ্র গজনী অবকাশ ও মধুটিলায় পর্যটকদের উপচে পড়া ভিড়',
    category: 'উন্নয়ন',
    date: '১৮ মে, ২০২৬',
    source: 'জাতীয় দৈনিক দেশ বর্তমান',
    summary: 'পাহাড় ও বনের মিতালীতে ঘেরা শেরপুরের গজনী অবকাশ ও মধুটিলা ইকোপার্কে সাপ্তাহিক ছুটির দিনে দেশের বিভিন্ন প্রান্ত থেকে আগত হাজার হাজার পর্যটকের উপচে পড়া ভিড় লক্ষ্য করা গেছে। পর্যটন খাতের উন্নয়নে নতুন অবকাঠামো তৈরি হচ্ছে।',
    fullContent: 'শেরপুর জেলার ঝিনাইগাতী উপজেলার গজনী অবকাশ এবং নালিতাবাড়ীর মধুটিলা ইকোপার্কে পর্যটন মৌসুমে উপচে পড়া ভিড় তৈরি হয়েছে। পাহাড় আর বনের মেলবন্ধন দেখতে ঢাকা, ময়মনসিংহ ও দেশের অন্যান্য জেলা থেকে ভ্রমণপিপাসু মানুষরা ছুটে আসছেন এখানে।\n\nপর্যটকদের নিরাপত্তায় স্থানীয় ট্যুরিস্ট পুলিশ কঠোর নজরদারি রাখছে। পর্যটন শিল্পের উন্নয়নে শেরপুর জেলা প্রশাসন বিভিন্ন উন্নয়ন প্রকল্প হাতে নিয়েছে, যার মধ্যে রয়েছে ঝুলন্ত ব্রিজ সংস্কার, ওয়াচ টাওয়ার নির্মাণ এবং শিশু পার্কের আধুনিকায়ন। এই উন্নয়নের ফলে শেরপুরের অর্থনৈতিক সমৃদ্ধি এবং কর্মসংস্থান আরও বৃদ্ধি পাবে বলে আশা করছেন স্থানীয় ব্যবসায়ী ও বাসিন্দারা।',
    readTime: '৩ মিনিট',
    url: 'https://deshbortoman.com/news/sherpur-tourism-spots'
  }
];

const DEFAULT_SETTINGS: SettingsType = {
  heroTitle: 'আরফান আলী',
  heroSubtitle: 'শেরপুর জেলা প্রতিনিধি ও প্রতিষ্ঠাতা সভাপতি, শেরপুর সরকারি কলেজ সাংবাদিক সমিতি।',
  heroDescription: '২০২০ সাল থেকে নির্ভরযোগ্য, সত্য ও নিরপেক্ষ সংবাদ পরিবেশনে অগ্রগামী। শিক্ষা, উন্নয়ন এবং মানবাধিকার বিষয়ক সংবাদ সংগ্রহ ও উপস্থাপনে প্রতিশ্রুতিবদ্ধ।',
  aboutText1: 'আমি আরফান আলী। ২০২০ সালের শেষের দিকে অনলাইন নিউজ পোর্টালে কাজের মধ্য দিয়ে আমার সাংবাদিকতা জীবনের যাত্রা শুরু হয়। এরপর ক্রমান্বয়ে দেশের মূলধারার বেশ কয়েকটি প্রিন্ট ও অনলাইন গণমাধ্যমে অত্যন্ত নিষ্ঠার সাথে কাজ করে আসছি।',
  aboutText2: 'বর্তমানে শিক্ষাবান্ধব দেশের এক নাম্বার গণমাধ্যম হিসেবে পরিচিত "দ্য ডেইলি ক্যাম্পাস"-এর সাথে যুক্ত আছি। সাংবাদিকতার পাশাপাশি তরুণদের সুস্থ ও ইতিবাচক সাংবাদিকতায় উদ্বুদ্ধ করতে আমি নেতৃত্ব দিচ্ছি বিভিন্ন ছাত্রসংগঠন ও সাংবাদিক সমিতির।',
  aboutQuote: 'সাংবাদিকতা কেবল একটি পেশা নয়, এটি সমাজ পরিবর্তনের এক মহৎ হাতিয়ার। নিরপেক্ষ সংবাদ পরিবেশন ও সমাজ সংস্কারের দায়িত্ব নিয়েই আমি প্রতিটি দিন কাজ করি।',
  whatsappNumber: '০১৩২৮-৩২০৭৬৮',
  facebookLink: 'https://www.facebook.com/arfan.ali.01328320768',
  emailAddress: 'arfanali606034@gmail.com',
  logoUrl: ''
};

// Fallback JSON file path
const FALLBACK_DIR = path.join(process.cwd(), 'src', 'data');
const FALLBACK_FILE_PATH = path.join(FALLBACK_DIR, 'fallback_db.json');

// Interface for Fallback Database
interface FallbackDB {
  news: NewsArticleType[];
  messages: MessageType[];
  settings: SettingsType;
  admins?: AdminType[];
}

// Initialize fallback file
function initFallbackDB(): FallbackDB {
  if (!fs.existsSync(FALLBACK_DIR)) {
    fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  }

  if (fs.existsSync(FALLBACK_FILE_PATH)) {
    try {
      const data = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure properties exist
      return {
        news: parsed.news || DEFAULT_NEWS,
        messages: parsed.messages || [],
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        admins: parsed.admins || [
          {
            username: 'admin',
            passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
            createdAt: new Date().toLocaleDateString('bn-BD')
          }
        ]
      };
    } catch (e) {
      console.error('Failed to read fallback DB, resetting to defaults:', e);
    }
  }

  const initialDB: FallbackDB = {
    news: DEFAULT_NEWS,
    messages: [],
    settings: DEFAULT_SETTINGS,
    admins: [
      {
        username: 'admin',
        passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
        createdAt: new Date().toLocaleDateString('bn-BD')
      }
    ]
  };
  fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(initialDB, null, 2), 'utf-8');
  return initialDB;
}

// State of the fallback database
let fallbackDB: FallbackDB = { news: [], messages: [], settings: DEFAULT_SETTINGS };
let useMongoDB = false;

export function isUsingMongoDB(): boolean {
  return useMongoDB;
}

// Initialize Mongo DB Schemas if URI exists
let NewsModel: mongoose.Model<any>;
let MessageModel: mongoose.Model<any>;
let SettingsModel: mongoose.Model<any>;
let AdminModel: mongoose.Model<any>;

// Safe Lazy Initialization
export async function connectDB() {
  let uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URL || process.env.MONGO_URI;

  // Construct from Railway default individual env variables if single URI is not present
  if (!uri && process.env.MONGOHOST) {
    const user = process.env.MONGOUSER || '';
    const pass = process.env.MONGOPASSWORD || '';
    const host = process.env.MONGOHOST;
    const port = process.env.MONGOPORT || '27017';
    const db = process.env.MONGODATABASE || 'portfolio';
    
    if (user && pass) {
      uri = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=admin`;
    } else {
      uri = `mongodb://${host}:${port}/${db}`;
    }
    console.log(`🔌 Constructed MongoDB connection string from Railway variables: mongodb://***:***@${host}:${port}/${db}`);
  }

  if (!uri || uri.includes('MY_MONGODB_URI') || uri.includes('username:password')) {
    console.warn('⚠️ MONGODB_URI is not set or placeholder. Operating in fallback JSON storage mode.');
    fallbackDB = initFallbackDB();
    useMongoDB = false;
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000 // allow up to 10s for slow cloud connections
      });
      console.log('🔌 Connected to MongoDB successfully.');
    } else {
      console.log(`🔌 Mongoose already in state: ${mongoose.connection.readyState}. Re-asserting MongoDB mode.`);
    }
    useMongoDB = true;
    initMongoModels();
    await seedMongoDatabase();
  } catch (error) {
    console.error('❌ MongoDB Connection failed. Falling back to local JSON storage. Error:', error);
    fallbackDB = initFallbackDB();
    useMongoDB = false;
  }
}

function initMongoModels() {
  // Define Schemas
  const NewsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    source: { type: String, required: true },
    summary: { type: String, required: true },
    fullContent: { type: String, required: true },
    readTime: { type: String, required: true },
    url: { type: String, default: '' }
  });

  const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true }
  });

  const SettingsSchema = new mongoose.Schema({
    heroTitle: { type: String, default: DEFAULT_SETTINGS.heroTitle },
    heroSubtitle: { type: String, default: DEFAULT_SETTINGS.heroSubtitle },
    heroDescription: { type: String, default: DEFAULT_SETTINGS.heroDescription },
    aboutText1: { type: String, default: DEFAULT_SETTINGS.aboutText1 },
    aboutText2: { type: String, default: DEFAULT_SETTINGS.aboutText2 },
    aboutQuote: { type: String, default: DEFAULT_SETTINGS.aboutQuote },
    whatsappNumber: { type: String, default: DEFAULT_SETTINGS.whatsappNumber },
    facebookLink: { type: String, default: DEFAULT_SETTINGS.facebookLink },
    emailAddress: { type: String, default: DEFAULT_SETTINGS.emailAddress },
    logoUrl: { type: String, default: '' }
  });

  const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') }
  });

  // Export Models safely (handling hot reloading compile triggers)
  NewsModel = mongoose.models.News || mongoose.model('News', NewsSchema);
  MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
  SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
  AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
}

async function seedMongoDatabase() {
  try {
    const newsCount = await NewsModel.countDocuments();
    if (newsCount === 0) {
      await NewsModel.insertMany(DEFAULT_NEWS);
      console.log('🌱 Seeded default news articles into MongoDB.');
    }

    const settingsCount = await SettingsModel.countDocuments();
    if (settingsCount === 0) {
      await SettingsModel.create(DEFAULT_SETTINGS);
      console.log('🌱 Seeded default portfolio settings into MongoDB.');
    }

    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      await AdminModel.create({
        username: 'admin',
        passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
        createdAt: new Date().toLocaleDateString('bn-BD')
      });
      console.log('🌱 Seeded default admin into MongoDB.');
    }
  } catch (err) {
    console.error('Failed to seed MongoDB default data:', err);
  }
}

// Helper to save fallback database to disk
function saveFallback() {
  try {
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(fallbackDB, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save fallback DB to file:', err);
  }
}

// --- DB Operations Dispatcher ---

export async function getNews(): Promise<NewsArticleType[]> {
  if (useMongoDB) {
    return await NewsModel.find().lean();
  } else {
    return fallbackDB.news;
  }
}

export async function saveNewsArticle(article: NewsArticleType): Promise<NewsArticleType> {
  if (useMongoDB) {
    // Upsert news article by custom ID
    await NewsModel.findOneAndUpdate(
      { id: article.id },
      article,
      { upsert: true, new: true }
    );
    return article;
  } else {
    const index = fallbackDB.news.findIndex((item) => item.id === article.id);
    if (index >= 0) {
      fallbackDB.news[index] = article;
    } else {
      fallbackDB.news.unshift(article); // Prepend to show newest first
    }
    saveFallback();
    return article;
  }
}

export async function deleteNewsArticle(id: string): Promise<boolean> {
  if (useMongoDB) {
    const result = await NewsModel.deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    const filtered = fallbackDB.news.filter((item) => item.id !== id);
    if (filtered.length !== fallbackDB.news.length) {
      fallbackDB.news = filtered;
      saveFallback();
      return true;
    }
    return false;
  }
}

export async function getMessages(): Promise<MessageType[]> {
  if (useMongoDB) {
    return await MessageModel.find().sort({ _id: -1 }).lean();
  } else {
    return fallbackDB.messages;
  }
}

export async function saveContactMessage(msg: MessageType): Promise<MessageType> {
  if (useMongoDB) {
    await MessageModel.create(msg);
    return msg;
  } else {
    fallbackDB.messages.unshift(msg); // Prepend newest
    saveFallback();
    return msg;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (useMongoDB) {
    const result = await MessageModel.deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    const filtered = fallbackDB.messages.filter((item) => item.id !== id);
    if (filtered.length !== fallbackDB.messages.length) {
      fallbackDB.messages = filtered;
      saveFallback();
      return true;
    }
    return false;
  }
}

export async function getPortfolioSettings(): Promise<SettingsType> {
  if (useMongoDB) {
    const settings = await SettingsModel.findOne().lean();
    return settings || DEFAULT_SETTINGS;
  } else {
    return fallbackDB.settings;
  }
}

export async function updatePortfolioSettings(settings: SettingsType): Promise<SettingsType> {
  if (useMongoDB) {
    await SettingsModel.findOneAndUpdate({}, settings, { upsert: true, new: true });
    return settings;
  } else {
    fallbackDB.settings = settings;
    saveFallback();
    return settings;
  }
}

export async function getAdmins(): Promise<AdminType[]> {
  if (useMongoDB) {
    return await AdminModel.find().lean();
  } else {
    if (!fallbackDB.admins) {
      fallbackDB.admins = [
        {
          username: 'admin',
          passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
          createdAt: new Date().toLocaleDateString('bn-BD')
        }
      ];
      saveFallback();
    }
    return fallbackDB.admins;
  }
}

export async function createAdmin(admin: AdminType): Promise<AdminType> {
  if (useMongoDB) {
    await AdminModel.create(admin);
    return admin;
  } else {
    if (!fallbackDB.admins) {
      fallbackDB.admins = [
        {
          username: 'admin',
          passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
          createdAt: new Date().toLocaleDateString('bn-BD')
        }
      ];
    }
    fallbackDB.admins.push(admin);
    saveFallback();
    return admin;
  }
}

export async function updateAdminPassword(username: string, passwordHash: string): Promise<boolean> {
  if (useMongoDB) {
    const result = await AdminModel.updateOne({ username }, { passwordHash });
    return result.modifiedCount > 0;
  } else {
    if (!fallbackDB.admins) {
      fallbackDB.admins = [
        {
          username: 'admin',
          passwordHash: '$2a$10$v0S6Bv0qP7KbykS7pEExEebjOn87Gz3m7Xv18Wp.Xy3jQ3UOnN8Yy', // securepassword123
          createdAt: new Date().toLocaleDateString('bn-BD')
        }
      ];
    }
    const adminIndex = fallbackDB.admins.findIndex(a => a.username === username);
    if (adminIndex >= 0) {
      fallbackDB.admins[adminIndex].passwordHash = passwordHash;
      saveFallback();
      return true;
    }
    return false;
  }
}

export async function deleteAdmin(username: string): Promise<boolean> {
  if (useMongoDB) {
    const result = await AdminModel.deleteOne({ username });
    return result.deletedCount > 0;
  } else {
    if (!fallbackDB.admins) return false;
    const filtered = fallbackDB.admins.filter(a => a.username !== username);
    if (filtered.length !== fallbackDB.admins.length) {
      fallbackDB.admins = filtered;
      saveFallback();
      return true;
    }
    return false;
  }
}
