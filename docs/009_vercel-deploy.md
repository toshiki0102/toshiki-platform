# 009 Vercel デプロイ

本番環境を Vercel にデプロイし、公開する。

---

## TODO

### 事前確認
- [ ] `npm run build` がエラーなく完了することを確認する
- [ ] `npm run lint` がエラーなく完了することを確認する
- [ ] `proxy.ts` が `edge` ランタイムを使用していないことを最終確認する

### Vercel 設定
- [ ] Vercel にプロジェクトをインポートする（GitHub リポジトリと連携）
- [ ] 環境変数を Vercel 管理画面に設定する
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Framework Preset が `Next.js` になっていることを確認する

### Google OAuth リダイレクト URI 更新
- [ ] Google Cloud Console のリダイレクト URI に本番ドメインを追加する
  - `https://<your-vercel-domain>/auth/callback`
- [ ] Supabase ダッシュボードの Site URL を本番 URL に更新する
- [ ] Supabase の Redirect URLs に本番コールバック URL を追加する

### 動作確認
- [ ] 本番 URL でギャラリー一覧が表示されることを確認する
- [ ] Google ログインが正常に動作することを確認する
- [ ] 管理画面から写真をアップロードできることを確認する
- [ ] アップロード後にギャラリーに反映されることを確認する（ISR の revalidate 含む）
