'use client';

import { useState, useEffect } from 'react';
import { Opportunity } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface RegisterModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ opportunity, isOpen, onClose }: RegisterModalProps) {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [mobile, setMobile] = useState('');
  const [school, setSchool] = useState('');

  // Check cookie on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const studentId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('myark_student='))
        ?.split('=')[1];
        
      if (studentId) {
        setHasRegistered(true);
      }
    }
  }, []);

  // If returning student, check if they already registered for THIS opportunity
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (isOpen && hasRegistered && opportunity.registration_url) {
        const studentId = document.cookie
          .split('; ')
          .find((row) => row.startsWith('myark_student='))
          ?.split('=')[1];

        if (studentId) {
          // Log the interest in this NEW opportunity if it doesn't exist
          await supabase.from('registrations').upsert({
            student_id: studentId,
            opportunity_id: opportunity.id,
          }, { onConflict: 'student_id,opportunity_id' });
        }

        window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
        onClose();
      }
    };
    checkAndRedirect();
  }, [isOpen, hasRegistered, opportunity.id, opportunity.registration_url, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create or get student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name,
          student_class: studentClass,
          mobile,
          school_name: school,
        })
        .select('id')
        .single();

      if (studentError) {
        console.error('Error creating student:', studentError);
        // Continue anyway to not block the user
      } else if (studentData) {
        // 2. Set cookie for 1 year
        document.cookie = `myark_student=${studentData.id}; max-age=31536000; path=/`;
        
        // 3. Create registration record
        await supabase.from('registrations').insert({
          student_id: studentData.id,
          opportunity_id: opportunity.id,
        });
      }

      // 4. Redirect
      window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
      onClose();
      
    } catch (err) {
      console.error(err);
      // Fallback: don't block user
      window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || hasRegistered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all overflow-y-auto">
      <div 
        className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-default relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted hover:text-heading transition-colors rounded-full hover:bg-bg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h2 className="text-h2 mb-2 text-heading">Before you continue</h2>
          <p className="text-sm text-muted">
            Tell us about yourself to proceed to the registration page for <strong className="text-heading font-semibold">{opportunity.title}</strong>. 
            We&apos;ll save this so you don&apos;t have to enter it again.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-bg">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Student Name</label>
            <input 
              required
              type="text" 
              className="input bg-surface"
              placeholder="E.g. Aryan Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Class</label>
              <select 
                required
                className="input bg-surface appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2rem' }}
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              >
                <option value="" disabled>Select</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Mobile Number</label>
              <input 
                required
                type="tel" 
                pattern="[0-9]{10}"
                title="10-digit mobile number"
                className="input bg-surface"
                placeholder="Parent or Self"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">School Name & City</label>
            <input 
              required
              type="text" 
              className="input bg-surface"
              placeholder="E.g. DPS R.K. Puram, New Delhi"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full py-3 shadow-sm text-[15px]"
            >
              {isSubmitting ? 'Saving details...' : 'Continue to Registration'}
              {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>}
            </button>
            <p className="text-[11px] text-center text-muted mt-3">
              We never sell your data. By continuing, you agree to our Terms.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
