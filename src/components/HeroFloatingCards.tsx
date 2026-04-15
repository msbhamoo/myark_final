'use client';

import { useEffect, useState } from 'react';

interface FloatingCard {
  title: string;
  category: string;
  catColor: string;
  deadline: string;
  detail: string;
}

const cards: FloatingCard[] = [
  {
    title: 'National Merit Scholarship',
    category: 'Scholarship',
    catColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    deadline: 'Closes in 12 days',
    detail: '₹1,00,000 p.a. · Class 9–12',
  },
  {
    title: 'Indian National Science Olympiad',
    category: 'Olympiad',
    catColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    deadline: 'Open · 45 days left',
    detail: 'Free entry · Class 5–12',
  },
  {
    title: 'Young Innovators Challenge',
    category: 'Competition',
    catColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    deadline: 'Registration open',
    detail: '₹5 Lakh prize pool · Teams',
  },
];

export function HeroFloatingCards() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`relative w-full h-[320px] md:h-[420px] transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Card 1 — top-left */}
      <div
        className="absolute top-0 left-[5%] md:left-[10%] w-[220px] md:w-[260px] animate-float-slow"
        style={{ animationDelay: '0s' }}
      >
        <CardShell card={cards[0]} />
      </div>

      {/* Card 2 — center-right */}
      <div
        className="absolute top-[90px] md:top-[100px] right-0 md:right-[5%] w-[220px] md:w-[260px] animate-float-slow"
        style={{ animationDelay: '1.5s' }}
      >
        <CardShell card={cards[1]} />
      </div>

      {/* Card 3 — bottom-center */}
      <div
        className="absolute bottom-0 left-[15%] md:left-[20%] w-[220px] md:w-[260px] animate-float-slow"
        style={{ animationDelay: '3s' }}
      >
        <CardShell card={cards[2]} />
      </div>
    </div>
  );
}

function CardShell({ card }: { card: FloatingCard }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-4 shadow-2xl shadow-black/30 hover:border-white/[0.15] transition-all duration-300 hover:scale-[1.03] cursor-default">
      {/* Category pill */}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${card.catColor} mb-3`}>
        {card.category}
      </span>

      {/* Title */}
      <h4 className="text-[14px] md:text-[15px] font-bold text-[#f0ede5] leading-snug mb-2">
        {card.title}
      </h4>

      {/* Detail row */}
      <p className="text-[11px] text-[#8a8a84] mb-3">{card.detail}</p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
        <span className="text-[10px] font-medium text-[#70A5FF]">{card.deadline}</span>
        <span className="text-[10px] text-[#6a6a64]">View →</span>
      </div>
    </div>
  );
}
