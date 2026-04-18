'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePhoto(photoId: string, storagePath: string) {
  const supabase = await createClient()

  // Server Action 内でも必ず認証チェック
  const { data, error: authError } = await supabase.auth.getClaims()
  if (authError || !data) throw new Error('Unauthorized')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || data.claims.email !== adminEmail) throw new Error('Unauthorized')

  // DB からレコードを削除（photo_tags は cascade で自動削除）
  const { error: dbError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
  if (dbError) {
    console.error('[deletePhoto] db error:', dbError)
    throw new Error('写真の削除に失敗しました')
  }

  // Storage からファイルを削除（DB 削除後に実行。失敗してもログのみ）
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([storagePath])
  if (storageError) {
    console.error('[deletePhoto] storage error:', storageError)
  }

  revalidatePath('/')
  revalidatePath('/admin')
}
