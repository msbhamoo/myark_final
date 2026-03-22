import { createServerClient } from '@/lib/supabase-server';
import { formatDate } from '@/lib/utils';
import { DeleteButton } from './DeleteButton';
import Link from 'next/link';
import { BulkImportModal } from './BulkImportModal';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const supabase = createServerClient();

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, category:categories(label), organiser:organisers(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Opportunities</h1>
          <p className="text-gray-500 text-sm pb-0">View all opportunities in the platform.</p>
        </div>
        <div className="flex gap-3">
          <BulkImportModal />
          <a href="/admin/opportunities/new" className="btn btn-primary shadow-sm bg-[#1b5e28] text-white hover:bg-[#14461e]">
            + Add Opportunity
          </a>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Organiser</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities?.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base max-w-[300px] truncate" title={opp.title}>{opp.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{opp.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-50 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                      {opp.category?.label || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500">{opp.organiser?.name || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {opp.is_ongoing ? (
                      <span className="text-gray-500 text-xs font-medium">Ongoing</span>
                    ) : (
                      <span>{formatDate(opp.deadline)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {opp.is_published ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Published</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Draft</span>
                      )}
                      {opp.is_verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Verified</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <Link href={`/admin/opportunities/${opp.id}/edit`} className="text-[#1b5e28] hover:text-[#14461e] font-medium">Edit</Link>
                      <span className="text-gray-300">|</span>
                      <DeleteButton id={opp.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {!opportunities?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No opportunities found. Head to the database to insert seed data.
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
