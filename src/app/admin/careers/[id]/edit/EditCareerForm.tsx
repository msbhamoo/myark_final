'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCareer } from '../../actions';
import { NameInputWithCheckCareer } from '@/components/admin/NameInputWithCheckCareer';
import { Career } from '@/lib/types';

export function EditCareerForm({ career }: { career: Career }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await updateCareer(career.id, formData);
            router.push('/admin/careers');
            router.refresh();
        } catch (err: unknown) {
            alert('Error updating career: ' + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#111] p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div>
                <h1 className="text-2xl font-bold mb-2">Edit Career: {career.name}</h1>
                <p className="text-sm text-gray-500">Update the career syllabus, metrics, and description.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 pb-2 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Basic Metadata</h3></div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Career Name</label>
                    <NameInputWithCheckCareer name="name" defaultValue={career.name} excludeId={career.id} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                    <input name="slug" defaultValue={career.slug} required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input name="category" defaultValue={career.category} required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <input name="subcategory" defaultValue={career.subcategory || ''} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stream Required</label>
                    <input name="stream_required" defaultValue={career.stream_required} required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tags (Comma Separated)</label>
                    <input name="tags" defaultValue={career.tags?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>

                <div className="lg:col-span-3 pb-2 mt-4 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Descriptions</h3></div>

                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <textarea name="short_description" defaultValue={career.short_description} required rows={2} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Full Description</label>
                    <textarea name="full_description" defaultValue={career.full_description} required rows={4} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">What You Do (Daily life)</label>
                    <textarea name="what_you_do" defaultValue={career.what_you_do} rows={3} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">How to Prepare in School</label>
                    <textarea name="how_to_prepare_in_school" defaultValue={career.how_to_prepare_in_school} rows={3} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Is this for you? (Suitability)</label>
                    <textarea name="is_this_for_you" defaultValue={career.is_this_for_you} rows={2} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>

                <div className="lg:col-span-3 pb-2 mt-4 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Metrics & Data</h3></div>

                <div>
                    <label className="block text-sm font-medium mb-1">Salary Entry (e.g. ₹4L - ₹8L)</label>
                    <input name="salary_entry" defaultValue={career.salary_entry} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salary Mid-Senior</label>
                    <input name="salary_mid" defaultValue={career.salary_mid} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salary Global (optional)</label>
                    <input name="salary_global" defaultValue={career.salary_global || ''} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Duration of Studies</label>
                    <input name="duration" defaultValue={career.duration} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Degree Required</label>
                    <input name="degree_required" defaultValue={career.degree_required} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rarity</label>
                        <select name="rarity_level" defaultValue={career.rarity_level} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
                            <option value="Common">Common</option>
                            <option value="Uncommon">Uncommon</option>
                            <option value="Rare">Rare</option>
                            <option value="Exclusive">Exclusive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Demand Level</label>
                        <select name="demand_level" defaultValue={career.demand_level} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Surging">Surging</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Competition Level</label>
                        <select name="competition_level" defaultValue={career.competition_level} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Fierce">Fierce</option>
                        </select>
                    </div>
                </div>

                <div className="lg:col-span-3 pb-2 mt-4 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Associations (Comma Separated)</h3></div>

                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Top Skills Needed</label>
                    <input name="skills_needed" defaultValue={career.skills_needed?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Entrance Exams</label>
                    <input name="entrance_exams" defaultValue={career.entrance_exams?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Top Colleges (India)</label>
                    <input name="colleges_india" defaultValue={career.colleges_india?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Top Employers</label>
                    <input name="top_employers" defaultValue={career.top_employers?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Related Careers (Slugs)</label>
                    <input name="related_careers" defaultValue={career.related_careers?.join(', ')} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-6 pb-2">
                <input type="checkbox" name="is_published" id="is_published" defaultChecked={career.is_published} className="w-5 h-5 accent-primary" />
                <label htmlFor="is_published" className="text-base font-bold cursor-pointer">Live & Published to Students</label>
            </div>
            
            <div className="pt-6 border-t dark:border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#111] py-4 shadow-xl">
                <button type="button" onClick={() => router.back()} className="px-5 py-2 border rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-black dark:bg-primary text-white dark:text-black rounded-md font-bold text-sm hover:opacity-90 disabled:opacity-50">
                    {loading ? 'Saving Changes...' : 'Save Career'}
                </button>
            </div>
        </form>
    );
}
