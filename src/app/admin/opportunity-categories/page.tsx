import { CategoriesManager } from './CategoriesManager';

export default function AdminOpportunityCategoriesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Opportunity Categories</h1>
      <CategoriesManager />
    </div>
  );
}
