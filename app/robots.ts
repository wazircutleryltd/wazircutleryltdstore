import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { DEFAULT_STORE_SETTINGS } from '@/stores/settingsStore';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  let settings = DEFAULT_STORE_SETTINGS;

  try {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'general')
      .single();

    if (data?.value) {
      const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      settings = { ...DEFAULT_STORE_SETTINGS, ...val };
    } else {
      const localPath = path.join(process.cwd(), 'data', 'store_settings.json');
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        settings = { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(content) };
      }
    }
  } catch (err) {
    try {
      const localPath = path.join(process.cwd(), 'data', 'store_settings.json');
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        settings = { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(content) };
      }
    } catch {
      // use default
    }
  }

  const allowedBots: string[] = [];
  const disallowedBots: string[] = [];

  if (settings.allowGptBot !== false) {
    allowedBots.push('GPTBot', 'ChatGPT-User', 'OAI-SearchBot');
  } else {
    disallowedBots.push('GPTBot', 'ChatGPT-User', 'OAI-SearchBot');
  }

  if (settings.allowClaudeBot !== false) {
    allowedBots.push('ClaudeBot', 'Claude-Web');
  } else {
    disallowedBots.push('ClaudeBot', 'Claude-Web');
  }

  if (settings.allowPerplexityBot !== false) {
    allowedBots.push('PerplexityBot');
  } else {
    disallowedBots.push('PerplexityBot');
  }

  if (settings.allowGoogleExtended !== false) {
    allowedBots.push('Google-Extended');
  } else {
    disallowedBots.push('Google-Extended');
  }

  // Additional crawlers allowed by default
  allowedBots.push('Applebot-Extended', 'CCBot', 'cohere-ai', 'Diffbot');

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/login', '/checkout'],
    },
  ];

  if (disallowedBots.length > 0) {
    rules.push({
      userAgent: disallowedBots,
      disallow: ['/'],
    });
  }

  if (allowedBots.length > 0) {
    rules.push({
      userAgent: allowedBots,
      allow: '/',
      disallow: ['/admin', '/api', '/login'],
    });
  }

  return {
    rules,
    sitemap: 'https://wazircutlery.com/sitemap.xml',
  };
}
