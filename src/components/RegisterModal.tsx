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
  const [password, setPassword] = useState('');

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

        // Window open is now handled by ApplyButton directly to bypass popup blockers and avoid duplicates
        onClose();
      }
    };
    checkAndRedirect();
  }, [isOpen, hasRegistered, opportunity.id, opportunity.registration_url, onClose]);

  const [formError, setFormError] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (mode === 'login') {
        // Handle Login
        const { data: student, error } = await supabase
          .from('students')
          .select('id, password')
          .eq('mobile', mobile.trim())
          .single();

        if (error || !student) {
          setFormError('No account found with this mobile number. Please sign up first.');
          setIsSubmitting(false);
          return;
        }

        if (student.password !== password) {
          setFormError('Incorrect password. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Set Cookie & Create Registration record
        document.cookie = `myark_student=${student.id}; max-age=31536000; path=/`;
        await supabase.from('registrations').upsert({
          student_id: student.id,
          opportunity_id: opportunity.id,
        }, { onConflict: 'student_id,opportunity_id' });

        window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
        onClose();
        return;
      }

      // 0. Check if mobile already exists for Signup
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('mobile', mobile.trim())
        .maybeSingle();

      if (existingStudent) {
        setFormError('This mobile number is already registered. Please login using the link below.');
        setIsSubmitting(false);
        return;
      }

      // 1. Create or get student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name,
          student_class: studentClass,
          mobile: mobile.trim(),
          school_name: school,
          password,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[4px] transition-all overflow-y-auto">
      <div 
        className="bg-surface w-full max-w-[420px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 mt-16 sm:mt-auto sm:my-8 border border-gray-100 dark:border-white/10 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center text-muted hover:text-heading transition-colors bg-gray-100/50 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="pt-8 px-6 sm:px-8 pb-4 text-center">
          <h2 className="text-[22px] font-extrabold text-heading mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Setup Profile'}
          </h2>
          <p className="text-[13px] text-muted leading-relaxed max-w-[90%] mx-auto">
            {mode === 'login' 
              ? <>Login to continue to <strong className="text-heading">{opportunity.title}</strong></>
              : <>We ask this once so you never have to type it again for <strong className="text-heading">{opportunity.title}</strong></>}
          </p>
        </div>

        <div className="px-6 sm:px-8 pb-8 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}
          
          {mode === 'signup' && (
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1.5 ml-1">Student Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-[#0066FF] focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px] placeholder-gray-400"
                placeholder="E.g. Aryan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className={mode === 'signup' ? "grid grid-cols-2 gap-3" : ""}>
            {mode === 'signup' && (
              <div>
                <label className="block text-[13px] font-bold text-heading mb-1.5 ml-1">Class</label>
                <select 
                  required
                  className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-[#0066FF] focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px] appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23a1a1aa\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em', paddingRight: '2.5rem' }}
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1.5 ml-1">Mobile Number</label>
              <input 
                required
                type="tel" 
                pattern="[0-9]{10}"
                title="10-digit mobile number"
                className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-[#0066FF] focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px] placeholder-gray-400"
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[13px] font-bold text-heading mb-1.5 ml-1">School Name & City</label>
              <input 
                required
                type="text" 
                className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-[#0066FF] focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px] placeholder-gray-400"
                placeholder="E.g. DPS R.K. Puram, New Delhi"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-heading mb-1.5 ml-1">
              {mode === 'signup' ? 'Create Password' : 'Password'}
            </label>
            <input 
              required
              type="password" 
              minLength={4}
              className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-[#0066FF] focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px] placeholder-gray-400"
              placeholder={mode === 'signup' ? "Min 4 chars (for future login)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#0066FF] text-white hover:bg-[#0050CC] font-bold rounded-[14px] py-4 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-[15px]"
            >
              {isSubmitting ? 'Authenticating...' : 'Continue to Official Site'}
              {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>}
            </button>
            <p className="text-[11px] text-center text-muted mt-4 font-medium px-4">
              We never sell your data. By continuing, you agree to our Terms.
            </p>
            <div className="mt-5 pt-4 text-center border-t border-gray-100 dark:border-white/5">
              {mode === 'signup' ? (
                <p className="text-[13px] font-medium text-heading">
                  Already registered?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-[#0066FF] dark:text-blue-400 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-[13px] font-medium text-heading">
                  New to Myark?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="text-[#0066FF] dark:text-blue-400 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
