'use client';

import { useState } from 'react';
import { updateStudentProfile } from '../actions';
import { useRouter } from 'next/navigation';

export function EditProfile({ student }: { student: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="px-5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-medium text-heading hover:bg-[#f9fafb] transition-colors"
      >
        Edit Profile
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateStudentProfile(formData);
    setLoading(false);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-heading font-medium text-heading mb-6">Edit Basic Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={student.name} 
              required 
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-heading"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">Class</label>
            <select 
              name="student_class" 
              defaultValue={student.student_class} 
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-heading"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <option key={num} value={num.toString()}>Class {num}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">School Name</label>
            <input 
              type="text" 
              name="school_name" 
              defaultValue={student.school_name} 
              required 
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-heading"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 border border-[#e5e7eb] text-heading font-medium rounded-xl hover:bg-[#f9fafb] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-[#1b5e28] text-white font-medium rounded-xl hover:bg-[#14461e] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
