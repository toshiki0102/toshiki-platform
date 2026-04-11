# 003 Google OAuth 認証

Supabase Auth の Google OAuth でログイン・コールバック・ログアウトを実装する。

---

## TODO

### Supabase ダッシュボード設定
- [x] Supabase ダッシュボード → Authentication → Providers → Google を有効化する
- [x] Google Cloud Console で OAuth クライアント ID を発行する
- [x] リダイレクト URI に `https://<your-domain>/auth/callback` を登録する
- [x] Client ID / Client Secret を Supabase ダッシュボードに設定する

### ログイン実装（`app/login/page.tsx`）
- [x] Google ログインを開始する Server Action を実装する
  ```ts
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  })
  ```
- [x] ログインボタンのフォームを Server Action に接続する

### コールバックルート実装
- [x] `app/auth/callback/route.ts` を作成する（Route Handler）
- [x] URL の `code` パラメータを `supabase.auth.exchangeCodeForSession(code)` で交換する
- [x] 認証成功後 `/admin` にリダイレクトする
- [x] エラー時 `/login?error=...` にリダイレクトする

### ログアウト実装
- [x] `app/auth/signout/route.ts` を作成する（Route Handler）
- [x] `supabase.auth.signOut()` を呼び出す
- [x] ログアウト後 `/` にリダイレクトする
- [x] `app/admin/layout.tsx` のログアウトボタンを上記ルートに接続する
