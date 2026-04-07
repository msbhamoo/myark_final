'use client';

import { useState, useMemo } from 'react';

export function ShareWidget({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    return typeof window !== 'undefined' ? `${window.location.origin}/opportunities/${slug}` : `https://myark.in/opportunities/${slug}`;
  }, [slug]);

  const whatsappUrl = useMemo(() => {
    const templates = [
      `Hey! Found this amazing opportunity: "${title}". Thought it might be perfect for your child. Check it out here: ${shareUrl}`,
      `Quick Alert! 📢 The "${title}" is now open for applications. Don't let your kids miss this one. Details: ${shareUrl}`,
      `I just saw "${title}" on Myark. Looks like a great chance for students to excel. Link: ${shareUrl}`,
      `Parental win! 🏆 Found "${title}" for the kids. Sharing the details here: ${shareUrl}`,
      `Is your child interested in this? "${title}". Highly recommended. See more: ${shareUrl}`,
      `Sharing a great find: "${title}" - Excellent for student profiles. Info: ${shareUrl}`,
      `Check this out: "${title}". Great opportunity for school students. ${shareUrl}`,
      `Found something interesting: "${title}". Might be worth applying! ${shareUrl}`,
      `Don't miss the deadline for "${title}"! Verified details here: ${shareUrl}`,
      `This looks perfect for students: "${title}". All the info is here: ${shareUrl}`,
      `Hey! Take a look at this program: "${title}". 🚀 ${shareUrl}`,
      `Found a high-value opportunity: "${title}". Sharing it for the benefit of kids in the group: ${shareUrl}`,
      `Boost your child's CV with "${title}". Verified link: ${shareUrl}`,
      `Looking for scholarships/olympiads? Just found "${title}". Check it out: ${shareUrl}`,
      `Educational alert: "${title}" is currently active. More info: ${shareUrl}`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return `https://wa.me/?text=${encodeURIComponent(randomTemplate)}`;
  }, [title, shareUrl]);

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
    <div className="py-4">
      <h4 className="text-[10px] tracking-[0.2em] uppercase font-black text-slate-400 dark:text-slate-500 mb-4">Viral Share</h4>
      <div className="flex gap-2">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl text-[12px] font-black hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.81 9.81 0 016.99 2.9 9.811 9.811 0 012.898 6.992c-.001 5.451-4.437 9.886-9.888 9.886m7.292-17.182a11.874 11.874 0 00-8.41-3.488C5.466 1.135.012 6.588.011 13.39c0 2.174.569 4.3 1.646 6.173L0 24l4.432-1.162a11.83 11.83 0 00 5.441 1.328h.005c6.379 0 11.574-5.191 11.576-11.572a11.833 11.833 0 00-3.485-8.422z"/></svg>
          WhatsApp Share
        </a>
        <button 
          onClick={handleCopy}
          className="w-12 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all active:scale-95"
          title={copied ? 'Copied!' : 'Copy Link'}
        >
          {copied ? (
            <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}
