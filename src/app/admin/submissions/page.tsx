import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { ClientReviewButtons } from './ClientReviewButtons';

export interface Submission {
  id: string | number;
  organizer_name?: string;
  orgName?: string;
  contact_email?: string;
  email?: string;
  contact_mobile?: string;
  title: string;
  category: string;
  eligible_classes: string;
  deadline: string;
  registration_link: string;
  description: string;
  status: string;
  created_at: string;
}

export const metadata: Metadata = {
  title: 'Review Organizer Submissions | Admin',
};

// Fallback mock data if the table doesn't exist yet
const mockSubmissions = [
  { id: 1, orgName: 'Demo Organizer', email: 'demo@demo.com', title: 'Example Demo Scholarship', category: 'Scholarship', deadline: '2026-05-15', status: 'pending', created_at: new Date().toISOString() }
];

export default async function SubmissionsPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let usingMock = false;
  // Try to fetch real submissions. If table doesn't exist, it errors out.
  const { data: rawSubmissions, error } = await supabase
    .from('submitted_opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  let submissionsData = rawSubmissions;
  if (error && error.code === '42P01') {
    // 42P01 means table does not exist
    submissionsData = [];
    usingMock = true;
  }
  
  const submissions = (submissionsData && submissionsData.length > 0) ? submissionsData : (usingMock ? mockSubmissions : []);
  const pendingCount = submissions.filter(s => s.status?.toLowerCase() === 'pending').length;

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Opportunity Submissions</h1>
            <p className="text-sm text-gray-500 mt-1">Review, approve, or reject external listings submitted by organizers.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold leading-none">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
              {pendingCount} Pending Review
            </span>
          </div>
        </div>

        {/* Database Warning Banner */}
        {usingMock && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Demo Mode Active</h4>
                <p className="text-sm text-blue-800 mt-1">This dashboard is currently showing mock data. To make submissions functional, please run the SQL migration I provided to create the <code className="bg-blue-100 px-1 rounded text-blue-900">submitted_opportunities</code> table.</p>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organizer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Opportunity Title</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub: Submission) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{new Date(sub.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(sub.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-gray-900">{sub.organizer_name || sub.orgName}</div>
                      <div className="text-xs text-blue-600 hover:underline cursor-pointer">{sub.contact_email || sub.email}</div>
                      {sub.contact_mobile && <div className="text-xs text-gray-500 mt-0.5">{sub.contact_mobile}</div>}
                    </td>
                    <td className="py-4 px-6">
                      <a href={sub.registration_link} target="_blank" rel="noopener noreferrer" title="View external link" className="text-sm font-bold text-blue-600 hover:underline mb-0.5 truncate block max-w-[200px] lg:max-w-[300px]">
                        {sub.title}
                      </a>
                      <div className="flex gap-2">
                         <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{sub.category}</span>
                         <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Due: {new Date(sub.deadline).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {sub.status?.toLowerCase() === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800">
                          Pending Review
                        </span>
                      ) : sub.status?.toLowerCase() === 'rejected' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                          Approved
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                       {!usingMock && sub.status?.toLowerCase() === 'pending' ? (
                          <ClientReviewButtons submission={sub} />
                       ) : usingMock ? (
                          <span className="text-xs text-yellow-600 italic">Demo row</span>
                       ) : (
                          <span className="text-xs font-bold text-gray-400 capitalize">{sub.status}</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {submissions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No new submissions pending review.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
