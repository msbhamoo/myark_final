'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function approveSubmission(id: string | number) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('submitted_opportunities')
    .update({ status: 'Approved' })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/submissions');
  return { success: true };
}

export async function rejectSubmission(id: string | number) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('submitted_opportunities')
    .update({ status: 'Rejected' })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/submissions');
  return { success: true };
}
