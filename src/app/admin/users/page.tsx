import { UsersManager } from './UsersManager';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            Maintain Firestore-backed user metadata and platform roles.
          </p>
        </div>
      </div>
      <UsersManager />
    </div>
  );
}



