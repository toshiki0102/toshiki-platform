import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import UploadForm from './UploadForm'

export const metadata: Metadata = { title: '写真アップロード' }
export const dynamic = 'force-dynamic'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: tags } = await supabase.from('tags').select('id, name').order('name')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-sm tracking-[0.2em] uppercase text-[#f0ede8]">Upload</h1>
      <UploadForm tags={tags ?? []} />
    </div>
  )
}
