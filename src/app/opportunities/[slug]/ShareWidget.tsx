'use client';

import { useState } from 'react';

export function ShareWidget({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://myark.in/opportunities/${slug}`;
  const encodedText = encodeURIComponent(`Check out this opportunity: ${title} - ${shareUrl}`);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="py-6">
      <h4 className="text-[11px] tracking-widest uppercase font-bold text-muted mb-3">Share This</h4>
      <div className="flex gap-2">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 border border-[var(--color-border-default)] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb] dark:hover:bg-white/5 transition-colors text-center shadow-sm"
        >
          WhatsApp
        </a>
        <button 
          onClick={handleCopy}
          className="flex-1 py-1.5 border border-[var(--color-border-default)] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb] dark:hover:bg-white/5 transition-colors shadow-sm"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
