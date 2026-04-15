'use client';

export function TrustSection() {
  const points = [
    {
      title: 'Verified Sources',
      desc: 'Every opportunity links to official organiser websites. No fake listings, ever.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      bgColor: 'bg-[#dcfce7] dark:bg-blue-500/10',
      iconColor: 'text-blue-700 dark:text-blue-500'
    },
    {
      title: 'Zero Data Selling',
      desc: 'Student data stays private. We never sell or share personal information with anyone.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
      bgColor: 'bg-[#dbeafe] dark:bg-blue-500/10',
      iconColor: 'text-blue-700 dark:text-blue-500'
    },
    {
      title: '100% Free Access',
      desc: 'No hidden charges, no premium tiers. Myark is free for every student in India.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      bgColor: 'bg-[#fef3c7] dark:bg-amber-500/10',
      iconColor: 'text-amber-700 dark:text-amber-500'
    },
    {
      title: 'Verified Daily',
      desc: 'Deadlines, eligibility, and new programs are checked and refreshed every single day.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      bgColor: 'bg-[#f3e8ff] dark:bg-purple-500/10',
      iconColor: 'text-purple-700 dark:text-purple-500'
    }
  ];

  return (
    <section className="w-full bg-[var(--color-bg)] py-16 md:py-20 relative">
      <div className="container-main max-w-[1100px] px-4">
        <div className="text-center mb-12">
          <p className="text-[11px] font-black tracking-[0.15em] text-primary uppercase mb-3">Built on Integrity</p>
          <h2 className="text-[28px] md:text-[36px] font-heading font-extrabold text-heading mb-4 tracking-tight">Why parents trust Myark</h2>
          <p className="text-[15px] text-muted max-w-lg mx-auto font-medium">
             Engineered with safety, transparency, and your child&apos;s digital privacy at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {points.map((point, i) => (
            <div 
              key={i} 
              className="group bg-surface dark:bg-[#161616] border border-[var(--color-border-default)] rounded-[28px] p-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${point.bgColor} flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-500`}>
                <div className={point.iconColor}>{point.icon}</div>
              </div>
              <h3 className="text-[17px] font-heading font-extrabold text-heading mb-3 tracking-tight">{point.title}</h3>
              <p className="text-[14px] text-muted leading-[1.6] font-medium">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
