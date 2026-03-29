import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { DeleteButton } from './DeleteButton';
import { BulkImportOrganisersModal } from './BulkImportOrganisersModal';

export default async function OrganisersPage() {
  const supabase = createServerClient();

  const { data: organisers } = await supabase
    .from('organisers')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-[#161616] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Manage Organisers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm pb-0">Add, edit, or remove opportunity organisers.</p>
        </div>
        <div className="flex gap-3">
          <BulkImportOrganisersModal />
          <Link href="/admin/organisers/new" className="btn btn-primary shadow-sm bg-[#1b5e28] text-white hover:bg-[#14461e]">
            + Add Organiser
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider transition-colors">
            <tr>
              <th className="px-6 py-4">Name & Slug</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Website</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {organisers?.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white text-base">{org.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{org.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-500 dark:text-gray-400 line-clamp-2 max-w-sm">{org.description || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  {org.website_url ? (
                    <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-green-400 hover:underline text-xs flex items-center gap-1">
                      {new URL(org.website_url).hostname}
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <DeleteButton id={org.id} />
                </td>
              </tr>
            ))}
            {!organisers?.length && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No organisers found. Start by creating one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
