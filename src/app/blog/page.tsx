import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { BlogPost } from '@/lib/types';
import { generateBreadcrumbJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog — Tips, Guides & Updates for Students | Myark',
  description: 'Read the latest articles on scholarships, olympiads, career guidance, and study tips for school students in India. Stay updated with Myark Blog.',
};

export default async function BlogListingPage() {
  const supabase = createServerClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const allPosts: BlogPost[] = posts || [];
  const featuredPost = allPosts.find(p => p.is_featured);
  const regularPosts = allPosts.filter(p => p.id !== featuredPost?.id);
  const categories = Array.from(new Set(allPosts.map(p => p.category)));

  return (
    <div className="bg-[#f9fafb] dark:bg-gray-950 min-h-screen font-sans text-gray-900 dark:text-gray-100 selection:bg-[#70A5FF]/30 transition-colors">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd([
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]))
        }}
      />

      {/* Hero */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-28 pb-16 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f0fdf4]/50 dark:bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e0f2fe]/40 dark:bg-sky-500/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="container-main max-w-[1240px] px-4 relative z-10">
          <nav className="flex items-center gap-2 mb-8 text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#1B4332] dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1B4332] dark:text-blue-300">Blog</span>
          </nav>

          <h1 className="text-[42px] md:text-[60px] font-heading font-extrabold text-[#1B4332] dark:text-blue-50 leading-[1.05] tracking-tight mb-5">
            Myark Blog
          </h1>
          <p className="text-[18px] md:text-[22px] text-gray-600 dark:text-gray-300 max-w-3xl font-medium leading-relaxed">
            Guides, tips, and stories to help school students discover their best opportunities.
          </p>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {categories.map(cat => (
                <span key={cat} className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-[12px] font-bold rounded-full uppercase tracking-widest hover:bg-[#1B4332] hover:text-white dark:hover:bg-blue-900/50 dark:hover:text-blue-300 transition-colors cursor-pointer">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-main max-w-[1240px] px-4 py-16">
        {allPosts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">We&apos;re working on amazing content for students. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="block group">
                <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {featuredPost.cover_image && (
                      <div className="h-64 lg:h-auto bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={featuredPost.cover_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className={`p-8 md:p-12 flex flex-col justify-center ${!featuredPost.cover_image ? 'lg:col-span-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[11px] font-bold rounded-full uppercase tracking-widest border border-purple-200 dark:border-purple-800/50">Featured</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[11px] font-bold rounded-full uppercase tracking-widest border border-gray-200 dark:border-white/10">{featuredPost.category}</span>
                      </div>
                      <h2 className="text-[28px] md:text-[36px] font-heading font-extrabold text-[#1B4332] dark:text-blue-50 leading-tight mb-4 group-hover:text-[#166534] dark:group-hover:text-blue-300 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-[16px] leading-relaxed mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        <span>{featuredPost.author}</span>
                        <span>·</span>
                        <span>{featuredPost.read_time_minutes} min read</span>
                        {featuredPost.published_at && (
                          <>
                            <span>·</span>
                            <span>{new Date(featuredPost.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {post.cover_image ? (
                        <div className="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 flex items-center justify-center">
                          <svg className="w-12 h-12 text-blue-200 dark:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-md uppercase tracking-widest border border-gray-200 dark:border-white/10">{post.category}</span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{post.read_time_minutes} min</span>
                        </div>
                        <h3 className="text-[18px] font-heading font-bold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-[#1B4332] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-[14px] leading-relaxed line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                          <span>{post.author}</span>
                          {post.published_at && (
                            <>
                              <span>·</span>
                              <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
