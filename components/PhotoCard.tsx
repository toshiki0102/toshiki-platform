import Image from 'next/image'
import type { Photo } from '@/types'

type Props = {
  photo: Photo
}

export default function PhotoCard({ photo }: Props) {
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`

  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-[#111111] cursor-pointer">
      <Image
        src={imageUrl}
        alt={photo.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-75"
      />
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-light tracking-wide text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {photo.title}
        </p>
        {photo.category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            {photo.category}
          </p>
        )}
      </div>
    </div>
  )
}
