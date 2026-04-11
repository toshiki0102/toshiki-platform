# 006 タグ絞り込み機能

タグ一覧を UI に表示し、選択したタグで写真を絞り込む。

---

## TODO

### タグ取得
- [x] `app/page.tsx`（Server Component）で Supabase から `tags` 一覧を取得する
- [x] 取得した `tags` を `TagFilter` に props として渡す
- [x] `GalleryGrid` に `searchParams.tag` を渡し、タグ ID でフィルタリングするクエリを追加する

### TagFilter（`components/TagFilter.tsx`）
- [x] `tags` props を受け取って一覧表示できることを確認する
- [x] タグ選択・解除時に URL の `?tag=<id>` が正しく更新されることを確認する
- [x] 選択中のタグがハイライト表示されることを確認する
- [x] タグが 0 件のとき `null` を返して何も表示しないことを確認する

### UX
- [x] タグ切り替え時に `loading.tsx` のスピナーが表示されることを確認する（Suspense 境界）
- [x] 複数タグの複合絞り込みは MVP 対象外であることを確認する（後続フェーズへ）
