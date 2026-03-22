import { createServerClient } from '@/lib/supabase-server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage() {
  const supabase = createServerClient();

  // Fetch registrations with nested relations
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*, student:students(*), opportunity:opportunities(id, title, slug)')
    .order('created_at', { ascending: false });

  // Fetch total students
  const { count: totalStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  // Fetch views data for analytics
  const { data: views } = await supabase
    .from('student_views')
    .select('opportunity_id, opportunity:opportunities(title, slug)')
    .order('created_at', { ascending: false });

  // ── Analytics ──────────────────────────────────
  // Top opportunities by registration count
  const oppRegCount: Record<string, { title: string; slug: string; count: number }> = {};
  registrations?.forEach(reg => {
    const id = reg.opportunity_id;
    const title = reg.opportunity?.title || 'Unknown';
    const slug = reg.opportunity?.slug || '';
    if (!oppRegCount[id]) oppRegCount[id] = { title, slug, count: 0 };
    oppRegCount[id].count++;
  });
  const topOpportunities = Object.entries(oppRegCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 8);

  // Top opportunities by views
  const oppViewCount: Record<string, { title: string; slug: string; count: number }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  views?.forEach((v: any) => {
    const id = v.opportunity_id;
    const title = v.opportunity?.title || 'Unknown';
    const slug = v.opportunity?.slug || '';
    if (!oppViewCount[id]) oppViewCount[id] = { title, slug, count: 0 };
    oppViewCount[id].count++;
  });
  const topViewed = Object.entries(oppViewCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  // Status breakdown
  const statusCounts = { applied: 0, not_applied: 0, pending: 0, total: registrations?.length || 0 };
  registrations?.forEach(reg => {
    const s = reg.feedback_status || 'pending';
    if (s === 'applied' || s === 'APPLIED') statusCounts.applied++;
    else if (s === 'NOT_APPLIED' || s === 'not_applied') statusCounts.not_applied++;
    else statusCounts.pending++;
  });

  const maxRegCount = topOpportunities.length > 0 ? topOpportunities[0][1].count : 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Registration Leads</h1>
          <p className="text-gray-500 text-sm pb-0">Student registrations, views, and engagement analytics.</p>
        </div>
      </div>

      {/* ── Analytics Cards ──────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">{totalStudents || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Registrations</p>
          <p className="text-3xl font-bold text-gray-900">{statusCounts.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Applied</p>
          <p className="text-3xl font-bold text-green-600">{statusCounts.applied}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Views</p>
          <p className="text-3xl font-bold text-blue-600">{views?.length || 0}</p>
        </div>
      </div>

      {/* ── Top Opportunities ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Registrations */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">🔥 Most Registered Opportunities</h2>
          {topOpportunities.length > 0 ? (
            <div className="space-y-3">
              {topOpportunities.map(([id, opp], i) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/opportunities/${opp.slug}`} className="text-sm font-medium text-gray-900 hover:text-[#1b5e28] truncate block">
                      {opp.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1b5e28] rounded-full" style={{ width: `${(opp.count / maxRegCount) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 shrink-0">{opp.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No registrations yet.</p>
          )}
        </div>

        {/* By Views */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">👀 Most Viewed Opportunities</h2>
          {topViewed.length > 0 ? (
            <div className="space-y-3">
              {topViewed.map(([id, opp], i) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/opportunities/${opp.slug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                      {opp.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(opp.count / (topViewed[0]?.[1]?.count || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 shrink-0">{opp.count} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No views recorded yet.</p>
          )}
        </div>
      </div>

      {/* ── Registration Table ──────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Registrations</h2>
          <span className="text-xs text-gray-400">{registrations?.length || 0} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Class &amp; School</th>
                <th className="px-6 py-3">Mobile</th>
                <th className="px-6 py-3">Opportunity</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {formatDate(reg.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{reg.student?.name || 'Unknown'}</div>
                    {reg.student?.email && (
                      <div className="text-xs text-gray-400 mt-0.5">{reg.student.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{reg.student?.student_class || '-'}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={reg.student?.school_name || ''}>
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
                      {reg.opportunity?.title || 'Unknown'}
                    </span>
                    <a
                      href={`/opportunities/${reg.opportunity?.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#1b5e28] hover:underline mt-0.5 inline-block"
                    >
                      View page ↗
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      Myark
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      (reg.feedback_status === 'applied' || reg.feedback_status === 'APPLIED') ? 'bg-green-100 text-green-700' :
                      (reg.feedback_status === 'NOT_APPLIED' || reg.feedback_status === 'not_applied') ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {reg.feedback_status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {!registrations?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No registrations captured yet.
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
