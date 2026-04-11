import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import DeleteButton from './DeleteButton'

export const metadata: Metadata = { title: '写真管理' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm tracking-[0.2em] uppercase text-[#f0ede8]">Photos</h1>
        <Link
          href="/admin/upload"
          className="text-[10px] tracking-[0.2em] uppercase border border-[#2a2a2a] px-4 py-2 text-[#f0ede8] hover:bg-[#1a1a1a] transition-colors duration-200"
        >
          Upload
        </Link>
      </div>

      {/* List */}
      {!photos || photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-px bg-[#2a2a2a]" />
          <p className="text-xs tracking-[0.2em] uppercase text-[#6b6b6b]">No photos yet</p>
          <div className="w-12 h-px bg-[#2a2a2a]" />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#1f1f1f]">
          {photos.map((photo) => {
            const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`
            const createdAt = photo.created_at
              ? new Date(photo.created_at).toLocaleDateString('ja-JP')
              : '—'

            return (
              <div key={photo.id} className="flex items-center gap-5 py-4">
                {/* Thumbnail */}
                <div className="relative w-14 h-14 shrink-0 bg-[#111111] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={photo.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light truncate">{photo.title}</p>
                  <p className="text-[11px] text-[#6b6b6b] mt-0.5">
                    {photo.category ?? '—'} &nbsp;·&nbsp; {createdAt}
                  </p>
                </div>

                {/* Actions */}
                <DeleteButton photoId={photo.id} storagePath={photo.storage_path} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
