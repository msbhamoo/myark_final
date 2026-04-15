'use client';

import { BlogEditor } from '@/components/admin/BlogEditor';
import { ImageKitUploader } from '@/components/admin/ImageKitUploader';
import { createBlogPost } from '../actions';
import { useState } from 'react';

export function NewBlogForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [coverImage, setCoverImage] = useState('');

  const generateSlug = (t: string) => {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  return (
    <form action={createBlogPost} className="space-y-8">
      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post Details</h2>

        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
              placeholder="Your amazing blog post title"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Slug
              <button type="button" onClick={() => { setAutoSlug(!autoSlug); }} className="ml-2 text-[10px] text-blue-500 normal-case tracking-normal">
                {autoSlug ? '(auto — click to edit manually)' : '(manual — click for auto)'}
              </button>
            </label>
            <input
              type="text"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              readOnly={autoSlug}
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none ${autoSlug ? 'opacity-60' : ''}`}
              placeholder="auto-generated-slug"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Excerpt / Summary</label>
          <textarea
            name="excerpt"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none resize-none"
            placeholder="A short summary of the post that appears on listing pages and in SEO meta..."
          />
        </div>

        {/* Category & Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <select
              name="category"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
            >
              <option value="General">General</option>
              <option value="Education">Education</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Olympiads">Olympiads</option>
              <option value="Study Tips">Study Tips</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Competitions">Competitions</option>
              <option value="News">News</option>
              <option value="Success Stories">Success Stories</option>
              <option value="Parents Guide">Parents Guide</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Author</label>
            <input
              type="text"
              name="author"
              defaultValue="Myark Team"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <ImageKitUploader
          onUpload={(url) => setCoverImage(url)}
          currentImage={null}
          label="Cover Image"
        />
        <input type="hidden" name="cover_image" value={coverImage} />

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
            placeholder="scholarship, olympiad, tips"
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content</h2>
        <BlogEditor name="content" placeholder="Start writing your blog post... Use the toolbar or switch to HTML mode for full control." />
      </div>

      {/* SEO Section */}
      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          SEO Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Meta Title</label>
            <input
              type="text"
              name="meta_title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
              placeholder="Custom page title for SEO (optional)"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Meta Description</label>
            <input
              type="text"
              name="meta_description"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all outline-none"
              placeholder="Custom meta description for SEO (optional)"
            />
          </div>
        </div>
      </div>

      {/* Publish Options */}
      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm transition-colors">
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" name="is_published" className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0 cursor-pointer" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Publish immediately</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" name="is_featured" className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Mark as featured</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-8 py-3 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0050CC] shadow-lg shadow-[#0066FF]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Post
        </button>
      </div>
    </form>
  );
}
