'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadPhoto } from './actions'
import type { Tag } from '@/types'

type Props = {
  tags: Tag[]
}

export default function UploadForm({ tags }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await uploadPhoto(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-lg">
      {/* File */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">
          写真ファイル <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          {preview ? (
            <div className="relative w-full aspect-video bg-[#111111] overflow-hidden mb-3">
              <Image src={preview} alt="preview" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full aspect-video border border-dashed border-[#2a2a2a] bg-[#0f0f0f] mb-3">
              <p className="text-xs text-[#6b6b6b] tracking-wide">ファイルを選択</p>
            </div>
          )}
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="w-full text-xs text-[#6b6b6b] file:mr-4 file:py-2 file:px-4 file:border file:border-[#2a2a2a] file:bg-transparent file:text-[10px] file:tracking-[0.15em] file:uppercase file:text-[#f0ede8] hover:file:bg-[#1a1a1a] file:transition-colors file:cursor-pointer"
          />
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">
          タイトル <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="例: 夕暮れの海"
          className="bg-transparent border-b border-[#2a2a2a] pb-2 text-sm text-[#f0ede8] placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#6b6b6b] transition-colors"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">
          カテゴリ
        </label>
        <input
          type="text"
          name="category"
          placeholder="例: 風景、ポートレート"
          className="bg-transparent border-b border-[#2a2a2a] pb-2 text-sm text-[#f0ede8] placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#6b6b6b] transition-colors"
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <label className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">タグ</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  className="accent-[#f0ede8] w-3 h-3"
                />
                <span className="text-xs text-[#6b6b6b] group-hover:text-[#f0ede8] transition-colors">
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* New tag */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">
          新規タグ
        </label>
        <input
          type="text"
          name="newTag"
          placeholder="例: 夕焼け"
          className="bg-transparent border-b border-[#2a2a2a] pb-2 text-sm text-[#f0ede8] placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#6b6b6b] transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 tracking-wide">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="self-start border border-[#2a2a2a] px-8 py-3 text-[10px] tracking-[0.2em] uppercase text-[#f0ede8] hover:bg-[#1a1a1a] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}
