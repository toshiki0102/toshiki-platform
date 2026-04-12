import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // トークン検証（JWT 署名を毎回検証するため getSession() ではなく getClaims() を使う）
  const { data, error } = await supabase.auth.getClaims()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'

    // 未認証
    if (error || !data) return NextResponse.redirect(loginUrl)

    // 認証済みでも許可メール以外はアクセス拒否
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || data.claims.email !== adminEmail) {
      return NextResponse.redirect(loginUrl)
    }
  }

  // ログイン済み管理者が /login にアクセスした場合は /admin にリダイレクト
  if (request.nextUrl.pathname === '/login' && data && !error) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && data.claims.email === adminEmail) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/admin'
      return NextResponse.redirect(adminUrl)
    }
  }

  return response
}
