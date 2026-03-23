import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { OlympiadCard } from '@/components/OlympiadCard';
import { Olympiad } from '@/lib/types';

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "The HBCSE Olympiads Pathway Guide 2026 — IMO, IPhO, IChO, IBO | Myark",
  description: "Complete roadmap for the Homi Bhabha Centre for Science Education (HBCSE) olympiads. From NSEs to representing India at International Olympiads.",
};

export default async function HBCSEPathwayPage() {
  const supabase = createServerClient();

  const { data: olympiadsData } = await supabase
    .from('olympiad_directory')
    .select('*')
    .eq('is_published', true)
    .eq('organiser_group', 'HBCSE / IAPT')
    .order('level', { ascending: true });

  const olympiads: Olympiad[] = olympiadsData || [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0a0f0a] text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22c55e] blur-[150px] rounded-full"></div>
        </div>
        <div className="container-main max-w-[1000px] px-4 relative z-10">
            <nav className="flex items-center gap-2 mb-8 text-[13px] font-bold text-[#4ade80] uppercase tracking-widest">
                <Link href="/olympiads" className="hover:underline">Olympiads</Link>
                <span>/</span>
                <span className="text-white/40">HBCSE Pathway</span>
            </nav>
            <h1 className="text-[32px] md:text-[56px] font-heading font-extrabold leading-tight mb-6 text-[#f0ede5]">
                The Gold Standard: <br />
                <span className="text-[#4ade80]">HBCSE Olympiads</span>
            </h1>
            <p className="text-[16px] md:text-[20px] text-[#8a8a84] max-w-2xl leading-relaxed font-medium">
                The official and only pathway to represent India at the International Olympiads. Organised by HBCSE, IAPT, and HBCSE-authorised bodies.
            </p>
        </div>
      </section>

      {/* Pathway Visualization */}
      <section className="py-16 md:py-24 bg-surface border-b border-default">
        <div className="container-main max-w-[1000px] px-4 text-center">
            <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading mb-12">The 5-Stage Journey</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { stage: "Stage 1", name: "NSE", desc: "National Standard Exams (NSEP, NSEC, NSEB, NSEA, NSEJS)", color: "bg-blue-500" },
                    { stage: "Stage 2", name: "INOs", desc: "Indian National Olympiads (INPhO, INChO, etc.)", color: "bg-purple-500" },
                    { stage: "Stage 3", name: "OCSC", desc: "Orientation-cum-Selection Camp at HBCSE Mumbai", color: "bg-orange-500" },
                    { stage: "Stage 4", name: "PDT", desc: "Pre-departure Training Camp", color: "bg-pink-500" },
                    { stage: "Stage 5", name: "International", desc: "Represent India at IMO, IPhO, IChO, etc.", color: "bg-green-600" }
                ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full ${s.color} text-white font-bold flex items-center justify-center mb-4 shadow-lg`}>
                            {i + 1}
                        </div>
                        <h3 className="font-bold text-heading text-[15px] mb-1">{s.name}</h3>
                        <p className="text-[12px] text-muted leading-tight">{s.desc}</p>
                        {i < 4 && <div className="hidden md:block absolute translate-x-1/2 translate-y-6">→</div>}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* List of HBCSE Olympiads */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-[1200px] px-4">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading">HBCSE / IAPT Programs</h2>
                    <p className="text-muted mt-2">Currently {olympiads.length} programs listed under the official pathway.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {olympiads.map(o => (
                    <OlympiadCard key={o.id} olympiad={o} />
                ))}
            </div>
            
            <div className="mt-20 p-8 md:p-12 bg-[#fffbeb] dark:bg-amber-900/10 border border-[#fde68a] dark:border-amber-700/40 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h3 className="text-[22px] md:text-[28px] font-heading font-extrabold text-amber-900 dark:text-amber-100 mb-4">Important for Students</h3>
                        <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed mb-6">
                            Stage 1 (NSE) is generally held in November. Registration typically happens through your school or designated centres in August-September. Ensure you do not miss the window for the official national standard examinations.
                        </p>
                        <a href="https://hbcse.tifr.res.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-amber-900 text-white font-bold text-[14px]">Official HBCSE Site ↗</a>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-[#fde68a]/50">
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Nov</p>
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">NSE Exams</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-[#fde68a]/50">
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Jan</p>
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">INOs Results</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-[#fde68a]/50">
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Apr</p>
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">OCSC Camp</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-[#fde68a]/50">
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Jul</p>
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">International</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
