# 001 Supabase プロジェクト設定

Supabase 上にデータベース・ストレージ・RLS を構築する。

---

## TODO

### プロジェクト作成
- [x] [database.new](https://database.new) で新規プロジェクトを作成する
- [x] プロジェクト URL と API キーを控える

### テーブル作成
- [x] `photos` テーブルを作成する
  - `id uuid PK default gen_random_uuid()`
  - `title text not null`
  - `description text`
  - `storage_path text not null`
  - `category text`
  - `created_at timestamptz default now()`
- [x] `tags` テーブルを作成する
  - `id uuid PK default gen_random_uuid()`
  - `name text not null unique`
- [x] `photo_tags` テーブルを作成する（中間テーブル）
  - `photo_id uuid references photos(id) on delete cascade`
  - `tag_id uuid references tags(id) on delete cascade`
  - `primary key (photo_id, tag_id)`

### Storage
- [x] `photos` バケットを作成する
- [x] バケットのアクセスポリシーを「Public（読み取りのみ）」に設定する
- [x] アップロード・削除は認証済みユーザーのみ許可するポリシーを設定する

### RLS（Row Level Security）
- [x] `photos` テーブルの RLS を有効化する
  - SELECT: 全ユーザー許可
  - INSERT / UPDATE / DELETE: オーナー本人のみ（`auth.uid()` 一致）
- [x] `tags` テーブルの RLS を有効化する
  - SELECT: 全ユーザー許可
  - INSERT / DELETE: オーナー本人のみ（`auth.uid()` 一致）
- [x] `photo_tags` テーブルの RLS を有効化する
  - SELECT: 全ユーザー許可
  - INSERT / DELETE: オーナー本人のみ（`auth.uid()` 一致）
