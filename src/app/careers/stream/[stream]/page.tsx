import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
import { CareerCard } from '@/components/CareerCard';
import { Career } from '@/lib/types';

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: { stream: string } }): Promise<Metadata> {
  const streamName = params.stream.replace(/-/g, ' ');
  return {
    title: `Careers After 12th ${streamName.toUpperCase()} — The Complete List | Myark`,
    description: `Every career option available for students from the ${streamName} stream. Direct data on salary, exams, and preparation.`,
  };
}

export default async function CareerStreamPage({ params }: { params: { stream: string } }): Promise<JSX.Element> {
  const supabase = createServerClient();
  const rawStream = params.stream.replace(/-/g, ' ');

  let query = supabase
    .from('career_directory')
    .select('*')
    .eq('is_published', true);

  // Apply stream filtering
  if (rawStream === 'science pcm') {
      query = query.ilike('stream_required', '%PCM%');
  } else if (rawStream === 'science pcb') {
      query = query.ilike('stream_required', '%PCB%');
  } else if (rawStream === 'commerce') {
      query = query.ilike('stream_required', '%Commerce%');
  } else if (rawStream === 'arts') {
      query = query.ilike('stream_required', '%Arts%');
  } else {
      query = query.ilike('stream_required', `%${rawStream}%`);
  }

  const { data: careersData } = await query.order('name', { ascending: true });
  const careers: Career[] = careersData || [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
        <section className="bg-surface border-b border-default pt-24 pb-16 px-4 md:py-32">
            <div className="container-main max-w-[1240px] px-4">
                <nav className="flex items-center gap-2 mb-8 text-[11px] font-bold text-muted uppercase tracking-widest">
                    <Link href="/careers" className="hover:text-primary">Careers</Link>
                    <span>/</span>
                    <span className="text-heading">Stream</span>
                </nav>
                <h1 className="text-[36px] md:text-[60px] font-heading font-extrabold text-heading leading-[1.1] mb-6">
                    Careers After 12th <br />
                    <span className="text-primary italic">{rawStream.toUpperCase()}</span>
                </h1>
                <p className="text-[17px] md:text-[20px] text-muted font-medium max-w-2xl leading-relaxed">
                    A list of {careers.length} careers open to {rawStream.toUpperCase()} students. Explore possibilities beyond the mainstream.
                </p>
            </div>
        </section>

        <section className="py-20">
            <div className="container-main max-w-[1240px] px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {careers.map(c => <CareerCard key={c.id} career={c} />)}
                </div>
            </div>
        </section>
    </div>
  );
}
