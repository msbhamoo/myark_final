'use client';

import { useState } from 'react';
import { updateStudentProfile } from '../actions';
import { useRouter } from 'next/navigation';
import { Student } from '@/lib/types';

export function EditProfile({ student }: { student: Student }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="px-5 py-2.5 rounded-xl border border-[var(--color-border-default)] text-sm font-medium text-heading hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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
      <div className="bg-surface border border-[var(--color-border-default)] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-heading font-extrabold text-heading mb-6">Edit Basic Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-muted uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={student.name} 
              required 
              className="w-full bg-[#f9fafb] dark:bg-white/5 border border-[var(--color-border-default)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-colors text-heading"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-muted uppercase tracking-wider mb-2">Class</label>
            <select 
              name="student_class" 
              defaultValue={(student.student_class || '').includes('Class') ? student.student_class : `Class ${student.student_class || ''}`} 
              className="w-full bg-[#f9fafb] dark:bg-white/5 border border-[var(--color-border-default)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-colors text-heading appearance-none cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <option key={num} value={`Class ${num}`}>Class {num}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-muted uppercase tracking-wider mb-2">School Name</label>
            <input 
              type="text" 
              name="school_name" 
              defaultValue={student.school_name} 
              required 
              className="w-full bg-[#f9fafb] dark:bg-white/5 border border-[var(--color-border-default)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-colors text-heading"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 border border-[var(--color-border-default)] text-heading font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-[var(--color-primary)] text-[var(--color-bg)] font-medium rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
