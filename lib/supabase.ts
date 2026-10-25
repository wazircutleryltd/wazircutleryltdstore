import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client initialized.');
} else {
  console.warn('⚠️ Supabase environment variables missing. Falling back to mock client.');
  const createMockQuery = (): any => ({
    select: () => createMockQuery(),
    eq: () => createMockQuery(),
    order: () => createMockQuery(),
    limit: () => createMockQuery(),
    range: () => createMockQuery(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null })
  });

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
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  } as unknown as SupabaseClient;
}

export { supabase };
