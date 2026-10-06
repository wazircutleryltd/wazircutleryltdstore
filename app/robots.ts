import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/login', '/checkout'],
      },
      {
        // Specifically allow AI bots to crawl for Generative Search Experience (GEO)
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Claude-Web', 'CCBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/admin', '/api', '/login'],
      }
    ],
    sitemap: 'https://wazircutlery.com/sitemap.xml',
  };
}
