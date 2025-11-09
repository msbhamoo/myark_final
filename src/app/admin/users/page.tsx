import { UsersManager } from './UsersManager';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <p className="mt-2 text-sm text-slate-300">
          Maintain Firestore-backed user metadata and platform roles.
        </p>
      </div>
      <UsersManager />
    </div>
  );
}
