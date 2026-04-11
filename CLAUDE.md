# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **重要**: このプロジェクトは **Next.js 16** を使用しています。以前のバージョンから破壊的変更があります。コードを書く前に `node_modules/next/dist/docs/` を参照し、非推奨の警告に従ってください。

## プロジェクト概要

個人で収集した写真（風景・ポートレートなど）を一般公開するためのギャラリープラットフォーム。ギャラリー閲覧は認証不要（一般公開）。管理機能（アップロード・管理）は Supabase Auth の Google OAuth で保護。MVPの詳細仕様は `app/docs/requirements-mvp.md` を参照。

## 技術スタック

- **言語 / ランタイム**: TypeScript / Node.js 20.9+
- **フレームワーク**: Next.js 16.2.2（App Router、Turbopack デフォルト）
- **UI**: React 19.2.4、Tailwind CSS v4
- **バックエンド / DB**: Supabase（PostgreSQL + Storage + Auth）
- **認証**: Supabase Auth — Google OAuth のみ
- **リント**: ESLint 9（eslint-config-next）
- **パッケージ管理**: npm
- **ホスティング**: Vercel（予定）

## よく使うコマンド

```bash
npm install          # 依存関係のインストール
npm run dev          # 開発サーバー（Turbopack、http://localhost:3000）
npm run build        # プロダクションビルド（Turbopack）
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint 実行（※ build 時は自動実行されない）
```

Webpack を使う場合: `next dev --webpack` / `next build --webpack`

テストランナーは未設定。

## アーキテクチャ

### ディレクトリ構成

```
app/
  page.tsx              # ギャラリー一覧（トップページ、一般公開）revalidate=3600
  layout.tsx            # 共通レイアウト・メタデータ
  loading.tsx           # Suspense フォールバック UI
  error.tsx             # エラーバウンダリ（'use client' 必須）
  not-found.tsx         # 404 ページ
  login/page.tsx        # Google ログインページ（Server Component）
  admin/
    layout.tsx          # 認証ガード（getClaims() で検証）
    page.tsx            # 写真管理一覧（force-dynamic）
    upload/page.tsx     # 写真アップロード（force-dynamic）
components/
  GalleryGrid.tsx       # Server Component — Supabase からデータ取得
  PhotoCard.tsx         # next/image で表示（fill + sizes 指定）
  TagFilter.tsx         # 'use client' — URL パラメータでタグ絞り込み
utils/supabase/
  client.ts             # createBrowserClient（Client Component 用）
  server.ts             # createServerClient + await cookies()（Server 用）
types/
  index.ts              # Photo / Tag / PhotoTag / PhotoWithTags 型
proxy.ts                # 管理ルート認証ガード・トークン更新
next.config.ts          # Supabase Storage の remotePatterns 設定済み
```

### Supabase データモデル

**`photos`** — `id (uuid PK)`, `title (text)`, `description (text)`, `storage_path (text)`, `category (text)`, `created_at (timestamptz)`

**`tags`** — `id (uuid PK)`, `name (text)`

**`photo_tags`**（中間テーブル）— `photo_id (uuid FK)`, `tag_id (uuid FK)`

RLS ポリシー: 閲覧者は読み取りのみ公開、管理者（Google OAuth 認証済み）のみ書き込み可能。

### ルート設計

| ルート | 公開 / 認証 | 説明 |
|---|---|---|
| `/` | 公開 | ギャラリー一覧・タグ絞り込み |
| `/login` | 公開 | Google ログイン |
| `/admin` | 認証必須 | 写真管理一覧 |
| `/admin/upload` | 認証必須 | 写真アップロード |

## Next.js 16 の破壊的変更（重要）

**`middleware` → `proxy`** — 要件定義書（`app/docs/requirements-mvp.md`）には `middleware.ts` と記載されているが、**Next.js 16 では非推奨**。代わりに `proxy.ts` を使用すること:
```ts
export function proxy(request: Request) { /* 未認証時のリダイレクト処理 */ }
```
`proxy` では `edge` ランタイムは**使用不可**（nodejs のみ）。

**非同期 Request API** — `cookies()`、`headers()`、`draftMode()`、`params`、`searchParams` は非同期のみ（同期アクセス廃止）。必ず `await` すること:
```ts
const { slug } = await params
const cookieStore = await cookies()
```

**`next build` でリントが実行されない** — `npm run lint` を別途実行すること。

**Turbopack がデフォルト** — `experimental.turbopack` の設定はトップレベルの `turbopack` に移動。Sass のチルダ（`~`）インポートは Turbopack 非対応。

**キャッシュ API** — `unstable_cacheLife` / `unstable_cacheTag` が安定版に。`next/cache` から `cacheLife`、`cacheTag` としてインポートする。

**PPR** — `experimental.ppr` は廃止。`next.config.ts` で `cacheComponents: true` を使用する。

## Next.js ベストプラクティス

### Server Components / Client Components

- **デフォルトは Server Component**。`useState`・`useEffect`・ブラウザ API が必要な場合のみ `'use client'` を付ける。
- `'use client'` は境界をできるだけ末端のコンポーネントに限定し、サーバー側でのデータ取得・レンダリングを最大化する。
- Server Component から Client Component に渡せる props はシリアライズ可能な値のみ（関数・クラスインスタンス不可）。

### データ取得

- データ取得は Server Component 内で `async/await` を使って直接行う（`useEffect` でのクライアントフェッチは避ける）。
- 同一リクエスト内で同じ `fetch` を複数回呼んでも自動的に重複排除される（Next.js の `fetch` 拡張）。
- Supabase クライアントはサーバー用（`createServerClient`）とクライアント用（`createBrowserClient`）を使い分ける。

### キャッシュ戦略

- ギャラリー一覧など更新頻度が低いページ: `export const revalidate = 3600`（ISR）またはビルド時静的生成（SSG）を優先する。
- 管理画面など常に最新が必要なページ: `export const dynamic = 'force-dynamic'` を明示する。
- `revalidateTag` / `revalidatePath` で写真追加・削除時にキャッシュを手動パージする。

### ファイル規約（App Router）

| ファイル名 | 用途 |
|---|---|
| `page.tsx` | ルートの UI（公開エントリポイント） |
| `layout.tsx` | 共通レイアウト（子ルートで再利用） |
| `loading.tsx` | Suspense フォールバック UI |
| `error.tsx` | エラーバウンダリ UI（`'use client'` 必須） |
| `not-found.tsx` | 404 UI |

- `error.tsx` は必ず `'use client'` を付ける（React のエラーバウンダリ仕様のため）。

### パフォーマンス

- 画像は必ず `next/image` を使用。`width`・`height` または `fill` を指定し、`alt` を省略しない。
- フォントは `next/font/google` で読み込む（レイアウトシフト防止・自己ホスト化）。
- 重い Client Component（リッチエディタ等）は `next/dynamic` + `{ ssr: false }` で遅延読み込みする。

### 型安全

- `page.tsx` の props（`params`・`searchParams`）は Next.js が提供する型を使う:
  ```ts
  export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
  }
  ```
- `utils/supabase/` で生成した型（`Database` 型）を全体で共有し、テーブル型を手書きしない。現状は `types/index.ts` に手書き型を定義しているが、Supabase CLI で自動生成した型に置き換えることを推奨。

### セキュリティ

- Server Actions や Route Handlers では必ずサーバー側で認証チェックを行う（クライアントの認証状態を信頼しない）。
- 環境変数のうちクライアントに公開してよいものだけ `NEXT_PUBLIC_` プレフィックスを付ける。
- Supabase Storage のバケットは読み取りのみ公開とし、書き込みは RLS で管理者に限定する。

## Supabase Auth セットアップルール

### パッケージ

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 環境変数

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # 新形式キー（anon key も引き続き使用可）
```

### クライアント実装（`utils/supabase/`）

**`utils/supabase/client.ts`** — Client Component 用（ブラウザ）:
```ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
```
`createBrowserClient` はシングルトンなので、複数回呼び出しても 1 インスタンスのみ生成される。

**`utils/supabase/server.ts`** — Server Component / Server Actions / Route Handlers 用:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()   // Next.js 16: cookies() は必ず await する

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component から呼ばれた場合は書き込み不可（無視してよい）
            // proxy.ts でトークン更新を行っていれば問題なし
          }
        },
      },
    }
  )
}
```

> **注意**: 公式ドキュメントのサンプルは `cookies()` を同期で呼んでいるが、**Next.js 16 では `await` が必須**。

### proxy.ts での認証ガード

Server Components はクッキーに書き込めないため、**proxy.ts がトークン更新を担当する**:

1. `supabase.auth.getClaims()` でトークンを検証・更新する
2. `request.cookies.set` で更新済みトークンを Server Components に渡す
3. `response.cookies.set` でブラウザに新トークンを返す

### 認証チェックのルール

| 用途 | 使うべき API | 理由 |
|---|---|---|
| サーバー側のセッション検証 | `supabase.auth.getClaims()` | JWT 署名を毎回検証するため安全 |
| ~~サーバー側のセッション取得~~ | ~~`supabase.auth.getSession()`~~ | サーバー側では**絶対に使用しない**（JWT 未検証） |
| クライアント側のセッション取得 | `supabase.auth.getSession()` | ブラウザ内は許容 |

### キャッシュに関する注意

- ISR や CDN を使う場合、`Set-Cookie` ヘッダーがキャッシュされると **別ユーザーのセッションが漏洩するリスクがある**。
- 認証が絡むページは `export const dynamic = 'force-dynamic'` を明示するか、CDN キャッシュから除外する。

## 開発メモ

- `@/*` パスエイリアスはプロジェクトルートにマッピング（`tsconfig.json` で設定済み）。
- `app/globals.css` — Tailwind v4 の CSS ファースト設定。`tailwind.config.js` は不要。
- `eslint.config.mjs` — ESLint 9 のフラット設定形式。
- 必要な環境変数（`.env.local` に設定）:
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
  # サーバーサイドの管理者書き込みに必要な場合
  # SUPABASE_SERVICE_ROLE_KEY=...
  ```
- Supabase CLI で型を自動生成する場合: `npx supabase gen types typescript --project-id <id> > types/database.ts`
