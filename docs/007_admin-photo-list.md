# 007 管理画面 写真一覧・削除

管理者が登録済み写真を一覧表示し、削除できるようにする。

---

## TODO

### 写真一覧（`app/admin/page.tsx`）
- [x] Supabase から `photos` 一覧を取得して表示する（`force-dynamic` 確認）
- [x] サムネイル・タイトル・カテゴリ・登録日を一覧表示する
- [x] アップロードページへのリンクボタンが機能することを確認する

### 削除機能
- [x] 削除ボタンを各写真に追加する（Client Component として切り出す）
- [x] 削除 Server Action を実装する
  - Supabase Storage から `storage_path` のファイルを削除する
  - `photos` テーブルから該当レコードを削除する（`photo_tags` は `on delete cascade` で自動削除）
  - `revalidatePath('/')` と `revalidatePath('/admin')` でキャッシュを更新する
- [x] 削除確認ダイアログを表示する（`confirm()`）
- [x] 削除後に一覧が更新されることを確認する（`revalidatePath` によるキャッシュパージ）

### セキュリティ
- [x] Server Action 内で `getClaims()` による認証チェックを行う（layout の認証に依存しない）
