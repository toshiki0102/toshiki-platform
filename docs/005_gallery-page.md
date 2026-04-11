# 005 ギャラリー一覧ページ

トップページに写真をグリッド表示する。ISR でキャッシュし初期表示を高速化する。

---

## TODO

### GalleryGrid（`components/GalleryGrid.tsx`）
- [x] Supabase から `photos` と関連 `tags` を取得するクエリを確認・調整する
- [x] `searchParams` の `tag` パラメータに応じてタグ絞り込みクエリを追加する
- [x] 取得結果を `PhotoCard` に渡してグリッドレイアウトで表示する
- [x] 写真が 0 件のときの空状態 UI を整える

### PhotoCard（`components/PhotoCard.tsx`）
- [x] `next/image` の `fill` + `sizes` が正しく設定されていることを確認する
- [x] Supabase Storage の公開 URL 生成ロジックを確認する
- [x] 写真カードにタイトル・カテゴリを表示する
- [x] タップ時のホバーアニメーションを確認する

### トップページ（`app/page.tsx`）
- [x] `TagFilter` にタグ一覧を Server Component 側で取得して渡す
- [x] `revalidate = 3600` が意図どおりに機能することを確認する（写真追加後に手動でも `revalidatePath('/')` を呼ぶ）
- [x] レスポンシブ（PC / スマートフォン）レイアウトを確認する

### next.config.ts
- [x] Supabase Storage の `remotePatterns` に実際のプロジェクト URL が反映されていることを確認する
