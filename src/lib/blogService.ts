import { getDb } from './firebaseAdmin'
import { BlogPost, BlogPostCreate, BlogPostUpdate, ShareCounts } from '@/types/blog'
import { FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'blogs'

function nowIso() {
  return new Date().toISOString()
}

export async function listPublishedBlogs(limit?: number): Promise<BlogPost[]> {
  const db = getDb()
  // Fetch published blogs by ordering on publishedAt only (no composite index needed)
  // Then filter by status in memory to avoid composite index requirement
  let q = db.collection(COLLECTION).orderBy('publishedAt', 'desc').limit(limit || 50)
  const snap = await q.get()
  const blogs = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) })) as BlogPost[]
  // Filter to only published blogs
  return blogs.filter((blog) => blog.status === 'published').slice(0, limit)
}

export async function listAllBlogs(): Promise<BlogPost[]> {
  const db = getDb()
  const snap = await db.collection(COLLECTION).orderBy('updatedAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as BlogPost[]
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const db = getDb()
  const snap = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...(doc.data() as any) } as BlogPost
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const db = getDb()
  const doc = await db.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...(doc.data() as any) } as BlogPost
}

export async function createBlog(input: BlogPostCreate): Promise<BlogPost> {
  const db = getDb()
  const timestamp = nowIso()
  const data: Omit<BlogPost, 'id'> = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    author: input.author,
    tags: input.tags || [],
    status: input.status || 'draft',
    publishedAt: input.publishedAt || (input.status === 'published' ? timestamp : undefined),
    createdAt: timestamp,
    updatedAt: timestamp,
    viewCount: input.viewCount ?? 0,
    shares: {
      facebook: 0,
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
      other: 0,
      ...(input.shares as ShareCounts | undefined),
    },
  }
  const ref = await db.collection(COLLECTION).add(data)
  return { id: ref.id, ...data }
}

export async function updateBlog(id: string, input: BlogPostUpdate): Promise<BlogPost | null> {
  const db = getDb()
  const existing = await db.collection(COLLECTION).doc(id).get()
  if (!existing.exists) return null
  const prev = existing.data() as BlogPost
  const data: any = {
    ...input,
    updatedAt: nowIso(),
    publishedAt: input.status === 'published' && !prev.publishedAt ? nowIso() : input.publishedAt ?? prev.publishedAt,
  }
  // Merge shares properly
  if (input.shares) {
    data.shares = { ...prev.shares, ...input.shares }
  }
  await db.collection(COLLECTION).doc(id).update(data)
  const updated = await db.collection(COLLECTION).doc(id).get()
  return { id: updated.id, ...(updated.data() as any) } as BlogPost
}

export async function deleteBlog(id: string): Promise<void> {
  const db = getDb()
  await db.collection(COLLECTION).doc(id).delete()
}

export async function incrementView(slug: string): Promise<void> {
  const db = getDb()
  const snap = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get()
  if (snap.empty) return
  const doc = snap.docs[0]
  await doc.ref.update({ viewCount: FieldValue.increment(1) })
}

export async function incrementShare(slug: string, network: keyof ShareCounts): Promise<void> {
  const db = getDb()
  const snap = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get()
  if (snap.empty) return
  const doc = snap.docs[0]
  await doc.ref.update({ [`shares.${network}`]: FieldValue.increment(1) })
}

export function validateSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}
