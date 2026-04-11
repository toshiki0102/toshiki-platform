'use client'

import { useState, useTransition } from 'react'
import { deletePhoto } from './actions'

type Props = {
  photoId: string
  storagePath: string
}

export default function DeleteButton({ photoId, storagePath }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    if (!confirm('この写真を削除しますか？')) return
    setError(null)
    startTransition(async () => {
      try {
        await deletePhoto(photoId, storagePath)
      } catch (err) {
        setError(err instanceof Error ? err.message : '削除に失敗しました')
      }
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-[10px] tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-red-400 transition-colors duration-200 disabled:opacity-40"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
      {error && (
        <p className="text-[10px] text-red-400">{error}</p>
      )}
    </div>
  )
}
