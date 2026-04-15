'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle scroll lock accurately with useEffect
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: student, error: fetchErr } = await supabase
        .from('students')
        .select('*')
        .eq('mobile', mobile.trim())
        .maybeSingle();

      if (fetchErr || !student) {
        setError('No account found with this mobile. Please sign up.');
        setLoading(false);
        return;
      }

      if (student.password !== password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      document.cookie = `myark_student=${student.id}; max-age=31536000; path=/`;
      onClose();
      router.push('/student/dashboard');
      router.refresh();
      window.location.reload(); // Ensure everything updates
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      setLoading(false);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('mobile', mobile.trim())
        .maybeSingle();

      if (existing) {
        setError('Mobile already exists. Please login.');
        setLoading(false);
        return;
      }

      const { data: studentData, error: insertErr } = await supabase
        .from('students')
        .insert({
          name: name.trim(),
          student_class: studentClass,
          mobile: mobile.trim(),
          school_name: school.trim(),
          password: password,
        })
        .select('id')
        .single();

      if (insertErr) {
        setError(insertErr.message);
        setLoading(false);
        return;
      }

      if (studentData) {
        document.cookie = `myark_student=${studentData.id}; max-age=31536000; path=/`;
        onClose();
        router.push('/student/dashboard');
        router.refresh();
        window.location.reload();
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />
      <div 
        className={`fixed inset-x-0 bottom-0 z-[110] bg-white dark:bg-[#0a0a0a] rounded-t-[40px] p-8 pb-10 transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-[120%] opacity-0 invisible'
        } ${!isOpen && 'pointer-events-none'} max-w-lg mx-auto sm:mb-8 sm:rounded-[32px] sm:inset-x-4 max-h-[90vh] overflow-y-auto no-scrollbar`}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-8 sm:hidden" />
        
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Unlock Your <span className="text-primary italic">Potential</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your free account in seconds.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 dark:bg-white/[0.04] p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white dark:bg-[#3D8BFF] text-[#0a0f0a] shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white dark:bg-[#3D8BFF] text-[#0a0f0a] shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 p-4 rounded-2xl text-xs font-bold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="E.g. Aryan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-2xl px-5 py-4 text-sm font-bold placeholder-gray-400 dark:placeholder-[#555550] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          <div className={mode === 'signup' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mobile</label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">School Name</label>
              <input
                type="text"
                placeholder="E.g. DPS R.K. Puram"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white dark:text-[#0a0f0a] font-black py-5 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 text-[15px] shadow-xl shadow-primary/20 mt-4 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In Now' : 'Create Free Account')}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-6 font-medium">
          Secure, verified access for school students. <br/>
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </>
  );
}
