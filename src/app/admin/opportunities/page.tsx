import { OpportunitiesManager } from './OpportunitiesManager';

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Opportunities</h1>
        <p className="mt-2 text-sm text-slate-300">
          Create, edit, and remove opportunities from the Firestore collection used by the public site.
        </p>
      </div>
      <OpportunitiesManager />
    </div>
  );
}
