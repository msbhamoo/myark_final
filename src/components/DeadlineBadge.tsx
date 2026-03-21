import {
  getDeadlineUrgency,
  DeadlineUrgency,
  cn,
} from '@/lib/utils';
import { CalendarIcon } from './icons/CalendarIcon';

interface DeadlineBadgeProps {
  deadline: string | null;
  isOngoing: boolean;
  className?: string;
}

export function DeadlineBadge({ deadline, isOngoing, className }: DeadlineBadgeProps) {
  const { label, bg, text, urgency } = getDeadlineUrgency(deadline, isOngoing);

  return (
    <div
      className={cn(
        'badge shadow-sm',
        urgency === 'urgent' && 'animate-pulse ring-1 ring-[#791f1f]/20',
        className
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      <CalendarIcon className="w-3 h-3" />
      <span>{label}</span>
    </div>
  );
}
