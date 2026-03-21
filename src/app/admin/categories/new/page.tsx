import Link from 'next/link';
import { createCategory } from '../actions';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <Link href="/admin/categories" className="hover:text-primary">← Back to Categories</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Category</h1>
        
        <form action={createCategory} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Label</label>
              <input type="text" name="label" required className="input" placeholder="e.g. Science Olympiad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Slug</label>
              <input type="text" name="slug" required className="input" placeholder="e.g. science-olympiad" />
              <p className="text-xs text-gray-500 mt-1">URL friendly name</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Icon (Emoji or SVG string)</label>
            <input type="text" name="icon_name" className="input" placeholder="e.g. 🚀" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Background Color Hex</label>
              <input type="text" name="bg_color" className="input" placeholder="#f1efe8" defaultValue="#f1efe8" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Text Color Hex</label>
              <input type="text" name="text_color" className="input" placeholder="#444441" defaultValue="#444441" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Sort Order</label>
            <input type="number" name="sort_order" className="input" defaultValue="0" />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="btn btn-primary px-8 bg-[#1b5e28] hover:bg-[#14461e] text-white">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}
