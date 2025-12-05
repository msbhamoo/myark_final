import { HomeSegmentsManager } from './HomeSegmentsManager';
import { Home } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomeSegmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
          <Home className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Home Page Segments</h1>
          <p className="text-sm text-muted-foreground">
            Manage the segments that appear on the home page.
          </p>
        </div>
      </div>
      <HomeSegmentsManager />
    </div>
  );
}



