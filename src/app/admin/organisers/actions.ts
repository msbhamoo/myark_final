'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOrganiser(formData: FormData) {
  const supabase = createServerClient();
  
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const website_url = formData.get('website_url') as string;

  const { error } = await supabase.from('organisers').insert({
    name,
    slug,
    description: description || null,
    website_url: website_url || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/organisers');
  redirect('/admin/organisers');
}

export async function deleteOrganiser(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('organisers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/organisers');
}
