'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePhoto(photoId: string, storagePath: string) {
  const supabase = await createClient()

  // Server Action 内でも必ず認証チェック
  const { data, error: authError } = await supabase.auth.getClaims()
  if (authError || !data) throw new Error('Unauthorized')

  // Storage からファイルを削除
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([storagePath])
  if (storageError) throw new Error(storageError.message)

  // DB からレコードを削除（photo_tags は cascade で自動削除）
  const { error: dbError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
  if (dbError) throw new Error(dbError.message)

  revalidatePath('/')
  revalidatePath('/admin')
}
