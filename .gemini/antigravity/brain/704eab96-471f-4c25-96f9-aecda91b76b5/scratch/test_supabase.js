import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSubscribers() {
  console.log('Testing connection to newsletter_subscribers table...')
  try {
    const { data, error, count } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Supabase Error:', error)
    } else {
      console.log('Success!')
      console.log('Total Subscribers found:', count)
      console.log('Sample Data:', data)
    }
  } catch (err) {
    console.error('Unexpected Error:', err)
  }
}

testSubscribers()
