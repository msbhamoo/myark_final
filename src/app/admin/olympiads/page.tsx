import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOlympiadsPage() {
  const supabase = createServerClient();

  const { data: olympiads } = await supabase
    .from('olympiad_directory')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Olympiad Directory</h1>
          <p className="text-gray-500 text-sm pb-0">Manage the evergreen olympiad landscape.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/olympiads/new" className="btn btn-primary shadow-sm bg-[#1b5e28] text-white hover:bg-[#14461e] px-4 py-2 rounded-lg font-bold">
            + Add Olympiad
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Olympiad Name</th>
                <th className="px-6 py-4">Organiser</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {olympiads?.map((olym) => (
                <tr key={olym.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">{olym.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{olym.slug}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500">
                    {olym.organiser}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-50 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                        {olym.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs border border-indigo-100 font-bold uppercase tracking-wider">
                        {olym.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 items-center font-bold text-[#1b5e28]">
                        <Link href={`/admin/olympiads/${olym.id}/edit`}>Edit</Link>
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
