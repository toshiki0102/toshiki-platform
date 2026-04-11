import { Suspense } from 'react'
import GalleryGrid from '@/components/GalleryGrid'
import TagFilter from '@/components/TagFilter'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 3600

type Props = {
  searchParams: Promise<{ tag?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
  const { tag } = await searchParams
  const supabase = await createClient()
  const { data: tags, error: tagsError } = await supabase.from('tags').select('id, name').order('name')
  if (tagsError) console.error('Failed to fetch tags:', tagsError.message)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f] md:px-12">
        <span className="text-xs tracking-[0.3em] uppercase text-[#f0ede8] font-light">
          Toshiki
        </span>
        <nav className="flex items-center gap-8">
          <span className="text-xs tracking-[0.2em] uppercase text-[#6b6b6b]">Gallery</span>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-10 md:px-12 md:pt-24 md:pb-14">
        <h1 className="text-[2.5rem] font-light leading-none tracking-tight md:text-[4rem] lg:text-[5rem]">
          Photography
        </h1>
        <p className="mt-3 text-sm text-[#6b6b6b] tracking-wide">
          風景 &amp; ポートレート
        </p>
      </section>

      {/* Tag Filter */}
      {tags && tags.length > 0 && (
        <div className="px-6 pb-8 md:px-12">
          <Suspense>
            <TagFilter tags={tags} />
          </Suspense>
        </div>
      )}

      {/* Gallery */}
      <main className="flex-1 px-6 pb-20 md:px-12">
        <Suspense fallback={<GalleryGridSkeleton />}>
          <GalleryGrid tagId={tag} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] px-6 py-6 md:px-12">
        <p className="text-xs text-[#6b6b6b] tracking-wider">
          &copy; {new Date().getFullYear()} Toshiki. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-[#111111] animate-pulse" />
      ))}
    </div>
  )
}
