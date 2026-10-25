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
        // Specifically welcome modern AI search & generative citation engines (AEO / LLMO / GEO)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
          'Diffbot'
        ],
        allow: '/',
        disallow: ['/admin', '/api', '/login'],
      }
    ],
    sitemap: 'https://wazircutlery.com/sitemap.xml',
  };
}
