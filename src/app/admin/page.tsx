import { createServerClient } from '@/lib/supabase-server';

export default async function AdminDashboard() {
  const supabase = createServerClient();

  // Basic counts
  const [
    { count: oppsCount }, 
    { count: studentsCount }, 
    { count: regsCount },
    { count: olymCount },
    { count: careerCount }
  ] = await Promise.all([
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('olympiad_directory').select('*', { count: 'exact', head: true }),
    supabase.from('career_directory').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-tight">Opportunities</p>
          <p className="text-3xl font-bold text-[#1b5e28]">{oppsCount || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-tight">Olympiads</p>
          <p className="text-3xl font-bold text-[#1b5e28]">{olymCount || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-tight">Careers</p>
          <p className="text-3xl font-bold text-[#1b5e28]">{careerCount || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-tight">Students</p>
          <p className="text-3xl font-bold text-[#1b5e28]">{studentsCount || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-tight">Registrations</p>
          <p className="text-3xl font-bold text-[#1b5e28]">{regsCount || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recent Action Needed</h2>
          <p className="text-gray-500 text-sm mt-1">Opportunities closing within the next 30 days that might need attention.</p>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm pb-2">More dashboard features coming soon.</p>
        </div>
      </div>
    </div>
  );
}
