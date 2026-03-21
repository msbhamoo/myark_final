"use client";
import { RegisterModal } from '@/components/RegisterModal';
import { Opportunity } from '@/lib/types';
import { useState } from 'react';
import { updateRegistrationFeedback, toggleSaveOpportunity } from '../../student/actions';

export function ApplyButtonWrapper({ 
  opportunity, 
  initialHasApplied = false,
  initialFeedbackStatus = 'pending',
  initialIsSaved = false
}: { 
  opportunity: Opportunity, 
  initialHasApplied?: boolean,
  initialFeedbackStatus?: string,
  initialIsSaved?: boolean
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isSaved, setIsSaved] = useState(!!initialIsSaved);
  const [showFeedback, setShowFeedback] = useState(initialHasApplied && initialFeedbackStatus === 'pending');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(initialFeedbackStatus !== 'pending' && initialHasApplied);

  const handleApplyClick = () => {
    if (opportunity.registration_url) {
      window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
      if (hasApplied) {
        setShowFeedback(true);
      }
    }
    
    if (!hasApplied) {
      setModalOpen(true);
    }
  };

  const handleFeedback = async (status: string) => {
    await updateRegistrationFeedback(opportunity.id, status);
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleSave = async () => {
    if (!hasApplied && !document.cookie.includes('myark_student=')) {
      setModalOpen(true);
      return;
    }
    const result = await toggleSaveOpportunity(opportunity.id);
    if (!result.error) {
      setIsSaved(result.saved);
    } else {
      setModalOpen(true);
    }
  };

  const PrimaryButton = ({ className = "" }) => (
    <button 
      onClick={handleApplyClick}
      className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
        hasApplied ? 'bg-[#1b5e28] hover:bg-[#14461e]' : 'bg-[#dc2626] hover:bg-[#b01e1e]'
      } ${className}`}
    >
      {hasApplied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ✓ Applied — Go to Website
        </>
      ) : (
        <>Apply on official site</>
      )}
    </button>
  );

  const SaveButton = ({ className = "" }) => (
    <button 
      onClick={handleSave}
      className={`w-full btn btn-outline border-[#e5e7eb] hover:bg-[#f9fafb] text-heading font-medium flex items-center justify-center gap-2 mb-4 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSaved ? "text-primary" : ""}>
        <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 0 0 1 2 2v16z"></path>
      </svg>
      {isSaved ? 'Saved to Profile' : 'Save for later'}
    </button>
  );

  return (
    <>
      <div className="hidden lg:block space-y-4">
        <PrimaryButton />
        
        {/* Feedback Prompt (Desktop only inside the side bar) */}
        {showFeedback && !feedbackSubmitted && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[13px] font-bold text-heading mb-3">Did you successfully apply on the official site?</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleFeedback('applied')}
                className="w-full py-2 bg-primary text-white text-[12px] font-medium rounded hover:bg-[#15803d] transition-colors"
              >
                Yes, I applied
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleFeedback('not_applied')}
                  className="flex-1 py-1.5 border border-[#e5e7eb] bg-white rounded text-[11px] font-medium text-heading hover:bg-[#f9fafb]"
                >
                  No
                </button>
                <button 
                  onClick={() => handleFeedback('not_relevant')}
                  className="flex-1 py-1.5 border border-[#e5e7eb] bg-white rounded text-[11px] font-medium text-heading hover:bg-[#f9fafb]"
                >
                  Not relevant
                </button>
              </div>
            </div>
          </div>
        )}

        {showFeedback && feedbackSubmitted && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4 text-center">
            <p className="text-[12px] font-medium text-[#166534]">Thank you for your feedback! 🚀</p>
          </div>
        )}

        <SaveButton />
      </div>

      {/* Mobile Sticky Bar - Positioned above BottomNav (64px) */}
      <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-[#e5e7eb] p-4 pb-safe z-[45] flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button 
          onClick={handleSave}
          className={`flex-[0.25] flex items-center justify-center border border-[#e5e7eb] rounded-xl text-heading ${isSaved ? 'bg-primary/5 border-primary/20' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSaved ? "text-primary" : ""}>
            <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 0 0 1 2 2v16z"></path>
          </svg>
        </button>
        <div className="flex-1">
          <PrimaryButton />
        </div>
      </div>

      {/* Mobile Feedback (appears above the content if shown on mobile) */}
      {showFeedback && !feedbackSubmitted && (
          <div className="lg:hidden bg-[#fdf2f2] border border-[#fecaca] rounded-xl p-4 mb-6 sticky top-20 z-[30]">
             <p className="text-[14px] font-bold text-heading mb-3 text-center">Important: Did you successfully apply?</p>
             <div className="flex gap-2">
               <button onClick={() => handleFeedback('applied')} className="flex-1 py-2.5 bg-[#1b5e28] text-white text-xs font-bold rounded-lg shrink-0">YES</button>
               <button onClick={() => handleFeedback('not_applied')} className="flex-1 py-2.5 bg-white border border-[#e5e7eb] text-heading text-xs font-bold rounded-lg">NO</button>
               <button onClick={() => handleFeedback('not_relevant')} className="flex-1 py-2.5 bg-white border border-[#e5e7eb] text-heading text-xs font-bold rounded-lg capitalize">other</button>
             </div>
          </div>
      )}
      
      <RegisterModal 
        opportunity={opportunity} 
        isOpen={modalOpen} 
        onClose={() => {
          setModalOpen(false);
          // If modal closes after they applied/registered, show the feedback prompt simultaneously
          if (typeof document !== 'undefined' && document.cookie.includes('myark_student=')) {
            setHasApplied(true);
            setShowFeedback(true);
          }
        }} 
      />
    </>
  );
}
