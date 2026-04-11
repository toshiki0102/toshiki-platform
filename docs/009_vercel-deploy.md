# 009 Vercel デプロイ

本番環境を Vercel にデプロイし、公開する。

---

## TODO

### 事前確認
- [x] `npm run build` がエラーなく完了することを確認する
- [x] `npm run lint` がエラーなく完了することを確認する
- [x] `proxy.ts` が `edge` ランタイムを使用していないことを最終確認する

### Vercel 設定
- [x] Vercel にプロジェクトをインポートする（GitHub リポジトリと連携）
- [x] 環境変数を Vercel 管理画面に設定する
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [x] Framework Preset が `Next.js` になっていることを確認する

### Google OAuth リダイレクト URI 更新
- [x] Google Cloud Console のリダイレクト URI に Supabase のコールバック URL を追加する
  - `https://aklsfmtlxyppabpwoihr.supabase.co/auth/v1/callback`
- [x] Supabase ダッシュボードの Site URL を本番 URL に更新する
- [x] Supabase の Redirect URLs に本番コールバック URL を追加する

### 動作確認
- [x] 本番 URL でギャラリー一覧が表示されることを確認する
- [x] Google ログインが正常に動作することを確認する
- [x] 管理画面から写真をアップロードできることを確認する
- [x] アップロード後にギャラリーに反映されることを確認する（ISR の revalidate 含む）
