import { listPublishedBlogs } from '@/lib/blogService'
import { Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogListClient } from '@/components/blog/BlogListClient'

export const metadata = { title: 'Blog - Myark' }
export const dynamic = 'force-dynamic'

export default async function BlogListPage() {
  const posts = await listPublishedBlogs(50)

  const allTags = posts.length > 0
    ? Array.from(new Set(posts.flatMap(p => p.tags || [])))
    : []

  return (
    <>
      <Header />
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
          <BlogListClient posts={posts} allTags={allTags} />
        </div>
      </div>
      <Footer />
    </>
  )
}
