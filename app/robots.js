export default function robots() {
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
