import { User } from 'lucide-react';

interface AuthorBioCardProps {
    name: string;
    className?: string;
}

export function AuthorBioCard({ name, className = '' }: AuthorBioCardProps) {
    // Generate initials from name
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Generate a consistent color based on name
    const colors = [
        'from-orange-400 to-pink-500',
        'from-blue-400 to-purple-500',
        'from-green-400 to-emerald-500',
        'from-purple-400 to-indigo-500',
        'from-pink-400 to-rose-500',
    ];
    const colorIndex = name.length % colors.length;

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-900/50 ${className}`}>
            <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Author at Myark
                </p>
            </div>
        </div>
    );
}
