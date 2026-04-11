import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client if environment variables are missing
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client initialized.');
} else {
  console.warn('⚠️ Supabase environment variables missing. Falling back to mock client.');
  // Create a mock client for development
  const createMockQuery = () => ({
    select: () => createMockQuery(),
    eq: () => createMockQuery(),
    order: () => createMockQuery(),
    limit: () => createMockQuery(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve) => resolve({ data: [], error: null })
  })

  supabase = {
    from: () => ({
      select: () => createMockQuery(),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      })
    })
  }
}

export { supabase }
