import { createServerClient } from '@/lib/supabase-server';
import { formatDate } from '@/lib/utils';
import { DeleteButton } from './DeleteButton';
import Link from 'next/link';
import { BulkImportModal } from './BulkImportModal';
import { OpportunityFilters } from '@/components/admin/OpportunityFilters';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; status?: string; category?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 15;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createServerClient();

  // 1. Initial queries
  let query = supabase
    .from('opportunities')
    .select('*, category:categories(label), organiser:organisers(name)', { count: 'exact' });

  // 2. Apply Search
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,slug.ilike.%${searchParams.q}%`);
  }

  // 3. Apply Filters
  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category);
  }
  
  if (searchParams.status === 'published') {
    query = query.eq('is_published', true);
  } else if (searchParams.status === 'draft') {
    query = query.eq('is_published', false);
  } else if (searchParams.status === 'verified') {
    query = query.eq('is_verified', true);
  }

  const { data: opportunities, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / pageSize);

  // 4. Fetch Views for the listed opportunities
  const oppIds = (opportunities || []).map(o => o.id);
  const { data: viewsData } = await supabase
    .from('student_views')
    .select('opportunity_id')
    .in('opportunity_id', oppIds);

  const viewsMap: Record<string, number> = {};
  viewsData?.forEach(v => {
    viewsMap[v.opportunity_id] = (viewsMap[v.opportunity_id] || 0) + 1;
  });

  // 5. Fetch Categories for Filter Dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, label')
    .order('label', { ascending: true });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white dark:bg-[#161616] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm transition-all gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Opportunities</h1>
            <span className="px-2 py-0.5 bg-[#1b5e28]/10 dark:bg-green-500/10 text-[#1b5e28] dark:text-green-400 text-[10px] font-black rounded uppercase tracking-wider border border-[#1b5e28]/10 dark:border-green-500/20">Active Database</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic">Curate and refine the best student listings across India.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <BulkImportModal />
          <Link href="/admin/opportunities/new" className="h-14 px-8 bg-[#1b5e28] hover:bg-[#14461e] text-white rounded-2xl shadow-lg shadow-green-900/10 transition-all flex items-center justify-center font-black text-xs uppercase tracking-widest gap-2 group">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Add Entry
          </Link>
        </div>
      </div>

      <OpportunityFilters categories={categories || []} />

      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Opportunity Detail</th>
                <th className="px-6 py-4">Organization & Tag</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-center">Interactions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {opportunities?.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900 dark:text-white text-base max-w-[280px] lg:max-w-[400px] truncate leading-tight mb-1" title={opp.title}>
                      {opp.title}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors bg-gray-100 dark:bg-white/5 px-1.5 rounded uppercase font-bold tracking-tighter">{opp.id.toString().substring(0,6)}</span>
                       <span className="text-[11px] text-gray-500 dark:text-gray-400">{opp.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-medium text-gray-900 dark:text-gray-200 mb-1">{opp.organiser?.name || 'Unknown'}</div>
                    <span className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md text-[11px] font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 uppercase tracking-wide">
                      {opp.category?.label || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {opp.is_ongoing ? (
                      <span className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 px-2 py-1 rounded">ONGOING</span>
                    ) : (
                      <div className="text-gray-700 dark:text-gray-300">
                        <div className="font-bold text-sm tracking-tighter">{formatDate(opp.deadline)}</div>
                        <div className="text-[10px] text-gray-400">Scheduled Date</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-bold text-[#1b5e28] dark:text-green-400 leading-none">
                        {viewsMap[opp.id] || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Total Views</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                       {opp.is_published ? (
                        <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/20 uppercase">PUBLISHED</span>
                      ) : (
                        <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/10 uppercase">DRAFT</span>
                      )}
                      {opp.is_verified && (
                        <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-tighter">VERIFIED</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/opportunities/${opp.id}/edit`} className="text-[#1b5e28] dark:text-green-400 hover:text-[#14461e] dark:hover:text-green-300 font-bold text-sm">Update</Link>
                      <span className="text-gray-300 dark:text-gray-700">/</span>
                      <DeleteButton id={opp.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!opportunities || opportunities.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
                      <svg className="w-12 h-12 mb-3 opacity-20" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <p className="text-base font-medium">No results found for your filters</p>
                      <Link href="/admin/opportunities" className="text-sm text-primary hover:underline mt-2">Reset search</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Console */}
        <div className="px-6 py-5 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{from + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(to + 1, count || 0)}</span> of <span className="font-bold text-gray-900 dark:text-white">{count}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href={`/admin/opportunities?q=${searchParams.q || ''}&status=${searchParams.status || ''}&category=${searchParams.category || ''}&page=${Math.max(1, page - 1)}`}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${page <= 1 ? 'pointer-events-none opacity-50 border-gray-200 dark:border-white/5' : 'border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
            >
              Prev
            </Link>
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i}
                  href={`/admin/opportunities?q=${searchParams.q || ''}&status=${searchParams.status || ''}&category=${searchParams.category || ''}&page=${i + 1}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${page === i + 1 ? 'bg-primary text-white scale-110 shadow-lg glow-primary' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
            <Link 
              href={`/admin/opportunities?q=${searchParams.q || ''}&status=${searchParams.status || ''}&category=${searchParams.category || ''}&page=${Math.min(totalPages, page + 1)}`}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${page >= totalPages ? 'pointer-events-none opacity-50 border-gray-200 dark:border-white/5' : 'border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
