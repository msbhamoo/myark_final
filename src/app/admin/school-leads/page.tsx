import SchoolLeadsManager from '@/components/admin/SchoolLeadsManager';
import { UserPlus } from 'lucide-react';

export default function AdminSchoolLeadsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                    <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">School Leads</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage inquiries submitted from the For Schools page
                    </p>
                </div>
            </div>
            <SchoolLeadsManager />
        </div>
    );
}
