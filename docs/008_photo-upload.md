# 008 写真アップロード

管理者が写真をアップロードし、タイトル・タグ・カテゴリを登録できるようにする。

---

## TODO

### アップロードフォーム（`app/admin/upload/page.tsx`）
- [x] ファイル選択 input（`accept="image/*"`）を追加する
- [x] タイトル入力フィールドを追加する
- [x] カテゴリ入力フィールドを追加する（テキスト入力）
- [x] タグ選択 UI を追加する（Supabase から `tags` 一覧を取得してチェックボックス表示）
- [x] 新規タグを作成できる入力欄を追加する

### アップロード Server Action
- [x] Server Action 内で `getClaims()` による認証チェックを行う
- [x] ファイルを Supabase Storage にアップロードする
- [x] `photos` テーブルにレコードを INSERT する（`storage_path` に Storage のパスを保存）
- [x] 選択されたタグを `photo_tags` テーブルに INSERT する
- [x] 新規タグが入力された場合は `tags` テーブルに INSERT してから関連付ける（同名タグ重複も考慮）
- [x] アップロード完了後に `revalidatePath('/')` でギャラリーキャッシュを更新する
- [x] 完了後 `/admin` にリダイレクトする

### UX
- [x] アップロード中はボタンを disabled にしてローディング状態を表示する
- [x] エラー時にメッセージを表示する
- [x] ファイル選択後にプレビューを表示する
