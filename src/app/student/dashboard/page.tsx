import { createServerClient } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { EditProfile } from './EditProfile';
import { Opportunity } from '@/lib/types';

interface StudentView {
  id: string;
  opportunity_id: string;
  created_at: string;
  opportunity: Opportunity;
}

export default async function StudentDashboard() {
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;

  if (!studentId) {
    redirect('/opportunities');
  }

  const supabase = createServerClient();

  // Fetch student details
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single();

  if (!student) {
    redirect('/opportunities');
  }

  // Fetch applied opportunities
  const { data: applied } = await supabase
    .from('registrations')
    .select('*, opportunity:opportunities(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  // Fetch saved opportunities
  const { data: saved } = await supabase
    .from('student_saves')
    .select('*, opportunity:opportunities(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  // Fetch browsing history (first 10 unique views)
  const { data: views } = await supabase
    .from('student_views')
    .select('*, opportunity:opportunities(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(30);

  // Group views to avoid duplicates in the list
  // Group views to avoid duplicates in the list
  const uniqueViews = (views as unknown as StudentView[] || []).reduce((acc: StudentView[], current: StudentView) => {
    const x = acc.find(item => item.opportunity_id === current.opportunity_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []).slice(0, 10);

  return (
    <div className="bg-surface min-h-[90vh] py-12">
      <div className="container-main max-w-5xl">
        
        {/* Profile Header */}
        <div className="bg-surface dark:bg-white/5 border border-[var(--color-border-default)] rounded-3xl p-8 mb-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] text-2xl font-heading font-bold">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-extrabold text-heading mb-1">{student.name}</h1>
              <p className="text-muted text-sm font-medium">Class {student.student_class} • {student.school_name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <EditProfile student={student} />
             
             <form action={async () => {
               'use server';
               const cookiesList = cookies();
               cookiesList.delete('myark_student');
               redirect('/');
             }}>
               <button type="submit" className="px-5 py-2.5 rounded-xl border border-[var(--color-border-default)] text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 transition-colors w-full md:w-auto">
                 Sign out
               </button>
             </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column: Applications */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                My Applications
              </h2>
              
              <div className="space-y-4">
                {applied && applied.length > 0 ? (
                  applied.map((reg) => (
                    <div key={reg.id} className="bg-surface dark:bg-white/5 border border-[var(--color-border-default)] rounded-2xl p-5 hover:border-[var(--color-primary)] transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/opportunities/${reg.opportunity?.slug}`} className="font-heading font-extrabold text-lg text-heading group-hover:text-[var(--color-primary)] transition-colors">
                          {reg.opportunity?.title}
                        </Link>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          reg.feedback_status === 'applied' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          reg.feedback_status === 'pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {reg.feedback_status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-muted">
                         <span>Interested on {formatDate(reg.created_at)}</span>
                         <Link href={`/opportunities/${reg.opportunity?.slug}`} className="text-[var(--color-primary)] font-medium hover:underline">
                           View Details →
                         </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface dark:bg-white/5 border border-dashed border-[var(--color-border-default)] rounded-2xl p-12 text-center text-muted">
                    <p className="text-sm mb-4">You haven&apos;t shown interest in any opportunities yet.</p>
                    <Link href="/opportunities" className="btn bg-[var(--color-primary)] text-white px-6">Explore now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Opportunities Section */}
            <div className="mt-12">
              <h2 className="text-xl font-heading font-extrabold text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#6366f1] rounded-full"></span>
                Saved for Later
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saved && saved.length > 0 ? (
                  saved.map((item) => (
                    <div key={item.id} className="bg-surface dark:bg-white/5 border border-[var(--color-border-default)] rounded-2xl p-5 hover:border-[#6366f1] transition-all group relative">
                      <Link href={`/opportunities/${item.opportunity?.slug}`} className="font-heading font-extrabold text-heading group-hover:text-[#6366f1] transition-colors pr-8 block">
                        {item.opportunity?.title}
                      </Link>
                      <div className="flex items-center justify-between text-[11px] text-muted mt-3">
                         <span>Saved on {formatDate(item.created_at)}</span>
                         <Link href={`/opportunities/${item.opportunity?.slug}`} className="text-[#6366f1] font-medium">
                           View Details
                         </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 bg-surface dark:bg-white/5 border border-dashed border-[var(--color-border-default)] rounded-2xl p-8 text-center text-muted">
                    <p className="text-sm">You haven&apos;t saved any opportunities for later yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Browsing History */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#fbbf24] rounded-full"></span>
                Recently Viewed
              </h2>
              
              <div className="space-y-4">
                {uniqueViews && uniqueViews.length > 0 ? (
                  uniqueViews.map((view: StudentView) => (
                    <Link key={view.id} href={`/opportunities/${view.opportunity?.slug}`} className="block bg-surface dark:bg-white/5 border border-[var(--color-border-default)] rounded-xl p-4 hover:bg-[#f9fafb] dark:hover:bg-white/10 transition-colors">
                      <h4 className="font-bold text-sm text-heading truncate mb-1">{view.opportunity?.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span>{formatDate(view.created_at)}</span>
                        <span>Visit again →</span>
                      </div>
                    </Link>
                  ))
                ) : (
                   <p className="text-sm text-muted italic">Your browsing history will appear here.</p>
                )}
              </div>
            </div>

            {/* Support/Contact Box */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] dark:bg-blue-900/10 dark:border-blue-800/50 rounded-2xl p-6">
               <h4 className="text-[14px] font-bold text-heading mb-2">Need help?</h4>
               <p className="text-[12px] text-[#166534] dark:text-blue-400 leading-relaxed mb-4">Have questions about an opportunity or your profile? Our team is here to help you build your future.</p>
               <button className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-[12px] py-2 rounded-lg hover:opacity-90 transition-opacity">Contact Support</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
