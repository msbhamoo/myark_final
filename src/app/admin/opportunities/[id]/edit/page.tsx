import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { updateOpportunity } from '../../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditOpportunityPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const [{ data: opportunity }, { data: categories }, { data: organisers }] = await Promise.all([
    supabase.from('opportunities').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('id, label').order('label'),
    supabase.from('organisers').select('id, name').order('name'),
  ]);

  if (!opportunity) return notFound();

  const updateWithId = updateOpportunity.bind(null, params.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <Link href="/admin/opportunities" className="hover:text-primary">← Back to Opportunities</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Opportunity</h1>
        
        <form action={updateWithId} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <input type="text" name="title" required className="input" defaultValue={opportunity.title} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Slug</label>
                <input type="text" name="slug" required className="input" defaultValue={opportunity.slug} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                <select name="category_id" required className="input" defaultValue={opportunity.category_id}>
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Organiser</label>
                <select name="organiser_id" required className="input" defaultValue={opportunity.organiser_id}>
                  <option value="">Select Organiser</option>
                  {organisers?.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-1">Brief Description</label>
              <textarea name="description" rows={3} className="input resize-y" defaultValue={opportunity.description}></textarea>
            </div>
          </div>

          {/* Section 2: Eligibility */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Eligibility</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Eligibility Text</label>
                <input type="text" name="eligibility_text" className="input" defaultValue={opportunity.eligibility_text} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Applicable Classes</label>
                <div className="grid grid-cols-6 gap-3">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                    <label key={num} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        name="eligibility_classes"
                        value={num}
                        defaultChecked={opportunity.eligibility_classes?.includes(num)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      Class {num}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dates & Links */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dates &amp; Links</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Registration/Official URL</label>
                <input type="url" name="registration_url" required className="input" defaultValue={opportunity.registration_url} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Registration Opens</label>
                <input type="date" name="registration_opens" className="input" defaultValue={opportunity.registration_opens || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Deadline</label>
                <input type="date" name="deadline" className="input" defaultValue={opportunity.deadline || ''} />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-3 w-fit p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" name="is_ongoing" defaultChecked={opportunity.is_ongoing} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                  <div className="text-sm">
                    <span className="font-bold text-gray-900 block">Is Ongoing?</span>
                    <span className="text-gray-500">Check if open year-round without a strict deadline.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Details & Rewards */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Details &amp; Rewards</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Fee Text</label>
                  <input type="text" name="fee_text" className="input" defaultValue={opportunity.fee_text} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Prize Text</label>
                  <input type="text" name="prize_text" className="input" defaultValue={opportunity.prize_text || ''} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">How to Apply</label>
                <textarea name="how_to_apply" rows={5} className="input resize-y font-mono text-sm" defaultValue={opportunity.how_to_apply}></textarea>
              </div>
            </div>
          </div>

          {/* Section 5: Status */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Visibility &amp; Status</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={opportunity.is_published} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-900">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={opportunity.is_featured} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-900">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_verified" defaultChecked={opportunity.is_verified} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-900">Verified by Myark</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/admin/opportunities" className="btn btn-outline text-gray-700 bg-white">Cancel</Link>
            <button type="submit" className="btn btn-primary px-8 bg-[#1b5e28] hover:bg-[#14461e] text-white font-medium">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
