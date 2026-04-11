# 002 環境変数設定・型自動生成

ローカル開発用の環境変数を設定し、Supabase CLI で TypeScript 型を自動生成する。

---

## TODO

### 環境変数
- [x] `.env.local` をプロジェクトルートに作成する（`.gitignore` に含まれていることを確認）
- [x] `NEXT_PUBLIC_SUPABASE_URL` を設定する
- [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を設定する
- [ ] Vercel 管理画面にも同じ環境変数を登録する（009 デプロイ時）

### Supabase CLI による型自動生成
- [x] Supabase CLI をインストールする: `npm install -g supabase`
- [x] CLI でログインする: `supabase login`
- [x] 型を生成する:
  ```bash
  npx supabase gen types typescript --project-id aklsfmtlxyppabpwoihr > types/database.ts
  ```
- [x] `types/index.ts` の手書き型を `types/database.ts` の自動生成型に置き換える
- [x] `utils/supabase/client.ts` / `server.ts` に `Database` 型を適用する
