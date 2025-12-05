import { HostsManager } from './HostsManager';
import { Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HostsPage() {
  return (
    <div className='space-y-6'>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/25">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hosts</h1>
          <p className="text-sm text-muted-foreground">
            Manage hosting partners and their configurations.
          </p>
        </div>
      </div>
      <HostsManager />
    </div>
  );
}
