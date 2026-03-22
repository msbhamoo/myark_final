'use server';

import { createServerClient } from '@/lib/supabase-server';

export async function submitOpportunity(formData: FormData) {
  const supabase = createServerClient();
  
  const organizer_name = formData.get('organizer_name') as string;
  const contact_email = formData.get('contact_email') as string;
  const contact_mobile = formData.get('contact_mobile') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const eligible_classes = formData.get('eligible_classes') as string;
  const deadline = formData.get('deadline') as string;
  const registration_link = formData.get('registration_link') as string;
  const description = formData.get('description') as string;

  try {
    const { error } = await supabase
      .from('submitted_opportunities')
      .insert({
        organizer_name,
        contact_email,
        contact_mobile,
        title,
        category,
        eligible_classes,
        deadline,
        registration_link,
        description,
        status: 'pending'
      });

    if (error) {
      console.error('Submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Unexpected error:', err);
    return { success: false, error: errorMsg };
  }
}
