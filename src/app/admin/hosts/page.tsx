import { HostsManager } from './HostsManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HostsPage() {
  return (
    <div className='space-y-6'>
      <HostsManager />
    </div>
  );
}
