import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { EditBlogForm } from './EditBlogForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/blog" className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Blog</Link>
        <span className="text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{post.title}</span>
        <span className="text-gray-400">/</span>
        <span className="text-sm font-medium">Edit</span>
      </div>
      <EditBlogForm post={post} />
    </div>
  );
}
