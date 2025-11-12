import { SchoolsManager } from './SchoolsManager';

export default function AdminSchoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground dark:text-white">Schools</h1>
        <p className="mt-2 text-sm text-slate-300">
          Create or verify schools that organizers and students can associate with their profiles.
        </p>
      </div>
      <SchoolsManager />
    </div>
  );
}

