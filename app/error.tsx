'use client' // エラーバウンダリは必ず Client Component

import { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-zinc-600">エラーが発生しました</p>
      <button
        onClick={reset}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-zinc-700"
      >
        再試行
      </button>
    </div>
  )
}
