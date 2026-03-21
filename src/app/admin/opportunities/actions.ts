'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOpportunity(formData: FormData) {
  const supabase = createServerClient();

  // Basic fields
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category_id = formData.get('category_id') as string;
  const organiser_id = formData.get('organiser_id') as string;
  const description = formData.get('description') as string;
  
  // Eligibility
  const eligibility_text = formData.get('eligibility_text') as string;
  const eligibility_classes_str = formData.getAll('eligibility_classes');
  // Need to parse checkbox array into integer array
  const eligibility_classes = eligibility_classes_str.map(c => parseInt(c as string, 10)).filter(n => !isNaN(n));

  // Dates & URLs
  const registration_url = formData.get('registration_url') as string;
  const registration_opens = formData.get('registration_opens') as string;
  const deadline = formData.get('deadline') as string;
  const is_ongoing = formData.get('is_ongoing') === 'on';

  // Details
  const fee_text = formData.get('fee_text') as string;
  const prize_text = formData.get('prize_text') as string;
  const how_to_apply = formData.get('how_to_apply') as string;
  
  // Statuses
  const is_featured = formData.get('is_featured') === 'on';
  const is_verified = formData.get('is_verified') === 'on';
  const is_published = formData.get('is_published') === 'on';

  const { error } = await supabase.from('opportunities').insert({
    title,
    slug,
    category_id,
    organiser_id,
    description,
    eligibility_text,
    eligibility_classes,
    registration_url,
    registration_opens: registration_opens || null,
    deadline: deadline || null,
    is_ongoing,
    fee_text,
    prize_text,
    how_to_apply,
    is_featured,
    is_verified,
    is_published,
    faqs: [] // Init empty, complex JSON editor out of MVP scope
  });

  if (error) {
    console.error('Error creating opportunity:', error);
    throw new Error('Failed to create opportunity');
  }

  revalidatePath('/admin/opportunities');
  redirect('/admin/opportunities');
}

export async function deleteOpportunity(id: string) {
  const supabase = createServerClient();
  
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw new Error('Failed to delete opportunity');
  
  revalidatePath('/admin/opportunities');
}
