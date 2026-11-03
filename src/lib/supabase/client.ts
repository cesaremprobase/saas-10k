import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isValidUrl =
    envUrl &&
    (envUrl.startsWith('http://') || envUrl.startsWith('https://')) &&
    !envUrl.includes('your_supabase_url')
  const isValidKey = envKey && !envKey.includes('your_supabase_anon_key')

  const url = isValidUrl ? envUrl : 'https://placeholder.supabase.co'
  const anonKey = isValidKey ? envKey : 'placeholder-anon-key'

  return createBrowserClient(url, anonKey)
}
