import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function POST() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? ''

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (error || !data.url) redirect('/login?error=oauth_failed')

  redirect(data.url)
}
