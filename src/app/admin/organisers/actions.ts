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

export interface BulkOrganiserRow {
  name: string;
  slug: string;
  description: string;
  website_url: string;
}

export interface BulkOrganiserResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export async function bulkImportOrganisers(rows: BulkOrganiserRow[]): Promise<BulkOrganiserResult> {
  const supabase = createServerClient();
  const result: BulkOrganiserResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    if (!row.name?.trim()) { result.errors.push({ row: rowNum, message: 'Name is required' }); result.failed++; continue; }
    if (!row.slug?.trim()) { result.errors.push({ row: rowNum, message: 'Slug is required' }); result.failed++; continue; }

    const { error } = await supabase.from('organisers').insert({
      name: row.name.trim(),
      slug: row.slug.trim(),
      description: row.description?.trim() || null,
      website_url: row.website_url?.trim() || null,
    });

    if (error) { result.errors.push({ row: rowNum, message: error.message }); result.failed++; }
    else { result.success++; }
  }

  revalidatePath('/admin/organisers');
  return result;
}
