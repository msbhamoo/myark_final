import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { createOpportunity } from '../actions';
import { OrganiserSelector } from '@/components/admin/OrganiserSelector';

export const dynamic = 'force-dynamic';

export default async function NewOpportunityPage() {
  const supabase = createServerClient();

  // Fetch reference data for dropdowns
  const [{ data: categories }, { data: organisers }] = await Promise.all([
    supabase.from('categories').select('id, label').order('label'),
    supabase.from('organisers').select('id, name').order('name')
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <Link href="/admin/opportunities" className="hover:text-primary">← Back to Opportunities</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Opportunity</h1>
        
        <form action={createOpportunity} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <input type="text" name="title" required className="input" placeholder="e.g. National Science Olympiad" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Slug</label>
                <input type="text" name="slug" required className="input" placeholder="national-science-olympiad" />
                <p className="text-xs text-gray-500 mt-1">Unique URL-friendly identifier</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                <select name="category_id" required className="input">
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Organiser</label>
                <OrganiserSelector initialOrganisers={organisers || []} />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-1">Brief Description</label>
              <textarea name="description" rows={3} className="input resize-y" placeholder="Short summary of what this is..."></textarea>
            </div>
          </div>

          {/* Section 2: Eligibility */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Eligibility</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Eligibility Text</label>
                <input type="text" name="eligibility_text" className="input" placeholder="e.g. Students in classes 9 to 12" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Applicable Classes</label>
                <div className="grid grid-cols-6 gap-3">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                    <label key={num} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" name="eligibility_classes" value={num} className="rounded text-primary focus:ring-primary" />
                      Class {num}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dates & Links */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dates & Links</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Registration/Official URL</label>
                <input type="url" name="registration_url" required className="input" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Registration Opens</label>
                <input type="date" name="registration_opens" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Deadline</label>
                <input type="date" name="deadline" className="input" />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-3 w-fit p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" name="is_ongoing" className="w-5 h-5 rounded text-primary focus:ring-primary" />
                  <div className="text-sm">
                    <span className="font-bold text-gray-900 block">Is Ongoing?</span>
                    <span className="text-gray-500">Check this if it is open year-round without a strict deadline.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Details & Rewards */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Details & Rewards</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Fee Text</label>
                  <input type="text" name="fee_text" className="input" placeholder="e.g. Free, INR 150" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Prize Text</label>
                  <input type="text" name="prize_text" className="input" placeholder="e.g. Certificates, Medals, Cash" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">How to Apply (Markdown formatting supported)</label>
                <textarea name="how_to_apply" rows={5} className="input resize-y font-mono text-sm" placeholder="1. Go to website...&#10;2. Register..."></textarea>
              </div>
            </div>
          </div>

          {/* Section 5: Status Toggle */}
          <div>
             <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Visibility & Status</h2>
             <div className="flex gap-6">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_published" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-900">Published</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-900">Featured</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_verified" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-900">Verified by Myark</span>
               </label>
             </div>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/admin/opportunities" className="btn btn-outline text-gray-700 bg-white">Cancel</Link>
            <button type="submit" className="btn btn-primary px-8 bg-[#1b5e28] hover:bg-[#14461e] text-white font-medium">Create Opportunity</button>
          </div>
        </form>
      </div>
    </div>
  );
}
