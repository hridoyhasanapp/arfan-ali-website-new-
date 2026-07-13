/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsReport {
  id: string;
  title: string;
  category: 'শিক্ষা' | 'উন্নয়ন' | 'মানবিক' | 'ক্যাম্পাস' | 'স্থানীয় খবর';
  date: string;
  source: string;
  summary: string;
  fullContent: string;
  readTime: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  highlight?: string;
}

export interface ContactMessage {
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
}

