import { CareersManager } from './CareersManager';
import { Compass } from 'lucide-react';

export default function AdminCareersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/25">
                    <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Careers</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage career paths, roadmaps, and descriptions for the Career Finder.
                    </p>
                </div>
            </div>
            <CareersManager />
        </div>
    );
}
