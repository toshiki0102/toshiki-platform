import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'TOSHIKI — Photography',
    template: '%s | TOSHIKI',
  },
  description: '風景・ポートレートなど、厳選した写真を公開するギャラリーサイト',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-[#f0ede8] antialiased">
        {children}
      </body>
    </html>
  )
}
