'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { deleteBlogPost, toggleBlogPublish } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function BlogActions({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleBlogPublish(post.id, post.is_published);
      router.refresh();
    } catch (e) {
      alert('Failed to toggle status: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteBlogPost(post.id);
      router.refresh();
    } catch (e) {
      alert('Failed to delete: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 items-center text-sm font-bold">
      <Link
        href={`/admin/blog/${post.id}/edit`}
        className="text-[#0066FF] dark:text-blue-400 hover:text-blue-500 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
      >
        {post.is_published ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-500 dark:text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
