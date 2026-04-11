import { createClient } from '@/utils/supabase/server'
import PhotoCard from './PhotoCard'

type Props = {
  tagId?: string
}

export default async function GalleryGrid({ tagId }: Props) {
  const supabase = await createClient()

  const query = supabase
    .from('photos')
    .select('*, photo_tags(tags(id, name))')
    .order('created_at', { ascending: false })

  // タグ絞り込み: photo_tags に該当 tag_id を持つ写真のみ取得
  const { data: photos } = tagId
    ? await query.eq('photo_tags.tag_id', tagId)
    : await query

  // タグ絞り込み時は photo_tags が空配列でないものだけ表示
  const filtered = tagId
    ? (photos ?? []).filter((p) => p.photo_tags && p.photo_tags.length > 0)
    : (photos ?? [])

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-12 h-px bg-[#2a2a2a]" />
        <p className="text-xs tracking-[0.2em] uppercase text-[#6b6b6b]">No photos yet</p>
        <div className="w-12 h-px bg-[#2a2a2a]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
      {filtered.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}
