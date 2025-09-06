// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})



