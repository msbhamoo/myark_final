import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { DeleteButton } from './DeleteButton';

export default async function CategoriesPage() {
  const supabase = createServerClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-[#161616] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Manage Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm pb-0">Add, edit, or remove opportunity categories.</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary shadow-sm bg-[#0066FF] text-white hover:bg-[#0050CC]">
          + Add Category
        </Link>
      </div>

      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider transition-colors">
            <tr>
              <th className="px-6 py-4">Sort</th>
              <th className="px-6 py-4">Icon & Label</th>
              <th className="px-6 py-4">Colors</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.sort_order}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon_name}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-base">{cat.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.1)] dark:border-white/10" style={{ background: cat.bg_color }} title="Background"></div>
                    <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.1)] dark:border-white/10 font-bold text-center leading-6 text-[10px]" style={{ background: '#fff', color: cat.text_color }} title="Text color">Aa</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <DeleteButton id={cat.id} />
                </td>
              </tr>
            ))}
            {!categories?.length && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No categories found. Start by creating one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
