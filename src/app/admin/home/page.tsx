import { HomeSegmentsManager } from './HomeSegmentsManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomeSegmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground dark:text-white">Home Page Segments</h1>
        <p className="mt-1 text-muted-foreground">
          Manage the segments that appear on the home page.
        </p>
      </div>
      <HomeSegmentsManager />
    </div>
  );
}



