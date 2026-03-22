'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitOpportunity } from './actions';

export default function SubmitOpportunityPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText('');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitOpportunity(formData);
    
    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorText(result.error || 'Failed to submit. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surface border border-[var(--color-border-default)] p-10 max-w-lg w-full rounded-[28px] text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-3xl font-bold text-heading mb-4">Under Review</h2>
          <p className="text-muted text-[15px] mb-8 leading-relaxed">
            Thank you for submitting your opportunity! Our moderation team will review your details to ensure student safety. You will be notified typically within 24 hours.
          </p>
          <Link href="/opportunities" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-sm inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-24 pb-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-bg to-bg relative overflow-hidden text-center border-b border-default">
        <div className="container-main max-w-3xl relative z-10">
          <span className="inline-block py-1.5 px-3 rounded-md bg-purple-500/10 text-purple-600 font-bold text-[12px] uppercase tracking-wider mb-6">
            Organizer Portal
          </span>
          <h1 className="text-display mb-6">Submit an Opportunity.</h1>
          <p className="text-body text-[18px] text-muted max-w-2xl mx-auto">
            Get your scholarship, competition, or program in front of 1M+ active high school students across India. Listing is 100% free.
          </p>
        </div>
      </div>

      <div className="container-main py-20 max-w-3xl">
        <div className="bg-surface border border-default p-8 sm:p-12 rounded-[28px] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Organizer Details */}
            <div>
              <h3 className="text-[14px] uppercase tracking-wider font-bold text-primary mb-5 border-b border-default pb-3">1. Organizer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Organizer / Organization Name</label>
                  <input required name="organizer_name" type="text" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="E.g. Science Olympiad Foundation" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Official Contact Email</label>
                  <input required name="contact_email" type="email" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="E.g. admin@sof.org" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Official Mobile Number</label>
                  <input required name="contact_mobile" type="tel" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="+91" />
                </div>
              </div>
            </div>

            {/* Opportunity Details */}
            <div>
              <h3 className="text-[14px] uppercase tracking-wider font-bold text-primary mb-5 border-b border-default pb-3">2. Opportunity Details</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Title of Opportunity</label>
                  <input required name="title" type="text" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="E.g. CBSE National Coding Challenge 2026" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Category</label>
                    <select required name="category" defaultValue="" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading appearance-none text-[15px]">
                      <option value="" disabled>Select Category</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Olympiad">Olympiad</option>
                      <option value="Coding">Coding & AI</option>
                      <option value="Exchange">Exchange Program</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Eligible Classes (e.g. 8-12)</label>
                    <input required name="eligible_classes" type="text" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="Class 8-12" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Application Deadline</label>
                    <input required name="deadline" type="date" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading text-[15px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Official Registration Link</label>
                    <input required name="registration_link" type="url" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-gray-400 text-[15px]" placeholder="https://" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-heading mb-2 ml-1">Brief Description (Max 300 words)</label>
                  <textarea required name="description" rows={4} className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading resize-none placeholder-gray-400 text-[15px]" placeholder="Describe the opportunity, rewards, and eligibility..."></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-default">
              {errorText && <div className="mb-4 text-center text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 py-2 px-4 rounded-lg">{errorText}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full btn-primary px-8 py-4 rounded-[16px] font-bold shadow-lg flex items-center justify-center gap-2 text-[16px] transition-transform active:scale-[0.98] disabled:opacity-50">
                {isSubmitting ? 'Submitting Details...' : 'Submit Opportunity for Review'}
              </button>
              <p className="text-[12px] text-center text-muted mt-5 px-4 font-medium">By submitting, you confirm you have the authority to list this event and agree to our community standards.</p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
