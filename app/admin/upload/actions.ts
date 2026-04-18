'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'] as const
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()

  // 認証チェック
  const { data: claims, error: authError } = await supabase.auth.getClaims()
  if (authError || !claims) throw new Error('Unauthorized')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || claims.claims.email !== adminEmail) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  const title = (formData.get('title') as string).trim()
  const category = (formData.get('category') as string).trim()
  const tagIds = formData.getAll('tagIds') as string[]
  const newTag = (formData.get('newTag') as string).trim()

  if (!file || !file.size) throw new Error('ファイルが選択されていません')
  if (!title) throw new Error('タイトルを入力してください')

  // ファイルバリデーション
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    throw new Error('許可されていないファイル形式です（JPEG / PNG / WebP / GIF / AVIF のみ）')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ファイルサイズは 20MB 以内にしてください')
  }

  // 拡張子はファイル名ではなく MIME タイプから決定
  const ext = MIME_TO_EXT[file.type]
  const storagePath = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error: storageError } = await supabase.storage
    .from('photos')
    .upload(storagePath, file)
  if (storageError) {
    console.error('[uploadPhoto] storage error:', storageError)
    throw new Error('ファイルのアップロードに失敗しました')
  }

  // photos テーブルに INSERT（失敗時は Storage のファイルを削除してロールバック）
  const { data: photo, error: insertError } = await supabase
    .from('photos')
    .insert({ title, description: null, storage_path: storagePath, category: category || null })
    .select('id')
    .single()
  if (insertError || !photo) {
    await supabase.storage.from('photos').remove([storagePath])
    console.error('[uploadPhoto] insert error:', insertError)
    throw new Error('写真の登録に失敗しました')
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
    const { error: tagsError } = await supabase
      .from('photo_tags')
      .insert(allTagIds.map((tagId) => ({ photo_id: photo.id, tag_id: tagId })))
    if (tagsError) {
      console.error('[uploadPhoto] tags insert error:', tagsError)
      throw new Error('タグの関連付けに失敗しました')
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}
