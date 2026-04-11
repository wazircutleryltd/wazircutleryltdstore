// Simple Node script to test Supabase Fetch
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('--- Supabase Connection Test ---');
  
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('Error: .env.local not found');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

    if (!urlMatch || !keyMatch) {
      console.error('Error: Missing credentials in .env.local');
      return;
    }

    const url = urlMatch[1].trim();
    const key = keyMatch[1].trim();

    console.log('Target URL:', url);
    
    // Testing newsletter_subscribers table via REST API
    const response = await fetch(`${url}/rest/v1/newsletter_subscribers?select=count`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Range': '0-0',
        'Prefer': 'count=exact'
      }
    });

    if (response.ok) {
      const count = response.headers.get('content-range');
      console.log('Status: SUCCESS');
      console.log('Content-Range Header:', count);
      console.log('Table "newsletter_subscribers" is accessible!');
    } else {
      const errorText = await response.text();
      console.error('Status: FAILED');
      console.error('HTTP Status:', response.status);
      console.error('Error Body:', errorText);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
