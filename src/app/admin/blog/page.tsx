import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { BlogActions } from './BlogActions';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const supabase = createServerClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  const typedPosts: BlogPost[] = posts || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-[#161616] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Blog Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm pb-0">Create, edit, and manage blog articles.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/new" className="btn btn-primary shadow-sm bg-[#0066FF] text-white hover:bg-[#0050CC] px-4 py-2 rounded-lg font-bold">
            + New Post
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: typedPosts.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Published', value: typedPosts.filter(p => p.is_published).length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Drafts', value: typedPosts.filter(p => !p.is_published).length, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Featured', value: typedPosts.filter(p => p.is_featured).length, color: 'text-purple-600 dark:text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm transition-colors">
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider transition-colors">
              <tr>
                <th className="px-6 py-4">Post Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Read Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-900 dark:text-gray-100">
              {typedPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span className="font-medium">No blog posts yet. Create your first article!</span>
                    </div>
                  </td>
                </tr>
              )}
              {typedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-white text-base max-w-[300px] truncate">{post.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md text-xs border border-gray-200 dark:border-white/10 transition-colors font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {post.read_time_minutes} min
                  </td>
                  <td className="px-6 py-4">
                    {post.is_published ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-100/10 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-400/20 transition-colors">Published</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-white/10 transition-colors">Draft</span>
                    )}
                    {post.is_featured && (
                      <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-100/10 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-400/20 transition-colors">★</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <BlogActions post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
