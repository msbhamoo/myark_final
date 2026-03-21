'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
  const supabase = createServerClient();
  
  const label = formData.get('label') as string;
  const slug = formData.get('slug') as string;
  const icon_name = formData.get('icon_name') as string;
  const bg_color = formData.get('bg_color') as string;
  const text_color = formData.get('text_color') as string;
  const sort_order = Number(formData.get('sort_order')) || 0;

  const { error } = await supabase.from('categories').insert({
    label,
    slug,
    icon_name,
    bg_color,
    text_color,
    sort_order
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}
