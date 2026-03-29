import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { EditCareerForm } from './EditCareerForm';
import Link from 'next/link';

export default async function EditCareerPage({ params }: { params: { id: string } }) {
    const supabase = createServerClient();
    const { data: career } = await supabase.from('career_directory').select('*').eq('id', params.id).single();
    
    if (!career) notFound();
    
    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Link href="/admin/careers" className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Careers</Link>
                <span className="text-gray-400">/</span>
                <span className="text-sm font-medium">{career.name}</span>
            </div>
            <EditCareerForm career={career} />
        </div>
    );
}
