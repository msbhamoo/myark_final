import Link from 'next/link'
import { listPublishedBlogs } from '@/lib/blogService'
import { ChevronRight, Sparkles } from 'lucide-react'

export const metadata = { title: 'Blog - Myark' }
export const dynamic = 'force-dynamic'

export default async function BlogListPage() {
  const posts = await listPublishedBlogs(50)
  
  const categories = posts.length > 0 
    ? Array.from(new Set(posts.flatMap(p => p.tags || []))) 
    : []

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-50 via-white to-orange-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 mb-6 dark:bg-orange-500/20">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Insights & Stories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Discover tips, success stories, and expert insights to help you make the most of every opportunity
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16 py-16 md:py-20">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-900/50 py-16 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-10">
            {/* Featured Post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className="group block">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg transition hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/80">
                  {/* Image */}
                  {posts[0].coverImage && (
                    <div className="relative md:col-span-3 h-64 md:h-80 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={posts[0].coverImage}
                        alt={posts[0].title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                          Featured
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {posts[0].title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                        {posts[0].excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {posts[0].publishedAt ? new Date(posts[0].publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                        {posts[0].author && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">{posts[0].author}</span>
                          </>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/80 h-full">
                  {/* Image */}
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      {post.tags && post.tags[0] && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center rounded-full bg-orange-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                            {post.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                      </div>
                      {post.author && (
                        <span className="text-xs font-medium text-slate-900 dark:text-slate-300">
                          {post.author.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
