'use client';

export function JourneySection() {
  const steps = [
    {
      id: 1,
      icon: '🔍',
      title: 'Search & Discover',
      desc: 'Browse by category, class, or keyword. Every program is manually verified and updated daily.',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      icon: '🚀',
      title: 'Apply Directly',
      desc: 'Zero middle-men. One click takes you to the official registration page of the organiser.',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Win & Grow',
      desc: 'Build a world-class student profile, win rewards, and unlock prestigious opportunities.',
      color: 'bg-amber-500'
    }
  ];

  return (
    <section className="w-full bg-[#fdfdfc] dark:bg-[#0a0a0a] py-16 md:py-24 lg:py-32 relative overflow-hidden border-t border-[var(--color-border-default)]">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
         <div className="absolute inset-0 grid-pattern"></div>
      </div>

      <div className="container-main max-w-[1240px] px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
             Your Roadmap
          </div>
          <h2 className="text-[28px] md:text-[38px] font-heading font-extrabold text-heading mb-5 tracking-tight">
             How Myark Works
          </h2>
          <p className="text-muted text-[15px] max-w-lg mx-auto font-medium">
             Three simple steps to unlock a world of prestigious opportunities for your child.
          </p>
        </div>

        <div className="relative">
          {/* Connecting SVG Path (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full pointer-events-none opacity-20">
             <svg width="100%" height="120" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none">
                <path d="M50 60 Q 250 10, 500 60 T 950 60" stroke="var(--color-primary)" strokeWidth="3" className="journey-path" />
             </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[32px] bg-white dark:bg-[#161616] border-2 border-[var(--color-border-default)] flex items-center justify-center mb-10 shadow-2xl group-hover:border-primary group-hover:glow-primary transition-all duration-500 relative z-10">
                   <span className="text-4xl lg:text-5xl group-hover:scale-125 transition-transform duration-500 select-none">
                     {step.icon}
                   </span>
                   <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-2xl ${step.color} text-white text-[16px] font-black flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}>
                     {step.id}
                   </div>
                </div>
                <h3 className="text-[22px] md:text-[24px] font-heading font-extrabold text-heading mb-4 px-4 tracking-tight group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-[16px] text-muted leading-relaxed max-w-[300px] font-medium">
                   {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
