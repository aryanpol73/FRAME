export type Photo = {
  id: string
  slug: string
  title: string | null
  caption: string | null
  cloudinary_public_id: string | null
  cloudinary_url: string
  series: string | null
  exif_location: string | null
  exif_shot_at: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type PhotoInsert = {
  id?: string
  slug: string
  title?: string | null
  caption?: string | null
  cloudinary_public_id?: string | null
  cloudinary_url: string
  series?: string | null
  exif_location?: string | null
  exif_shot_at?: string | null
  published?: boolean
  created_at?: string
  updated_at?: string
}

export type Series = {
  id: string
  name: string
  slug: string
  description: string | null
  cover_photo_id: string | null
  created_at: string
}

export type SeriesInsert = {
  id?: string
  name: string
  slug: string
  description?: string | null
  cover_photo_id?: string | null
  created_at?: string
}

export type ReactionType = "appreciate" | "beautiful" | "peaceful" | "caught_my_eye"

export type PhotoReaction = {
  id: string
  photo_id: string
  reaction_type: ReactionType
  client_id: string
  created_at: string
}

export type PhotoReactionInsert = {
  id?: string
  photo_id: string
  reaction_type: ReactionType
  client_id: string
  created_at?: string
}

export type GuestbookEntry = {
  id: string
  name: string
  message: string
  approved: boolean
  created_at: string
}

export type GuestbookEntryInsert = {
  id?: string
  name: string
  message: string
  approved?: boolean
  created_at?: string
}

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: Photo
        Insert: PhotoInsert
        Update: Partial<Photo>
        Relationships: []
      }
      series: {
        Row: Series
        Insert: SeriesInsert
        Update: Partial<Series>
        Relationships: []
      }
      photo_reactions: {
        Row: PhotoReaction
        Insert: PhotoReactionInsert
        Update: Partial<PhotoReaction>
        Relationships: []
      }
      guestbook_entries: {
        Row: GuestbookEntry
        Insert: GuestbookEntryInsert
        Update: Partial<GuestbookEntry>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
