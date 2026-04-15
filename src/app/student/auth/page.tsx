'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { supabase } from '@/lib/supabase';

export default function StudentAuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Look up student by mobile
      const { data: student, error: fetchErr } = await supabase
        .from('students')
        .select('*')
        .eq('mobile', mobile.trim())
        .maybeSingle();

      if (fetchErr || !student) {
        setError('No account found with this mobile number. Please sign up first.');
        setLoading(false);
        return;
      }

      // Check password (stored as plain text for now — in production use bcrypt)
      if (student.password !== password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      // Set cookie and redirect
      document.cookie = `myark_student=${student.id}; max-age=31536000; path=/`;
      router.push('/student/dashboard');
      router.refresh();
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
      // Check if mobile already exists
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('mobile', mobile.trim())
        .maybeSingle();

      if (existing) {
        setError('An account with this mobile number already exists. Please login.');
        setLoading(false);
        return;
      }

      // Create student
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
        router.push('/student/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] p-4 relative overflow-hidden">
      {/* Aurora bg */}
      <div className="absolute top-[-20%] left-[40%] w-[600px] h-[600px] rounded-full bg-[#3D8BFF]/[0.06] blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#70A5FF]/[0.04] blur-[80px]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" variant="white" />
          <p className="text-[#8a8a84] mt-3 text-sm">
            {mode === 'login' ? 'Welcome back! Sign in to your account.' : 'Create your free student account.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-[#3D8BFF] text-[#0a0f0a]' : 'text-[#8a8a84] hover:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-[#3D8BFF] text-[#0a0f0a]' : 'text-[#8a8a84] hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Mobile Number</label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                title="10-digit mobile number"
                placeholder="Enter 10-digit mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 focus:ring-1 focus:ring-[#70A5FF]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 focus:ring-1 focus:ring-[#70A5FF]/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D8BFF] text-[#0a0f0a] font-bold py-3 rounded-xl hover:bg-[#1F75FF] transition-colors disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Student Name</label>
              <input
                type="text"
                placeholder="E.g. Aryan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 focus:ring-1 focus:ring-[#70A5FF]/10 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] text-sm outline-none focus:border-[#70A5FF]/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#1a1a1a] text-white">Select</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={`Class ${i+1}`} className="bg-[#1a1a1a] text-white">Class {i+1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Mobile</label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  title="10-digit mobile number"
                  placeholder="10-digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">School Name &amp; City</label>
              <input
                type="text"
                placeholder="E.g. DPS R.K. Puram, New Delhi"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-1.5">Create Password</label>
              <input
                type="password"
                placeholder="At least 4 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-[#f0ede5] placeholder-[#555550] text-sm outline-none focus:border-[#70A5FF]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D8BFF] text-[#0a0f0a] font-bold py-3 rounded-xl hover:bg-[#1F75FF] transition-colors disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
            <p className="text-[11px] text-center text-[#6a6a64] mt-2">
              By signing up, you agree to our Terms. We never sell your data.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
