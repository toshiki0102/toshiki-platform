import { createClient } from '@/utils/supabase/server'
import PhotoCard from './PhotoCard'

type Props = {
  tagId?: string
}

export default async function GalleryGrid({ tagId }: Props) {
  const supabase = await createClient()

  // タグ絞り込み: !inner join で DB レベルでフィルタリング
  const { data: photos } = tagId
    ? await supabase
        .from('photos')
        .select('*, photo_tags!inner(tags(id, name))')
        .eq('photo_tags.tag_id', tagId)
        .order('created_at', { ascending: false })
    : await supabase
        .from('photos')
        .select('*, photo_tags(tags(id, name))')
        .order('created_at', { ascending: false })

  const filtered = photos ?? []

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
