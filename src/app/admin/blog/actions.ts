'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function createBlogPost(formData: FormData) {
  const supabase = createServerClient();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const content = formData.get('content') as string;
  const isPublished = formData.get('is_published') === 'on';
  const isFeatured = formData.get('is_featured') === 'on';
  const tagsRaw = formData.get('tags') as string;

  const insertPayload = {
    title,
    slug,
    excerpt: formData.get('excerpt') as string || '',
    content: content || '',
    cover_image: formData.get('cover_image') as string || null,
    category: formData.get('category') as string || 'General',
    tags: tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    author: formData.get('author') as string || 'Myark Team',
    is_published: isPublished,
    is_featured: isFeatured,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    read_time_minutes: estimateReadTime(content || ''),
    published_at: isPublished ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from('blog_posts').insert(insertPayload);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = createServerClient();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('is_published') === 'on';
  const isFeatured = formData.get('is_featured') === 'on';
  const tagsRaw = formData.get('tags') as string;

  const updates: Record<string, unknown> = {
    title,
    slug: formData.get('slug') as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    excerpt: formData.get('excerpt') as string || '',
    content: content || '',
    cover_image: formData.get('cover_image') as string || null,
    category: formData.get('category') as string || 'General',
    tags: tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    author: formData.get('author') as string || 'Myark Team',
    is_published: isPublished,
    is_featured: isFeatured,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    read_time_minutes: estimateReadTime(content || ''),
    updated_at: new Date().toISOString(),
  };

  // Set published_at on first publish
  if (isPublished) {
    const { data: existing } = await supabase.from('blog_posts').select('published_at').eq('id', id).single();
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase.from('blog_posts').update(updates).eq('id', id).select().single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  return data;
}

export async function deleteBlogPost(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function toggleBlogPublish(id: string, currentStatus: boolean) {
  const supabase = createServerClient();
  const updates: Record<string, unknown> = {
    is_published: !currentStatus,
    updated_at: new Date().toISOString(),
  };
  if (!currentStatus) {
    // Publishing for the first time
    const { data: existing } = await supabase.from('blog_posts').select('published_at').eq('id', id).single();
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }
  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
