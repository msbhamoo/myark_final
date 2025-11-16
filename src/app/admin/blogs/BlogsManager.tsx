"use client"

import { useEffect, useMemo, useState } from 'react'
import { BlogPost, BlogStatus } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Eye, Share2, Calendar, Tag, FileText } from 'lucide-react'

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function BlogsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    tags: '' as any,
    status: 'draft' as BlogStatus,
    publishedAt: ''
  })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/admin/blogs', { cache: 'no-store' })
        const data = await res.json()
        setPosts(data.posts || [])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (!form.slug && form.title) setForm((f) => ({ ...f, slug: slugify(form.title) }))
  }, [form.title])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
  }, [query, posts])

  const resetForm = () => {
    setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', author: '', tags: '', status: 'draft', publishedAt: '' })
    setEditing(null)
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (p: BlogPost) => {
    setEditing(p)
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || '',
      author: p.author || '',
      tags: (p.tags || []).join(', '),
      status: p.status,
      publishedAt: p.publishedAt || ''
    })
    setShowForm(true)
  }

  const save = async () => {
    const payload = {
      ...form,
      tags: String(form.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    const method = editing ? 'PATCH' : 'POST'
    const url = editing ? `/api/admin/blogs/${editing.id}` : '/api/admin/blogs'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) {
      alert('Failed to save')
      return
    }
    const data = await res.json()
    if (editing) {
      setPosts((prev) => prev.map((p) => (p.id === editing.id ? data.post : p)))
    } else {
      setPosts((prev) => [data.post, ...prev])
    }
    setShowForm(false)
    resetForm()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Failed to delete')
      return
    }
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const publishedCount = posts.filter(p => p.status === 'published').length
  const draftCount = posts.filter(p => p.status === 'draft').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage all blog posts and content</p>
        </div>
        <Button 
          onClick={openCreate}
          className="gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Posts</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{posts.length}</div>
        </div>
        <div className="rounded-lg border border-green-200/60 dark:border-green-700/30 bg-green-50 dark:bg-green-500/5 p-4">
          <div className="text-sm font-medium text-green-700 dark:text-green-400">Published</div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 mt-2">{publishedCount}</div>
        </div>
        <div className="rounded-lg border border-yellow-200/60 dark:border-yellow-700/30 bg-yellow-50 dark:bg-yellow-500/5 p-4">
          <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Drafts</div>
          <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mt-2">{draftCount}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input 
          placeholder="Search by title or slug..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="pl-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 border-dashed bg-slate-50 dark:bg-slate-900/30 py-12 text-center">
          <FileText className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const totalShares = Object.values(p.shares || {}).reduce((a, b) => a + (b as number), 0)
            return (
              <Card 
                key={p.id} 
                className="overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Image */}
                {p.coverImage && (
                  <div className="relative h-40 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === 'published' 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-yellow-500/90 text-white'
                      }`}>
                        {p.status === 'published' ? '✓ Published' : '◯ Draft'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {p.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    {p.excerpt}
                  </p>

                  {/* Tags */}
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-300">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 2 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">+{p.tags.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      <span>{p.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-3 w-3" />
                      <span>{totalShares} shares</span>
                    </div>
                    {p.publishedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(p.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEdit(p)}
                      className="flex-1 gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => remove(p.id)}
                      className="flex-1 gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-900 dark:text-white">
              {editing ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Title</Label>
                <Input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Post title"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Slug</Label>
                <Input 
                  value={form.slug} 
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="post-slug"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">Excerpt</Label>
              <Input 
                value={form.excerpt} 
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short description for preview"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">Cover Image URL</Label>
              <Input 
                value={form.coverImage} 
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Author & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Author</Label>
                <Input 
                  value={form.author} 
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Tags (comma separated)</Label>
                <Input 
                  value={form.tags} 
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Status & Publish Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Status</Label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value as BlogStatus })}
                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Publish Date (optional)</Label>
                <Input 
                  type="datetime-local" 
                  value={form.publishedAt} 
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">Content (Markdown)</Label>
              <Textarea 
                value={form.content} 
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your content in Markdown..."
                className="min-h-80 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 font-mono text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button 
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={save}
                className="gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
              >
                {editing ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
