import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/firebaseAdmin';
import {
  FileText,
  School,
  Users,
  BarChart3,
  Gift,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

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

  const stats = [
    {
      label: 'Total Opportunities',
      value: opportunitiesCount,
      href: '/admin/opportunities',
      action: 'View all',
      icon: FileText,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50 dark:bg-violet-500/10',
      iconBg: 'bg-violet-100 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Schools',
      value: schoolsCount,
      href: '/admin/schools',
      action: 'Manage',
      icon: School,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Users',
      value: usersCount,
      href: '/admin/users',
      action: 'Review',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      bgLight: 'bg-blue-50 dark:bg-blue-500/10',
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Share Analytics',
      value: 'New',
      href: '/admin/analytics/shares',
      action: 'View',
      icon: BarChart3,
      gradient: 'from-orange-500 to-amber-600',
      bgLight: 'bg-orange-50 dark:bg-orange-500/10',
      iconBg: 'bg-orange-100 dark:bg-orange-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Reward Settings',
      value: 'Configure',
      href: '/admin/settings/rewards',
      action: 'Manage',
      icon: Gift,
      gradient: 'from-pink-500 to-rose-600',
      bgLight: 'bg-pink-50 dark:bg-pink-500/10',
      iconBg: 'bg-pink-100 dark:bg-pink-500/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-violet-200" />
            <span className="text-sm font-medium text-violet-200">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="mt-2 text-violet-100 max-w-xl">
            Manage opportunities, schools, and users across the MyArk platform.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`group relative overflow-hidden border-0 ${stat.bgLight} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${stat.gradient} opacity-60`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
            <Link href={stat.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 duration-200">
              {stat.action}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-500/20">
            <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/opportunities">
            <Button variant="outline" className="w-full justify-start gap-2 h-12 border-border/60 dark:border-white/10 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:border-violet-200 dark:hover:border-violet-500/30 transition-colors">
              <FileText className="h-4 w-4 text-violet-600" />
              Add Opportunity
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline" className="w-full justify-start gap-2 h-12 border-border/60 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
              <FileText className="h-4 w-4 text-emerald-600" />
              Create Blog Post
            </Button>
          </Link>
          <Link href="/admin/schools">
            <Button variant="outline" className="w-full justify-start gap-2 h-12 border-border/60 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
              <School className="h-4 w-4 text-blue-600" />
              Add School
            </Button>
          </Link>
          <Link href="/admin/bulk">
            <Button variant="outline" className="w-full justify-start gap-2 h-12 border-border/60 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-colors">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Bulk Upload
            </Button>
          </Link>
        </div>
      </Card>

      {/* Next Actions Card */}
      <Card className="border-border/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Getting Started</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
            Build CRUD pages for opportunities, schools, and users listed in the left navigation.
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
            Extend API endpoints under <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">/api/admin</code> to cover create/update/delete operations.
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
            Assign <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">ADMIN_PANEL_SECRET</code> a strong secret in production.
          </li>
        </ul>
      </Card>
    </div>
  );
}




