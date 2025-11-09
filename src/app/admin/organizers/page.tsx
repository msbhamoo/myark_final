import { OrganizersManager } from './OrganizersManager';

export default function AdminOrganizersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Organizers</h1>
      <OrganizersManager />
    </div>
  );
}
