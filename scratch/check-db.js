const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Environment variables missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data, error, count } = await supabase
    .from('products')
    .select('id, name, slug, is_active', { count: 'exact' });

  if (error) {
    console.log("❌ Error fetching products:", error.message);
  } else {
    console.log("✅ Total products in DB:", count);
    console.log("✅ Active products:", data.filter(p => p.is_active).length);
    console.log("✅ Sample Slugs:", data.slice(0, 3).map(p => p.slug));
  }
}

checkProducts();
