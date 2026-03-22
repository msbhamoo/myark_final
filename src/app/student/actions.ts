'use server';

import { createServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Log a view for an opportunity if the student is registered.
 */
export async function logOpportunityView(opportunityId: string) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;

  const supabase = createServerClient();
  
  if (studentId) {
    // Check if we already logged this view recently for this student
    const { data: existing } = await supabase
      .from('student_views')
      .select('id')
      .eq('student_id', studentId)
      .eq('opportunity_id', opportunityId)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // 1 hour
      .maybeSingle();

    if (!existing) {
      await supabase.from('student_views').insert({
        student_id: studentId,
        opportunity_id: opportunityId
      });
    }
  } else {
    // Log anonymous view (try-catch allows fail gracefully if DB schema enforces NOT NULL on student_id)
    try {
      await supabase.from('student_views').insert({
        opportunity_id: opportunityId,
        student_id: null
      });
    } catch {}
  }
}

/**
 * Update the feedback status for a registration.
 */
export async function updateRegistrationFeedback(opportunityId: string, status: string, note?: string) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;

  if (!studentId) return { error: 'Not logged in' };

  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('registrations')
    .update({ 
      feedback_status: status,
      feedback_note: note 
    })
    .eq('student_id', studentId)
    .eq('opportunity_id', opportunityId);

  if (error) return { error: error.message };
  
  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath('/student/dashboard');
  return { success: true };
}

/**
 * Update student profile information.
 */
export async function updateStudentProfile(formData: FormData) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;

  if (!studentId) return { error: 'Not logged in' };

  const name = formData.get('name') as string;
  const studentClass = formData.get('student_class') as string;
  const schoolName = formData.get('school_name') as string;

  if (!name || !studentClass || !schoolName) {
    return { error: 'All fields are required' };
  }

  const supabase = createServerClient();
  
  const { error, data } = await supabase
    .from('students')
    .update({ 
      name,
      student_class: studentClass,
      school_name: schoolName 
    })
    .eq('id', studentId)
    .select();

  if (error) return { error: error.message };
  
  if (!data || data.length === 0) {
    // If we get here, RLS (Row Level Security) might be blocking the update, or the student ID is completely invalid.
    return { error: 'Failed to update profile. It may be restricted by database security rules or the account is missing.' };
  }
  
  revalidatePath('/student/dashboard');
  return { success: true };
}

/**
 * Toggle saving an opportunity for later.
 */
export async function toggleSaveOpportunity(opportunityId: string) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;

  if (!studentId) return { error: 'Not logged in' };

  const supabase = createServerClient();
  
  // Check if already saved
  const { data: existing } = await supabase
    .from('student_saves')
    .select('id')
    .eq('student_id', studentId)
    .eq('opportunity_id', opportunityId)
    .maybeSingle();

  if (existing) {
    // Unsave
    await supabase
      .from('student_saves')
      .delete()
      .eq('id', existing.id);
    return { saved: false };
  } else {
    // Save
    await supabase
      .from('student_saves')
      .insert({
        student_id: studentId,
        opportunity_id: opportunityId
      });
    return { saved: true };
  }
}
