'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCareer(formData: FormData) {
  const supabase = createServerClient();
  
  const insertPayload: Record<string, unknown> = {};
  
  const fields = [
    'name', 'slug', 'category', 'subcategory', 'stream_required', 
    'short_description', 'full_description', 'what_you_do', 
    'is_this_for_you', 'how_to_prepare_in_school', 'salary_entry', 
    'salary_mid', 'salary_senior', 'salary_global', 'degree_required', 
    'duration', 'rarity_level', 'demand_level', 'competition_level'
  ];
  
  fields.forEach(f => {
      insertPayload[f] = formData.get(f) as string;
  });
  
  insertPayload.is_published = formData.get('is_published') === 'on';
  
  const arrayFields = ['entrance_exams', 'colleges_india', 'colleges_global', 'top_employers', 'skills_needed', 'tags', 'related_careers'];
  arrayFields.forEach(f => {
      const val = formData.get(f) as string;
      if (val) {
          insertPayload[f] = val.split(',').map(s => s.trim()).filter(Boolean);
      } else {
          insertPayload[f] = [];
      }
  });

  const { error } = await supabase.from('career_directory').insert(insertPayload);
  
  if (error) throw new Error(error.message);
  revalidatePath('/admin/careers');
  redirect('/admin/careers');
}

export async function updateCareer(id: string, formData: FormData) {
  const supabase = createServerClient();
  
  const updates: Record<string, unknown> = {};
  
  const fields = [
    'name', 'slug', 'category', 'subcategory', 'stream_required', 
    'short_description', 'full_description', 'what_you_do', 
    'is_this_for_you', 'how_to_prepare_in_school', 'salary_entry', 
    'salary_mid', 'salary_senior', 'salary_global', 'degree_required', 
    'duration', 'rarity_level', 'demand_level', 'competition_level'
  ];
  
  fields.forEach(f => {
      updates[f] = formData.get(f) as string;
  });
  
  updates.is_published = formData.get('is_published') === 'on';
  
  const arrayFields = ['entrance_exams', 'colleges_india', 'colleges_global', 'top_employers', 'skills_needed', 'tags', 'related_careers'];
  arrayFields.forEach(f => {
      const val = formData.get(f) as string;
      if (val) {
          updates[f] = val.split(',').map(s => s.trim()).filter(Boolean);
      } else {
          updates[f] = [];
      }
  });

  const { data, error } = await supabase.from('career_directory').update(updates).eq('id', id).select().single();
  
  if (error) throw new Error(error.message);
  revalidatePath('/admin/careers');
  revalidatePath(`/admin/careers/${id}/edit`);
  revalidatePath(`/careers/${updates.slug}`);
  return data;
}

export async function checkDuplicateCareer(name: string, excludeId?: string) {
  if (!name || name.length < 3) return { exists: false, matches: [] };
  const supabase = createServerClient();
  let query = supabase.from('career_directory').select('id, name').ilike('name', `%${name.trim()}%`).limit(3);
  if (excludeId) query = query.neq('id', excludeId);
  const { data } = await query;
  return { exists: (data || []).length > 0, matches: data || [] };
}
