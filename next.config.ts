import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Supabase Storage のホスト名（環境変数から動的に取得できないため .env で別途 SUPABASE_HOSTNAME を定義するか、プロジェクトIDを直接記載する）
        // 例: hostname: 'xxxxxxxxxxxx.supabase.co'
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
          : '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
