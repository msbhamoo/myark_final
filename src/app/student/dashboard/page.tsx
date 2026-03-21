import { createServerClient } from '@/lib/supabase-server';
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

export const dynamic = 'force-dynamic';

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
        <div className="bg-white border border-[#e5e7eb] rounded-3xl p-8 mb-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-heading font-bold">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-medium text-heading mb-1">{student.name}</h1>
              <p className="text-[#6b7280] text-sm font-medium">Class {student.student_class} • {student.school_name}</p>
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
               <button type="submit" className="px-5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-medium text-[#ef4444] hover:bg-[#fef2f2] hover:border-[#fee2e2] transition-colors w-full md:w-auto">
                 Sign out
               </button>
             </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column: Applications */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-heading font-medium text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                My Applications
              </h2>
              
              <div className="space-y-4">
                {applied && applied.length > 0 ? (
                  applied.map((reg) => (
                    <div key={reg.id} className="bg-white border border-[#e5e7eb] rounded-2xl p-5 hover:border-primary transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/opportunities/${reg.opportunity?.slug}`} className="font-heading font-medium text-lg text-heading group-hover:text-primary transition-colors">
                          {reg.opportunity?.title}
                        </Link>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          reg.feedback_status === 'applied' ? 'bg-green-100 text-green-700' : 
                          reg.feedback_status === 'pending' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {reg.feedback_status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-[#6b7280]">
                         <span>Interested on {formatDate(reg.created_at)}</span>
                         <Link href={`/opportunities/${reg.opportunity?.slug}`} className="text-primary font-medium hover:underline">
                           View Details →
                         </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-[#d1d5db] rounded-2xl p-12 text-center text-[#6b7280]">
                    <p className="text-sm mb-4">You haven&apos;t shown interest in any opportunities yet.</p>
                    <Link href="/opportunities" className="btn btn-primary bg-primary text-white px-6">Explore now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Opportunities Section */}
            <div className="mt-12">
              <h2 className="text-xl font-heading font-medium text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#6366f1] rounded-full"></span>
                Saved for Later
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saved && saved.length > 0 ? (
                  saved.map((item) => (
                    <div key={item.id} className="bg-white border border-[#e5e7eb] rounded-2xl p-5 hover:border-[#6366f1] transition-all group relative">
                      <Link href={`/opportunities/${item.opportunity?.slug}`} className="font-heading font-medium text-heading group-hover:text-[#6366f1] transition-colors pr-8 block">
                        {item.opportunity?.title}
                      </Link>
                      <div className="flex items-center justify-between text-[11px] text-[#6b7280] mt-3">
                         <span>Saved on {formatDate(item.created_at)}</span>
                         <Link href={`/opportunities/${item.opportunity?.slug}`} className="text-[#6366f1] font-medium">
                           View Details
                         </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 bg-white border border-dashed border-[#d1d5db] rounded-2xl p-8 text-center text-[#6b7280]">
                    <p className="text-sm">You haven&apos;t saved any opportunities for later yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Browsing History */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-medium text-heading mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#fbbf24] rounded-full"></span>
                Recently Viewed
              </h2>
              
              <div className="space-y-4">
                {uniqueViews && uniqueViews.length > 0 ? (
                  uniqueViews.map((view: StudentView) => (
                    <Link key={view.id} href={`/opportunities/${view.opportunity?.slug}`} className="block bg-white border border-[#e5e7eb] rounded-xl p-4 hover:bg-[#f9fafb] transition-colors">
                      <h4 className="font-bold text-sm text-heading truncate mb-1">{view.opportunity?.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-[#9ca3af]">
                        <span>{formatDate(view.created_at)}</span>
                        <span>Visit again →</span>
                      </div>
                    </Link>
                  ))
                ) : (
                   <p className="text-sm text-[#9ca3af] italic">Your browsing history will appear here.</p>
                )}
              </div>
            </div>

            {/* Support/Contact Box */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6">
               <h4 className="text-[14px] font-bold text-heading mb-2">Need help?</h4>
               <p className="text-[12px] text-[#166534] leading-relaxed mb-4">Have questions about an opportunity or your profile? Our team is here to help you build your future.</p>
               <button className="w-full bg-[#16a34a] text-white text-[12px] font-medium py-2 rounded-lg hover:bg-[#15803d]">Contact Support</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
