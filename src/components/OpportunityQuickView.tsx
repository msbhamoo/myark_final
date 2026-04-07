'use client';

import { Opportunity } from '@/lib/types';
import { formatClassRange, formatStatusDate, renderMarkdown } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface OpportunityQuickViewProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OpportunityQuickView({ opportunity, isOpen, onClose }: OpportunityQuickViewProps) {
  if (!opportunity) return null;

  const organiserName = opportunity.organiser?.name || 'Organiser';
  const isFree = opportunity.fee_text?.toLowerCase().includes('free');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1a1c1e] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Banner area (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-primary to-indigo-500"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 md:top-8 right-5 md:right-8 z-20 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-slate-400 hover:text-heading transition-all bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full border-2 border-slate-100 dark:border-white/5 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="p-6 sm:p-10 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar relative z-10">
              {/* Title Section */}
               <div className="mb-8 md:mb-10 pr-12">
                 <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isFree ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-amber-50 text-amber-600 border border-amber-100/50'}`}>
                      {isFree ? 'Free Access' : 'Paid Program'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                      {opportunity.category?.label || 'Program'}
                    </span>
                 </div>
                 
                 <h2 className="text-[24px] md:text-[36px] font-heading font-black text-heading leading-[1.1] mb-2">
                   {opportunity.title}
                 </h2>
                 <p className="text-[15px] font-bold text-slate-400">{organiserName}</p>
               </div>

              {/* Quick Info Grid */}
              <div className="space-y-8">
                {/* About */}
                <div>
                  <h4 className="text-[15px] font-black text-heading mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    About
                  </h4>
                  <div 
                    className="text-[15px] text-body leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(opportunity.description) }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Hosted By */}
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-1">Hosted By</h4>
                    <p className="text-[16px] font-bold text-heading">{organiserName}</p>
                  </div>

                  {/* For Classes */}
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-1">For Classes</h4>
                    <p className="text-[16px] font-bold text-heading">{formatClassRange(opportunity.eligibility_classes)}</p>
                  </div>

                  {/* Competition Dates */}
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-1">Event / Exam Date</h4>
                    <p className="text-[16px] font-bold text-heading">{opportunity.event_date ? formatStatusDate(opportunity.event_date, opportunity.event_date_tentative) : 'To be announced'}</p>
                  </div>

                  {/* Deadline */}
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-1">Registration Deadline</h4>
                    <p className="text-[16px] font-bold text-heading">{formatStatusDate(opportunity.deadline, opportunity.deadline_tentative)}</p>
                  </div>
                </div>

                {/* How to Register */}
                {opportunity.how_to_apply && (
                  <div>
                    <h4 className="text-[15px] font-black text-heading mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                      How to Register
                    </h4>
                    <div 
                      className="text-[15px] text-body leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(opportunity.how_to_apply) }}
                    />
                  </div>
                )}

                {/* Additional Information */}
                {opportunity.eligibility_text && (
                  <div>
                    <h4 className="text-[15px] font-black text-heading mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                      Additional Information
                    </h4>
                    <div 
                      className="text-[15px] text-body leading-relaxed"
                    >
                      {opportunity.eligibility_text}
                    </div>
                  </div>
                )}
              </div>

               <div className="mt-12 flex flex-col md:flex-row gap-4">
                 <button
                   onClick={() => {
                      const event = new CustomEvent('openRegisterModal', { detail: opportunity });
                      window.dispatchEvent(event);
                      onClose();
                   }}
                   className="flex-1 h-16 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                 >
                   Register Now
                 </button>
                 <Link
                   href={`/opportunities/${opportunity.slug}`}
                   onClick={onClose}
                   className="flex-1 h-16 bg-white dark:bg-white/5 border-[3px] border-slate-100 dark:border-white/10 text-heading font-black rounded-2xl flex items-center justify-center gap-2 hover:border-primary/40 transition-all active:scale-[0.98]"
                 >
                   View Full Details
                 </Link>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
