'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()

  // 認証チェック
  const { data: claims, error: authError } = await supabase.auth.getClaims()
  if (authError || !claims) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  const title = (formData.get('title') as string).trim()
  const category = (formData.get('category') as string).trim()
  const tagIds = formData.getAll('tagIds') as string[]
  const newTag = (formData.get('newTag') as string).trim()

  if (!file || !file.size) throw new Error('ファイルが選択されていません')
  if (!title) throw new Error('タイトルを入力してください')

  // Storage にアップロード
  const ext = file.name.split('.').pop()
  const storagePath = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error: storageError } = await supabase.storage
    .from('photos')
    .upload(storagePath, file)
  if (storageError) throw new Error(storageError.message)

  // photos テーブルに INSERT（失敗時は Storage のファイルを削除してロールバック）
  const { data: photo, error: insertError } = await supabase
    .from('photos')
    .insert({ title, description: null, storage_path: storagePath, category: category || null })
    .select('id')
    .single()
  if (insertError || !photo) {
    await supabase.storage.from('photos').remove([storagePath])
    throw new Error(insertError?.message ?? 'Insert failed')
  }

  // 新規タグを作成
  const allTagIds = [...tagIds]
  if (newTag) {
    const { data: created, error: tagError } = await supabase
      .from('tags')
      .insert({ name: newTag })
      .select('id')
      .single()
    if (tagError) {
      // 同名タグが既存の場合は取得して使う
      const { data: existing } = await supabase
        .from('tags')
        .select('id')
        .eq('name', newTag)
        .single()
      if (existing) allTagIds.push(existing.id)
    } else if (created) {
      allTagIds.push(created.id)
    }
  }

  // photo_tags に INSERT
  if (allTagIds.length > 0) {
    await supabase
      .from('photo_tags')
      .insert(allTagIds.map((tagId) => ({ photo_id: photo.id, tag_id: tagId })))
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}
