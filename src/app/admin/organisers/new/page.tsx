import Link from 'next/link';
import { createOrganiser } from '../actions';
import { NameInputWithCheckOrganiser } from '@/components/admin/NameInputWithCheckOrganiser';

export default function NewOrganiserPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <Link href="/admin/organisers" className="hover:text-primary">← Back to Organisers</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Organiser</h1>
        
        <form action={createOrganiser} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Organiser Name</label>
              <NameInputWithCheckOrganiser name="name" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Slug</label>
              <input type="text" name="slug" required className="input" placeholder="e.g. sof" />
              <p className="text-xs text-gray-500 mt-1">URL friendly name</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Website URL</label>
            <input type="url" name="website_url" className="input" placeholder="https://sofworld.org" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea name="description" rows={4} className="input resize-y" placeholder="Brief description about the organiser..."></textarea>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="btn btn-primary px-8 bg-[#0066FF] hover:bg-[#0050CC] text-white">Save Organiser</button>
          </div>
        </form>
      </div>
    </div>
  );
}
