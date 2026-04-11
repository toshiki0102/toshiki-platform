'use client'

import { useTransition } from 'react'
import { deletePhoto } from './actions'

type Props = {
  photoId: string
  storagePath: string
}

export default function DeleteButton({ photoId, storagePath }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!confirm('この写真を削除しますか？')) return
    startTransition(async () => {
      await deletePhoto(photoId, storagePath)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-[10px] tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-red-400 transition-colors duration-200 disabled:opacity-40"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
