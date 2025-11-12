import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/firebaseAdmin';

async function getCollectionCount(collection: string) {
  const db = getDb();
  const snapshot = await db.collection(collection).count().get().catch(() => null);
  return snapshot?.data().count ?? 0;
}

export default async function AdminDashboardPage() {
  const [opportunitiesCount, schoolsCount, usersCount] = await Promise.all([
    getCollectionCount('opportunities'),
    getCollectionCount('schools'),
    getCollectionCount('users'),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-foreground dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Manage opportunities, schools, and users across the MyArk platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/80 dark:bg-white/5 p-6 backdrop-blur border-border/60 dark:border-white/10">
          <p className="text-sm text-slate-300">Total Opportunities</p>
          <p className="mt-2 text-3xl font-semibold text-foreground dark:text-white">{opportunitiesCount}</p>
          <Link href="/admin/opportunities" className="mt-4 inline-flex">
            <Button variant="outline" size="sm">
              View opportunities
            </Button>
          </Link>
        </Card>

        <Card className="bg-card/80 dark:bg-white/5 p-6 backdrop-blur border-border/60 dark:border-white/10">
          <p className="text-sm text-slate-300">Schools</p>
          <p className="mt-2 text-3xl font-semibold text-foreground dark:text-white">{schoolsCount}</p>
          <Link href="/admin/schools" className="mt-4 inline-flex">
            <Button variant="outline" size="sm">
              Manage schools
            </Button>
          </Link>
        </Card>

        <Card className="bg-card/80 dark:bg-white/5 p-6 backdrop-blur border-border/60 dark:border-white/10">
          <p className="text-sm text-slate-300">Users</p>
          <p className="mt-2 text-3xl font-semibold text-foreground dark:text-white">{usersCount}</p>
          <Link href="/admin/users" className="mt-4 inline-flex">
            <Button variant="outline" size="sm">
              Review users
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="bg-card/80 dark:bg-white/5 p-6 backdrop-blur border-border/60 dark:border-white/10">
        <h2 className="text-xl font-semibold text-foreground dark:text-white">Next actions</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Build CRUD pages for opportunities, schools, and users listed in the left navigation.</li>
          <li>Extend API endpoints under <code className="rounded bg-card/70 dark:bg-white/10 px-1.5">/api/admin</code> to cover create/update/delete operations.</li>
          <li>Assign <code>ADMIN_PANEL_SECRET</code> a strong secret in production, rotate it periodically, and share it only with trusted staff.</li>
        </ul>
      </Card>
    </div>
  );
}



