export type ShareCounts = {
  facebook: number
  twitter: number
  linkedin: number
  whatsapp: number
  other?: number
}

export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // markdown
  coverImage?: string
  author?: string
  tags?: string[]
  status: BlogStatus
  publishedAt?: string // ISO string
  createdAt: string // ISO string
  updatedAt: string // ISO string
  viewCount: number
  shares: ShareCounts
}

export type BlogPostCreate = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'shares'> & {
  viewCount?: number
  shares?: Partial<ShareCounts>
}

export type BlogPostUpdate = Partial<BlogPostCreate>
