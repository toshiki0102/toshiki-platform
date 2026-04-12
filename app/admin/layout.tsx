import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data) redirect('/login')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || data.claims.email !== adminEmail) redirect('/login')

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-[#1f1f1f] px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xs tracking-[0.3em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors">
            Toshiki
          </Link>
          <span className="text-[#2a2a2a]">/</span>
          <span className="text-xs tracking-[0.2em] uppercase text-[#f0ede8]">Admin</span>
        </div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors duration-200"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  )
}
