'use client';

import { useState } from 'react';
import { approveSubmission, rejectSubmission } from './actions';
import { Submission } from './page';

export function ClientReviewButtons({ submission }: { submission: Submission }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentStatus = submission.status;

  if (currentStatus === 'Approved') {
    return <span className="text-xs font-bold text-green-600 block pt-1">Approved ✔</span>;
  }
  if (currentStatus === 'Rejected') {
    return <span className="text-xs font-bold text-red-600 block pt-1">Rejected ✕</span>;
  }

  const handleApprove = async () => {
    setLoading(true);
    await approveSubmission(submission.id);
    setLoading(false);
    setShowModal(false);
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this submission?')) return;
    setLoading(true);
    await rejectSubmission(submission.id);
    setLoading(false);
    setShowModal(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
      >
        Review Details
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Review Opportunity</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-1 bg-white rounded-md shadow-sm border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Title</span>
                <p className="text-lg font-bold text-gray-900">{submission.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Category</span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md">{submission.category}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Eligible Classes</span>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">{submission.eligible_classes}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Deadline</span>
                  <span className="inline-block bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">{new Date(submission.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">Organizer Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Name</span>
                    <span className="text-sm font-bold text-gray-900 block">{submission.organizer_name || submission.orgName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Contact</span>
                    <a href={`mailto:${submission.contact_email || submission.email}`} className="text-sm font-bold text-blue-600 hover:underline block">{submission.contact_email || submission.email}</a>
                    {submission.contact_mobile && <a href={`tel:${submission.contact_mobile}`} className="text-sm text-gray-600 hover:underline block mt-0.5">{submission.contact_mobile}</a>}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Registration Link</span>
                <a href={submission.registration_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all block bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  {submission.registration_link}
                </a>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description</span>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {submission.description || <span className="text-gray-400 italic">No description provided</span>}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={handleReject}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition border border-transparent hover:border-red-100 disabled:opacity-50"
              >
                Reject Listing
              </button>
              <button 
                onClick={handleApprove}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition shadow-sm disabled:opacity-50"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
