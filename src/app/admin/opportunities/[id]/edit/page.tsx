import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { updateOpportunity } from '../../actions';
import { notFound } from 'next/navigation';
import { OrganiserSelector } from '@/components/admin/OrganiserSelector';
import { ClassSelector } from '@/components/admin/ClassSelector';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { TitleInputWithCheck } from '@/components/admin/TitleInputWithCheck';
import { TagSelector } from '@/components/admin/TagSelector';

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
      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 group">
        <Link href="/admin/opportunities" className="group-hover:text-primary transition-colors flex items-center gap-2">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
           Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 transition-all">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Edit Entry</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium italic">Refine and update this opportunity listing.</p>
        </header>

        <form action={updateWithId} className="space-y-12">
          
          {/* Section 1: Basic Info */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-8 h-[1px] bg-gray-200 dark:bg-white/10"></span>
              Core Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Full Title</label>
                <TitleInputWithCheck defaultValue={opportunity.title} excludeId={opportunity.id} />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Custom URL Slug</label>
                <input type="text" name="slug" required className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.slug} />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select name="category_id" required className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.category_id}>
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Organiser</label>
                <OrganiserSelector 
                  initialOrganisers={organisers || []} 
                  defaultId={opportunity.organiser_id}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Search Tags / Topics</label>
                <TagSelector name="tags" initialTags={opportunity.tags} placeholder="e.g. STEM, Robotics, Scholarship..." />
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Official Description</label>
              <RichTextEditor name="description" defaultValue={opportunity.description} />
            </div>
          </div>

          {/* Section 2: Eligibility */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-8 h-[1px] bg-gray-200 dark:bg-white/10"></span>
              Audience & Criteria
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Eligibility Summary</label>
                <input type="text" name="eligibility_text" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.eligibility_text} />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Eligible Classes</label>
                <ClassSelector initialClasses={opportunity.eligibility_classes} />
              </div>
            </div>
          </div>

          {/* Section 3: Dates & Links */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-8 h-[1px] bg-gray-200 dark:bg-white/10"></span>
              Timeline & Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Official Portal URL</label>
                <input type="url" name="registration_url" required className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.registration_url} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Reg. Start (Fixed)</label>
                <input type="date" name="registration_opens" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.registration_opens || ''} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Reg. Start (Approx)</label>
                <input type="text" name="registration_opens_tentative" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.registration_opens_tentative || ''} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Deadline (Fixed)</label>
                <input type="date" name="deadline" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.deadline || ''} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Deadline (Approx)</label>
                <input type="text" name="deadline_tentative" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.deadline_tentative || ''} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Event Date (Fixed)</label>
                <input type="date" name="event_date" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.event_date || ''} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5 ml-1">Event Date (Approx)</label>
                <input type="text" name="event_date_tentative" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.event_date_tentative || ''} />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-4 w-fit p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-white/[0.08] transition-all group">
                  <input type="checkbox" name="is_ongoing" defaultChecked={opportunity.is_ongoing} className="w-6 h-6 rounded-lg text-primary focus:ring-primary dark:bg-white/10 dark:border-white/20" />
                  <div>
                    <span className="font-black text-gray-900 dark:text-white block text-sm uppercase tracking-wider">Permanent / Ongoing</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Check if open indefinitely.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Details & Rewards */}
          <div>
            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-8 h-[1px] bg-gray-200 dark:bg-white/10"></span>
              Rewards & Fees
            </h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Registration Fee</label>
                  <input type="text" name="fee_text" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.fee_text} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Primary Prize/Award</label>
                  <input type="text" name="prize_text" className="input bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:ring-primary h-12" defaultValue={opportunity.prize_text || ''} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Application Guide</label>
                <RichTextEditor name="how_to_apply" defaultValue={opportunity.how_to_apply} />
              </div>
            </div>
          </div>

          {/* Section 5: Status */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Launch Settings</h2>
            <div className="flex flex-wrap gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_published" defaultChecked={opportunity.is_published} className="w-5 h-5 rounded-lg text-primary focus:ring-primary dark:bg-white/10 border-gray-300 dark:border-white/20" />
                <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">LIVE STATUS</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_featured" defaultChecked={opportunity.is_featured} className="w-5 h-5 rounded-lg text-primary focus:ring-primary dark:bg-white/10 border-gray-300 dark:border-white/20" />
                <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">FEATURED</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_verified" defaultChecked={opportunity.is_verified} className="w-5 h-5 rounded-lg text-primary focus:ring-primary dark:bg-white/10 border-gray-300 dark:border-white/20" />
                <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">VERIFIED SEAL</span>
              </label>
            </div>
          </div>

          <div className="pt-10 mt-10 border-t border-gray-100 dark:border-white/5 flex flex-col-reverse md:flex-row justify-end gap-4">
            <Link href="/admin/opportunities" className="px-8 h-12 flex items-center justify-center text-sm font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest">Discard</Link>
            <button type="submit" className="px-10 h-14 bg-[#1b5e28] hover:bg-[#14461e] text-white font-black rounded-2xl shadow-xl shadow-green-900/10 transition-all uppercase tracking-widest text-xs">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
