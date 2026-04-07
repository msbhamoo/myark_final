'use client';

import { useState, useMemo } from 'react';
import { Opportunity } from '@/lib/types';
import { getDaysUntilDeadline, formatClassRange, formatDate } from '@/lib/utils';
import { SITE_URL } from '@/lib/constants';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

type PostType = 'closing-soon' | 'did-you-know' | 'this-week';
type Platform = 'instagram' | 'whatsapp' | 'twitter';

interface Props {
  closingSoon: Opportunity[];
  thisWeek: Opportunity[];
  allPublished: Opportunity[];
}

/* ──────────────────────────────────────────────
   Caption generators
   ────────────────────────────────────────────── */

function generateClosingSoonCaption(opp: Opportunity, platform: Platform): string {
  const days = getDaysUntilDeadline(opp.deadline as string) ?? 0;
  const classRange = formatClassRange(opp.eligibility_classes);
  const prize = opp.prize_text || '';
  const url = `${SITE_URL}/opportunities/${opp.slug}`;
  const categoryLabel = opp.category?.label || '';

  if (platform === 'instagram') {
    return `⏰ LAST ${days} DAYS — ${opp.title}

🎯 ${classRange}${prize ? ` | 🏆 Prize: ${prize}` : ''}
📂 Category: ${categoryLabel}
📅 Deadline: ${formatDate(opp.deadline)}

Don't let your child miss this — most parents find out too late.

✅ Verified on Myark — India's largest opportunity directory for school students.

🔗 Register now → Link in bio
Or visit: myark.in

Save this post. Share with a parent who needs it.

#Myark #${opp.title.replace(/[^a-zA-Z0-9]/g, '')} #SchoolStudents #Opportunities #Scholarships #Olympiads #IndianStudents #Education #ParentingIndia #ClosingSoon`;
  }

  if (platform === 'whatsapp') {
    return `⏰ *LAST ${days} DAYS* — *${opp.title}*

🎯 ${classRange}${prize ? `\n🏆 Prize: ${prize}` : ''}
📅 Deadline: ${formatDate(opp.deadline)}

Most parents don't know about this. Don't miss it.

✅ Verified opportunity on Myark

👉 Register: ${url}

_Forward to parents in your child's class group_ 📲`;
  }

  // Twitter/X
  return `⏰ Last ${days} days — ${opp.title}

${classRange}${prize ? ` | Prize: ${prize}` : ''}
Deadline: ${formatDate(opp.deadline)}

Register ↓
${url}

#Myark #Opportunities #Students`;
}

function generateDidYouKnowCaption(opp: Opportunity, platform: Platform): string {
  const classRange = formatClassRange(opp.eligibility_classes);
  const prize = opp.prize_text || '';
  const fee = opp.fee_text || '';
  const url = `${SITE_URL}/opportunities/${opp.slug}`;
  const categoryLabel = opp.category?.label || '';

  if (platform === 'instagram') {
    return `💡 DID YOU KNOW?

Most ${classRange} students don't know this exists —

*${opp.title}*${prize ? ` gives ${prize}` : ''} for school students.
${fee.toLowerCase().includes('free') ? '🆓 No fee. ' : ''}${opp.eligibility_text ? `\n📋 ${opp.eligibility_text}` : ''}

This is not a coaching ad. This is a real${opp.is_verified ? ', verified' : ''} opportunity.

🔍 Full details on Myark — India's opportunity directory for K-12 students.

🔗 Link in bio → myark.in

Save this. Your child's future might thank you.

#Myark #DidYouKnow #${categoryLabel.replace(/[^a-zA-Z0-9]/g, '')} #SchoolStudents #IndianStudents #Education #HiddenOpportunities #Scholarships #ParentingTips`;
  }

  if (platform === 'whatsapp') {
    return `💡 *DID YOU KNOW?*

Most ${classRange} students don't know this exists —

📌 *${opp.title}*${prize ? `\n🏆 ${prize}` : ''}
${fee.toLowerCase().includes('free') ? '🆓 No fee required\n' : ''}${opp.eligibility_text ? `📋 ${opp.eligibility_text}\n` : ''}
This is a real, verified opportunity — not a coaching ad.

👉 Full details: ${url}

_Share in your school parent group_ 📲`;
  }

  // Twitter/X
  return `💡 Most ${classRange} students don't know this exists —

${opp.title}${prize ? ` → ${prize}` : ''}
${fee.toLowerCase().includes('free') ? 'Free to apply. ' : ''}No coaching needed.

Details ↓
${url}

#Myark #Education #Students`;
}

function generateThisWeekCaption(opps: Opportunity[], platform: Platform): string {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  const weekLabel = weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  const items = opps.slice(0, 4);

  if (platform === 'instagram') {
    let body = `📋 THIS WEEK ON MYARK — Week of ${weekLabel}\n\nHere's what's new for school students this week:\n\n`;

    items.forEach((opp, i) => {
      const classRange = formatClassRange(opp.eligibility_classes);
      const categoryLabel = opp.category?.label || '';
      body += `${['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i]} ${opp.title}\n`;
      body += `   📂 ${categoryLabel} | 🎯 ${classRange}`;
      if (opp.deadline) body += ` | 📅 ${formatDate(opp.deadline)}`;
      body += '\n\n';
    });

    body += `That's ${items.length} new opportunities your child can explore today.\n\n`;
    body += `🔗 Browse all on Myark → Link in bio\nmyark.in\n\n`;
    body += `Save this post & come back every Sunday! 🔔\n\n`;
    body += `#Myark #ThisWeekOnMyark #WeeklyRoundup #SchoolStudents #Opportunities #IndianStudents #Education #Scholarships #Olympiads`;

    return body;
  }

  if (platform === 'whatsapp') {
    let body = `📋 *THIS WEEK ON MYARK* — Week of ${weekLabel}\n\nNew opportunities for school students:\n\n`;

    items.forEach((opp, i) => {
      const classRange = formatClassRange(opp.eligibility_classes);
      body += `${i + 1}. *${opp.title}*\n`;
      body += `   ${classRange}`;
      if (opp.deadline) body += ` | Deadline: ${formatDate(opp.deadline)}`;
      body += '\n';
    });

    body += `\n👉 Browse all: ${SITE_URL}/opportunities\n\n`;
    body += `_New opportunities added every week. Forward to parents who care._ 📲`;

    return body;
  }

  // Twitter/X
  let body = `📋 This Week on Myark — ${weekLabel}\n\n`;
  items.forEach((opp, i) => {
    body += `${i + 1}. ${opp.title} (${formatClassRange(opp.eligibility_classes)})\n`;
  });
  body += `\nBrowse all → ${SITE_URL}/opportunities\n\n#Myark #WeeklyRoundup #Students`;

  return body;
}

/* ──────────────────────────────────────────────
   Icons
   ────────────────────────────────────────────── */

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Sub-Components
   ────────────────────────────────────────────── */

function PlatformTabs({ active, onChange }: { active: Platform; onChange: (p: Platform) => void }) {
  const platforms: { key: Platform; label: string; icon: string }[] = [
    { key: 'instagram', label: 'Instagram', icon: '📸' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { key: 'twitter', label: 'X / Twitter', icon: '𝕏' },
  ];

  return (
    <div className="flex gap-2">
      {platforms.map(p => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
            ${active === p.key
              ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/15'
              : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
        >
          <span className="text-[15px]">{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}

function CaptionCard({
  caption,
  label,
  sublabel,
  urgencyBadge,
}: {
  caption: string;
  label: string;
  sublabel?: string;
  urgencyBadge?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/15 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{label}</span>
            {sublabel && <span className="text-[12px] text-gray-500 dark:text-gray-500 truncate">{sublabel}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {urgencyBadge}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all
              ${copied
                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-gray-900 dark:bg-white/10 text-white hover:bg-gray-700 dark:hover:bg-white/15'
              }`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Caption body */}
      <div className="p-5">
        <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-[1.7] text-gray-700 dark:text-gray-300 selection:bg-green-200 dark:selection:bg-green-500/30 max-h-[400px] overflow-y-auto custom-scrollbar">
          {caption}
        </pre>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
        <span className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
          {caption.length} characters
        </span>
        <button
          onClick={handleCopy}
          className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <ShareIcon />
          Copy & share
        </button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-600 mb-4">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-[13px] text-gray-500 dark:text-gray-500 max-w-sm">{description}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */

export function SocialPostGenerator({ closingSoon, thisWeek, allPublished }: Props) {
  const [activeTab, setActiveTab] = useState<PostType>('closing-soon');
  const [platform, setPlatform] = useState<Platform>('whatsapp');
  const [spotlightIdx, setSpotlightIdx] = useState(0);

  // Pick a deterministic "Did You Know" opportunity based on day-of-year
  const spotlightPool = useMemo(() => {
    // Shuffle based on day to get variety, pick opportunities with rich data
    return allPublished.filter(o =>
      o.prize_text || o.eligibility_text || o.fee_text
    );
  }, [allPublished]);

  const currentSpotlight = spotlightPool[spotlightIdx % Math.max(spotlightPool.length, 1)];

  const tabs: { key: PostType; label: string; icon: React.ReactNode; count: number; color: string }[] = [
    {
      key: 'closing-soon',
      label: 'Closing Soon',
      icon: <ClockIcon />,
      count: closingSoon.length,
      color: 'text-red-500 dark:text-red-400',
    },
    {
      key: 'did-you-know',
      label: 'Did You Know',
      icon: <LightbulbIcon />,
      count: spotlightPool.length,
      color: 'text-amber-500 dark:text-amber-400',
    },
    {
      key: 'this-week',
      label: 'This Week',
      icon: <CalendarIcon />,
      count: thisWeek.length,
      color: 'text-blue-500 dark:text-blue-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <SparklesIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Social Post Command Center
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-500">
              Auto-generated captions from your live opportunity data. Copy → Paste → Post.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all text-left
              ${activeTab === tab.key
                ? 'bg-white dark:bg-[#141414] border-gray-300 dark:border-white/15 shadow-md ring-1 ring-gray-200 dark:ring-white/10'
                : 'bg-white/50 dark:bg-[#0d0d0d] border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10'
              }`}
          >
            <div className={`${tab.color} shrink-0`}>
              {tab.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[22px] font-bold text-gray-900 dark:text-white leading-none mb-0.5">{tab.count}</div>
              <div className="text-[12px] font-medium text-gray-500 dark:text-gray-500 truncate">{tab.label}</div>
            </div>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* ── Platform Tabs ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <PlatformTabs active={platform} onChange={setPlatform} />
        <div className="text-[12px] text-gray-400 dark:text-gray-600 font-medium">
          {platform === 'instagram' && '📸 Optimized for Instagram feed caption'}
          {platform === 'whatsapp' && '💬 Formatted with bold text for WhatsApp forwards'}
          {platform === 'twitter' && '𝕏 Compact for Twitter/X character limit'}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="space-y-4">
        {/* ═══ CLOSING SOON TAB ═══ */}
        {activeTab === 'closing-soon' && (
          <>
            {closingSoon.length === 0 ? (
              <EmptyState
                icon={<ClockIcon />}
                title="No upcoming deadlines"
                description="No opportunities are closing within the next 14 days. Posts will appear here automatically."
              />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[12px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                    Deadline alerts — {closingSoon.length} active
                  </span>
                </div>
                {closingSoon.map(opp => {
                  const days = getDaysUntilDeadline(opp.deadline as string) ?? 0;
                  return (
                    <CaptionCard
                      key={opp.id}
                      caption={generateClosingSoonCaption(opp, platform)}
                      label={opp.title}
                      sublabel={`${formatClassRange(opp.eligibility_classes)} · ${opp.category?.label || ''}`}
                      urgencyBadge={
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold
                          ${days <= 3
                            ? 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 animate-pulse'
                            : days <= 7
                              ? 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400'
                              : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {days} day{days !== 1 ? 's' : ''} left
                        </span>
                      }
                    />
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ═══ DID YOU KNOW TAB ═══ */}
        {activeTab === 'did-you-know' && (
          <>
            {spotlightPool.length === 0 ? (
              <EmptyState
                icon={<LightbulbIcon />}
                title="No spotlights available"
                description="Add opportunities with prize info, fees, or eligibility to generate spotlight posts."
              />
            ) : (
              <>
                {/* Spotlight selector */}
                <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[12px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                        Daily spotlight — pick an opportunity
                      </span>
                    </div>
                    <button
                      onClick={() => setSpotlightIdx(prev => (prev + 1) % spotlightPool.length)}
                      className="text-[12px] font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10"
                    >
                      <SparklesIcon />
                      Shuffle next
                    </button>
                  </div>

                  {/* Opportunity chips */}
                  <div className="flex flex-wrap gap-2">
                    {spotlightPool.slice(0, 12).map((opp, i) => (
                      <button
                        key={opp.id}
                        onClick={() => setSpotlightIdx(i)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border
                          ${spotlightIdx === i
                            ? 'bg-green-100 dark:bg-green-500/15 text-green-800 dark:text-green-300 border-green-300 dark:border-green-500/30'
                            : 'bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10'
                          }`}
                      >
                        {opp.title.length > 35 ? opp.title.slice(0, 35) + '…' : opp.title}
                      </button>
                    ))}
                    {spotlightPool.length > 12 && (
                      <span className="px-3 py-1.5 text-[12px] text-gray-400 dark:text-gray-600">
                        +{spotlightPool.length - 12} more
                      </span>
                    )}
                  </div>
                </div>

                {currentSpotlight && (
                  <CaptionCard
                    caption={generateDidYouKnowCaption(currentSpotlight, platform)}
                    label={currentSpotlight.title}
                    sublabel={`${formatClassRange(currentSpotlight.eligibility_classes)} · ${currentSpotlight.category?.label || ''}`}
                    urgencyBadge={
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        💡 Spotlight
                      </span>
                    }
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ═══ THIS WEEK TAB ═══ */}
        {activeTab === 'this-week' && (
          <>
            {thisWeek.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon />}
                title="No new additions this week"
                description="Opportunities added in the last 7 days will appear here for your Sunday roundup post."
              />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[12px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                    Sunday roundup — {thisWeek.length} new this week
                  </span>
                </div>

                {/* Preview of what's included */}
                <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 mb-4">
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Opportunities in this roundup:</h4>
                  <div className="space-y-2">
                    {thisWeek.slice(0, 4).map((opp, i) => (
                      <div key={opp.id} className="flex items-center gap-3 text-[13px]">
                        <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{opp.title}</span>
                        <span className="text-gray-400 dark:text-gray-600 text-[11px] shrink-0">
                          {formatClassRange(opp.eligibility_classes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <CaptionCard
                  caption={generateThisWeekCaption(thisWeek, platform)}
                  label="This Week on Myark"
                  sublabel={`Sunday roundup · ${thisWeek.slice(0, 4).length} opportunities`}
                  urgencyBadge={
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400">
                      📋 Weekly
                    </span>
                  }
                />
              </>
            )}
          </>
        )}
      </div>

      {/* ── Pro Tips Footer ── */}
      <div className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/[0.02] dark:to-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <SparklesIcon />
          Posting Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-[12px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">⏰ Closing Soon</div>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Post every time a deadline is within 5-7 days. This is your highest-value content — parents forward these.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-[12px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">💡 Did You Know</div>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
              One per day. Your awareness engine. Focus on little-known opportunities with impressive prizes or zero fees.
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">📋 This Week</div>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Every Sunday. Lists 3-4 opportunities added that week. Builds habit and drives traffic back to the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
