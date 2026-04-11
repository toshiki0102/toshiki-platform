import type { Tables } from './database'

export type Photo = Tables<'photos'>
export type Tag = Tables<'tags'>
export type PhotoTag = Tables<'photo_tags'>

export type PhotoWithTags = Photo & {
  tags: Tag[]
}
