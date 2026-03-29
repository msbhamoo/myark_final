'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCareer } from '../actions';
import { NameInputWithCheckCareer } from '@/components/admin/NameInputWithCheckCareer';

export function NewCareerForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createCareer(formData);
        } catch (err: unknown) {
            alert('Error creating career: ' + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#111] p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div>
                <h1 className="text-2xl font-bold mb-2">Create New Career</h1>
                <p className="text-sm text-gray-500">Draft your new career entry. Fill in the data thoroughly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 pb-2 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Basic Metadata</h3></div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Career Name</label>
                    <NameInputWithCheckCareer name="name" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                    <input name="slug" required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="e.g. data-scientist" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input name="category" required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="e.g. Technology" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <input name="subcategory" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="e.g. Data" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stream Required</label>
                    <input name="stream_required" required className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="e.g. Science PCM" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tags (Comma Separated)</label>
                    <input name="tags" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="e.g. STEM, Coding, AI" />
                </div>

                <div className="lg:col-span-3 pb-2 mt-4 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Descriptions</h3></div>

                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <textarea name="short_description" required rows={2} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="One sentence pitch..." />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Full Description</label>
                    <textarea name="full_description" required rows={4} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="Detailed multi-paragraph description..." />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">What You Do (Daily life)</label>
                    <textarea name="what_you_do" rows={3} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="A day in the life looks like..." />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">How to Prepare in School</label>
                    <textarea name="how_to_prepare_in_school" rows={3} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="What 11th/12th graders should do..." />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Is this for you? (Suitability)</label>
                    <textarea name="is_this_for_you" rows={2} className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="Good for students who like..." />
                </div>

                <div className="lg:col-span-3 pb-2 mt-4 mb-2 border-b dark:border-gray-800"><h3 className="font-bold text-primary">Metrics & Data</h3></div>

                <div>
                    <label className="block text-sm font-medium mb-1">Salary Entry (e.g. ₹4L - ₹8L)</label>
                    <input name="salary_entry" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="₹4,00,000" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salary Mid-Senior</label>
                    <input name="salary_mid" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="₹12,00,000" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salary Global (optional)</label>
                    <input name="salary_global" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="$80,000" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Duration of Studies</label>
                    <input name="duration" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="3-4 Years" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Degree Required</label>
                    <input name="degree_required" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="B.Tech / B.Sc" />
                </div>
                
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rarity</label>
                        <select name="rarity_level" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
                            <option value="Common">Common</option>
                            <option value="Uncommon">Uncommon</option>
                            <option value="Rare">Rare</option>
                            <option value="Exclusive">Exclusive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Demand Level</label>
                        <select name="demand_level" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Surging">Surging</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Competition Level</label>
                        <select name="competition_level" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700">
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
                    <input name="skills_needed" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="Python, SQL, Math" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Entrance Exams</label>
                    <input name="entrance_exams" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="JEE Main, CUET" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Top Colleges (India)</label>
                    <input name="colleges_india" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="IIT Bombay, Delhi University" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Top Employers</label>
                    <input name="top_employers" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="Google, TCS, Reliance" />
                </div>
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Related Careers (Slugs)</label>
                    <input name="related_careers" className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:border-gray-700" placeholder="software-engineer, ui-designer" />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-6 pb-2">
                <input type="checkbox" name="is_published" id="is_published" defaultChecked={true} className="w-5 h-5 accent-primary" />
                <label htmlFor="is_published" className="text-base font-bold cursor-pointer">Live & Published to Students immediately</label>
            </div>
            
            <div className="pt-6 border-t dark:border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#111] py-4 shadow-xl">
                <button type="button" onClick={() => router.back()} className="px-5 py-2 border rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-black dark:bg-primary text-white dark:text-black rounded-md font-bold text-sm hover:opacity-90 disabled:opacity-50">
                    {loading ? 'Processing...' : 'Create Career'}
                </button>
            </div>
        </form>
    );
}
