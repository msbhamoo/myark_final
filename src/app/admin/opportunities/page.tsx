import { OpportunitiesManager } from './OpportunitiesManager';
import { FileText } from 'lucide-react';

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and remove opportunities from the Firestore collection used by the public site.
          </p>
        </div>
      </div>
      <OpportunitiesManager />
    </div>
  );
}



