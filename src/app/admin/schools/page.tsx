import { SchoolsManager } from './SchoolsManager';
import { School } from 'lucide-react';

export default function AdminSchoolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
          <School className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schools</h1>
          <p className="text-sm text-muted-foreground">
            Create or verify schools that organizers and students can associate with their profiles.
          </p>
        </div>
      </div>
      <SchoolsManager />
    </div>
  );
}



