import Link from 'next/link';
import { NewBlogForm } from './NewBlogForm';

export default function NewBlogPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/blog" className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Blog</Link>
        <span className="text-gray-400">/</span>
        <span className="text-sm font-medium">Create New Post</span>
      </div>
      <NewBlogForm />
    </div>
  );
}
