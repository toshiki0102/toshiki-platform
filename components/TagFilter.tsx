'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  tags?: { id: string; name: string }[]
}

export default function TagFilter({ tags = [] }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get('tag') ?? ''

  const handleSelect = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selected === tagId) {
      params.delete('tag')
    } else {
      params.set('tag', tagId)
    }
    router.push(`/?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete('tag')
          router.push(`/?${params.toString()}`)
        }}
        className={`shrink-0 text-[10px] tracking-[0.25em] uppercase px-4 py-2 transition-colors duration-200 ${
          !selected
            ? 'text-[#f0ede8]'
            : 'text-[#6b6b6b] hover:text-[#f0ede8]'
        }`}
      >
        All
      </button>
      <span className="text-[#2a2a2a] text-xs">|</span>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleSelect(tag.id)}
          className={`shrink-0 text-[10px] tracking-[0.25em] uppercase px-4 py-2 transition-colors duration-200 ${
            selected === tag.id
              ? 'text-[#f0ede8]'
              : 'text-[#6b6b6b] hover:text-[#f0ede8]'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
