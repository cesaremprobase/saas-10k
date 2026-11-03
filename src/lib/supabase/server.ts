import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isValidUrl =
    envUrl &&
    (envUrl.startsWith('http://') || envUrl.startsWith('https://')) &&
    !envUrl.includes('your_supabase_url')
  const isValidKey = envKey && !envKey.includes('your_supabase_anon_key')

  const url = isValidUrl ? envUrl : 'https://placeholder.supabase.co'
  const anonKey = isValidKey ? envKey : 'placeholder-anon-key'

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore en Server Components
          }
        },
      },
    }
  )
}
