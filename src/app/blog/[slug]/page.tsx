import { notFound } from 'next/navigation'
import { getBlogBySlug, listPublishedBlogs } from '@/lib/blogService'
import Link from 'next/link'
import React from 'react'
import { ShareButtons } from '@/components/BlogShareButtons'
import { ArrowLeft, Eye, Share2, Calendar, User } from 'lucide-react'
import { ViewCounter } from '@/components/ViewCounter'

function Markdown({ content }: { content: string }) {
  // Check if content looks like HTML (from rich editor)
  const isHtml = /<[a-z][\s\S]*>/i.test(content)

  if (isHtml) {
    return (
      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Fallback: Convert simple markdown to HTML with proper Tailwind styling
  let html = content
    .split('\n')
    .map((line) => {
      // Headers
      if (line.startsWith('### ')) {
        return `<h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">${line.substring(4)}</h3>`
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-3xl font-bold text-slate-900 dark:text-white mt-10 mb-5">${line.substring(3)}</h2>`
      }
      if (line.startsWith('# ')) {
        return `<h1 class="text-4xl font-bold text-slate-900 dark:text-white mt-12 mb-6">${line.substring(2)}</h1>`
      }
      // Bold and italic
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      line = line.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Line breaks for non-empty lines
      if (line.trim()) {
        return `<p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">${line}</p>`
      }
      return ''
    })
    .join('')

  return <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post || post.status !== 'published') return notFound()

  // Get related posts (same tags)
  const allPosts = await listPublishedBlogs(50)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.tags?.some(tag => post.tags?.includes(tag)))
    .slice(0, 3)

  const totalShares = Object.values(post.shares || {}).reduce((a, b) => a + (b as number), 0)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <ViewCounter slug={post.slug} />
      {/* Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 mb-6 transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 md:px-6 py-12 md:py-16">
        <article className="space-y-8">
          {/* Title and Meta */}
          <div className="space-y-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
              {post.author && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.author}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Author</p>
                  </div>
                </div>
              )}

              {post.publishedAt && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{post.viewCount || 0} views</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 h-96 md:h-[500px] border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose-content max-w-none">
            <Markdown content={post.content} />
          </div>

          {/* Share Section */}
          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Found this helpful?</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Share this post with others</p>
              </div>
              <div className="flex items-center gap-3">
                <ShareButtons slug={post.slug} title={post.title} />
                <span className="text-sm text-slate-600 dark:text-slate-400 pl-3 border-l border-slate-200 dark:border-slate-700">
                  {totalShares} shares
                </span>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-slate-50 transition hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/50">
                    {rp.coverImage && (
                      <div className="relative h-40 overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={rp.coverImage}
                          alt={rp.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {rp.publishedAt ? new Date(rp.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
