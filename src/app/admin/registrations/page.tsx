import { createServerClient } from '@/lib/supabase-server';
import { formatDate } from '@/lib/utils';

export default async function RegistrationsPage() {
  const supabase = createServerClient();

  // Fetch registrations with nested relations
  // Note: Supabase types this as an array of objects
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*, student:students(*), opportunity:opportunities(title, slug)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Registration Leads</h1>
          <p className="text-gray-500 text-sm pb-0">View all captured student details when they clicked&apos;Register Now&apos;.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class & School</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Opportunity Interested In</th>
                <th className="px-6 py-4">Student Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {formatDate(reg.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">{reg.student?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{reg.student?.student_class || '-'}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={reg.student?.school_name || ''}>
                      {reg.student?.school_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      {reg.student?.mobile || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium max-w-[250px] truncate block" title={reg.opportunity?.title}>
                      {reg.opportunity?.title || 'Unknown Opportunity'}
                    </span>
                    <a
                      href={`/opportunities/${reg.opportunity?.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      View page ↗
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      reg.feedback_status === 'applied' ? 'bg-green-100 text-green-700' :
                      reg.feedback_status === 'pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {reg.feedback_status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {!registrations?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No registrations captured yet. Wait for students to find opportunities!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
