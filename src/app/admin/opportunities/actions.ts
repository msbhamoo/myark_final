'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOpportunity(formData: FormData) {
  const supabase = createServerClient();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category_id = formData.get('category_id') as string;
  const organiser_id = formData.get('organiser_id') as string;
  const description = formData.get('description') as string;
  const eligibility_text = formData.get('eligibility_text') as string;
  const eligibility_classes = formData.getAll('eligibility_classes').map(c => parseInt(c as string, 10)).filter(n => !isNaN(n));
  const registration_url = formData.get('registration_url') as string;
  const registration_opens = formData.get('registration_opens') as string;
  const registration_opens_tentative = formData.get('registration_opens_tentative') as string;
  const deadline = formData.get('deadline') as string;
  const deadline_tentative = formData.get('deadline_tentative') as string;
  const event_date = formData.get('event_date') as string;
  const event_date_tentative = formData.get('event_date_tentative') as string;
  const is_ongoing = formData.get('is_ongoing') === 'on';
  const fee_text = formData.get('fee_text') as string;
  const prize_text = formData.get('prize_text') as string;
  const how_to_apply = formData.get('how_to_apply') as string;
  const is_featured = formData.get('is_featured') === 'on';
  const is_verified = formData.get('is_verified') === 'on';
  const is_published = formData.get('is_published') === 'on';

  const { error } = await supabase.from('opportunities').insert({
    title, slug, category_id, organiser_id, description,
    eligibility_text, eligibility_classes,
    registration_url,
    registration_opens: registration_opens || null,
    registration_opens_tentative: registration_opens_tentative || null,
    deadline: deadline || null,
    deadline_tentative: deadline_tentative || null,
    event_date: event_date || null,
    event_date_tentative: event_date_tentative || null,
    is_ongoing, fee_text, prize_text, how_to_apply,
    is_featured, is_verified, is_published,
    faqs: []
  });

  if (error) {
    console.error('Error creating opportunity:', error);
    throw new Error('Failed to create opportunity');
  }

  revalidatePath('/admin/opportunities');
  redirect('/admin/opportunities');
}

export async function updateOpportunity(id: string, formData: FormData) {
  const supabase = createServerClient();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category_id = formData.get('category_id') as string;
  const organiser_id = formData.get('organiser_id') as string;
  const description = formData.get('description') as string;
  const eligibility_text = formData.get('eligibility_text') as string;
  const eligibility_classes = formData.getAll('eligibility_classes').map(c => parseInt(c as string, 10)).filter(n => !isNaN(n));
  const registration_url = formData.get('registration_url') as string;
  const registration_opens = formData.get('registration_opens') as string;
  const registration_opens_tentative = formData.get('registration_opens_tentative') as string;
  const deadline = formData.get('deadline') as string;
  const deadline_tentative = formData.get('deadline_tentative') as string;
  const event_date = formData.get('event_date') as string;
  const event_date_tentative = formData.get('event_date_tentative') as string;
  const is_ongoing = formData.get('is_ongoing') === 'on';
  const fee_text = formData.get('fee_text') as string;
  const prize_text = formData.get('prize_text') as string;
  const how_to_apply = formData.get('how_to_apply') as string;
  const is_featured = formData.get('is_featured') === 'on';
  const is_verified = formData.get('is_verified') === 'on';
  const is_published = formData.get('is_published') === 'on';

  const { error } = await supabase.from('opportunities').update({
    title, slug, category_id, organiser_id, description,
    eligibility_text, eligibility_classes,
    registration_url,
    registration_opens: registration_opens || null,
    registration_opens_tentative: registration_opens_tentative || null,
    deadline: deadline || null,
    deadline_tentative: deadline_tentative || null,
    event_date: event_date || null,
    event_date_tentative: event_date_tentative || null,
    is_ongoing, fee_text, prize_text, how_to_apply,
    is_featured, is_verified, is_published,
  }).eq('id', id);

  if (error) {
    console.error('Error updating opportunity:', error);
    throw new Error('Failed to update opportunity');
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

export interface BulkImportRow {
  title: string;
  slug: string;
  category: string;
  organiser: string;
  description: string;
  eligibility_text: string;
  eligibility_classes: string;
  registration_url: string;
  registration_opens: string;
  deadline: string;
  deadline_tentative: string;
  is_ongoing: string;
  fee_text: string;
  prize_text: string;
  how_to_apply: string;
  is_published: string;
  is_verified: string;
}

export interface BulkImportResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export async function bulkImportOpportunities(rows: BulkImportRow[]): Promise<BulkImportResult> {
  const supabase = createServerClient();

  const [{ data: cats }, { data: orgs }] = await Promise.all([
    supabase.from('categories').select('id, label'),
    supabase.from('organisers').select('id, name'),
  ]);

  const catMap = new Map((cats || []).map(c => [c.label.toLowerCase().trim(), c.id]));
  const orgMap = new Map((orgs || []).map(o => [o.name.toLowerCase().trim(), o.id]));

  const result: BulkImportResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    if (!row.title?.trim()) { result.errors.push({ row: rowNum, message: 'Title is required' }); result.failed++; continue; }
    if (!row.slug?.trim()) { result.errors.push({ row: rowNum, message: 'Slug is required' }); result.failed++; continue; }
    if (!row.registration_url?.trim()) { result.errors.push({ row: rowNum, message: 'Registration URL is required' }); result.failed++; continue; }

    const catId = catMap.get(row.category?.toLowerCase().trim() || '');
    if (!catId) { result.errors.push({ row: rowNum, message: `Category "${row.category}" not found` }); result.failed++; continue; }

    const orgId = orgMap.get(row.organiser?.toLowerCase().trim() || '');
    if (!orgId) { result.errors.push({ row: rowNum, message: `Organiser "${row.organiser}" not found` }); result.failed++; continue; }

    const eligClasses = (row.eligibility_classes || '').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

    const { error } = await supabase.from('opportunities').insert({
      title: row.title.trim(),
      slug: row.slug.trim(),
      category_id: catId,
      organiser_id: orgId,
      description: row.description?.trim() || '',
      eligibility_text: row.eligibility_text?.trim() || '',
      eligibility_classes: eligClasses,
      registration_url: row.registration_url.trim(),
      registration_opens: row.registration_opens?.trim() || null,
      deadline: row.deadline?.trim() || null,
      deadline_tentative: row.deadline_tentative?.trim() || null,
      is_ongoing: row.is_ongoing?.toLowerCase() === 'true' || row.is_ongoing === '1',
      fee_text: row.fee_text?.trim() || 'Free',
      prize_text: row.prize_text?.trim() || null,
      how_to_apply: row.how_to_apply?.trim() || '',
      is_published: row.is_published?.toLowerCase() !== 'false' && row.is_published !== '0',
      is_verified: row.is_verified?.toLowerCase() === 'true' || row.is_verified === '1',
      is_featured: false,
      faqs: [],
    });

    if (error) { result.errors.push({ row: rowNum, message: error.message }); result.failed++; }
    else { result.success++; }
  }

  revalidatePath('/admin/opportunities');
  return result;
}
