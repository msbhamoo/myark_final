import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Career } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCareersPage() {
  const supabase = createServerClient();

  const { data: careers } = await supabase
    .from('career_directory')
    .select('*')
    .order('name', { ascending: true });

  const typedCareers: Career[] = careers || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Career Directory</h1>
          <p className="text-gray-500 text-sm pb-0">Manage India&apos;s most detailed career database.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/careers/new" className="btn btn-primary shadow-sm bg-[#1b5e28] text-white hover:bg-[#14461e] px-4 py-2 rounded-lg font-bold">
            + Add Career
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Career Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stream</th>
                <th className="px-6 py-4">Salary (Entry)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {typedCareers.map((career) => (
                <tr key={career.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">{career.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{career.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-50 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                      {career.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {career.stream_required}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1b5e28]">
                    {career.salary_entry}
                  </td>
                  <td className="px-6 py-4">
                    {career.is_published ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Published</span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 items-center font-bold text-[#1b5e28]">
                        <Link href={`/admin/careers/${career.id}/edit`}>Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
