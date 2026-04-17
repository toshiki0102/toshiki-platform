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
  const [confirming, setConfirming] = useState(false)

  const handleDelete = () => {
    setError(null)
    setConfirming(false)
    startTransition(async () => {
      try {
        await deletePhoto(photoId, storagePath)
      } catch (err) {
        setError(err instanceof Error ? err.message : '削除に失敗しました')
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-start gap-1">
        <p className="text-[10px] text-[#a0a0a0] tracking-wide">削除しますか？</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="text-[10px] tracking-[0.15em] uppercase text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-[10px] tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#a0a0a0] transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={() => setConfirming(true)}
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
