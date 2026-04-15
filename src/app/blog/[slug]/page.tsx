import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { generateBreadcrumbJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import { BlogShareBar } from '@/components/BlogShareBar';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
    .limit(100);

  return (posts || []).map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image')
    .eq('slug', params.slug)
    .single();

  if (!post) return { title: 'Post Not Found' };

  const title = post.meta_title || `${post.title} | Myark Blog`;
  const description = post.meta_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!post) notFound();

  // Fetch related posts from same category
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, author, read_time_minutes, published_at')
    .eq('is_published', true)
    .eq('category', post.category)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const publishDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

  return (
    <div className="bg-[#f9fafb] dark:bg-gray-950 min-h-screen font-sans text-gray-900 dark:text-gray-100 selection:bg-[#70A5FF]/30 transition-colors">
      {/* SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.cover_image || undefined,
            "datePublished": post.published_at,
            "dateModified": post.updated_at || post.published_at,
            "author": {
              "@type": "Person",
              "name": post.author,
            },
            "publisher": {
              "@type": "Organization",
              "name": "Myark",
              "url": SITE_URL,
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/logo.png`,
              }
            },
            "mainEntityOfPage": `${SITE_URL}/blog/${post.slug}`,
            "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd([
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: `/blog/${post.slug}` },
          ]))
        }}
      />

      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-28 pb-16 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f0fdf4]/40 dark:bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="container-main max-w-[800px] px-4 relative z-10">
          <nav className="flex items-center gap-2 mb-8 text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#1B4332] dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#1B4332] dark:hover:text-blue-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#1B4332] dark:text-blue-300 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#1B4332]/5 dark:bg-blue-900/30 text-[#1B4332] dark:text-blue-400 text-[11px] font-bold rounded-full uppercase tracking-widest border border-[#1B4332]/10 dark:border-blue-800/50">{post.category}</span>
            <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{post.read_time_minutes} min read</span>
          </div>

          <h1 className="text-[32px] md:text-[48px] font-heading font-extrabold text-[#1B4332] dark:text-blue-50 leading-[1.1] tracking-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[18px] md:text-[20px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B4332] dark:bg-blue-800 text-white flex items-center justify-center text-xs font-black">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <span>{post.author}</span>
              </div>
              <span>·</span>
              <span>{publishDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <BlogShareBar title={post.title} slug={post.slug} excerpt={post.excerpt} />
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="container-main max-w-[900px] px-4 -mt-0">
          <div className="rounded-[24px] overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg -mt-0 relative z-10">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container-main max-w-[800px] px-4 py-16">
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-[#1B4332] dark:prose-headings:text-blue-400
            prose-h1:text-[32px] prose-h2:text-[26px] prose-h3:text-[22px]
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-[1.85] prose-p:text-[17px]
            prose-a:text-[#1B4332] dark:prose-a:text-blue-400 prose-a:font-bold prose-a:underline-offset-2 hover:prose-a:text-[#166534]
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-blockquote:border-l-4 prose-blockquote:border-[#70A5FF] dark:prose-blockquote:border-blue-600 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:rounded-r-2xl prose-blockquote:py-1 prose-blockquote:px-6
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[15px]
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:rounded-2xl prose-pre:border prose-pre:border-gray-800
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-ul:marker:text-[#70A5FF]
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[12px] font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share / Back */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#1B4332] dark:text-blue-400 font-bold text-sm hover:gap-3 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Back to Blog
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {post.views || 0} views
            </span>
            <BlogShareBar title={post.title} slug={post.slug} excerpt={post.excerpt} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-20 transition-colors">
          <div className="container-main max-w-[1240px] px-4">
            <div className="text-center mb-12">
              <h3 className="text-[28px] md:text-[36px] font-heading font-extrabold text-[#1B4332] dark:text-blue-400 mb-3">Keep Reading</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">More articles you might enjoy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                  <article className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-[24px] overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    {rp.cover_image ? (
                      <div className="h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-200 dark:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-[16px] font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#1B4332] dark:group-hover:text-blue-400 transition-colors line-clamp-2">{rp.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-[13px] line-clamp-2 flex-1">{rp.excerpt}</p>
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-3">
                        {rp.read_time_minutes} min · {rp.author}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
