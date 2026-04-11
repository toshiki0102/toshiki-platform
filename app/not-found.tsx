import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">ページが見つかりません</h2>
      <Link href="/" className="text-sm text-zinc-500 underline hover:text-zinc-900">
        ギャラリーに戻る
      </Link>
    </div>
  )
}
