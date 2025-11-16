'use client';

import React, { useMemo } from 'react';
import { Clock, CheckCircle, AlertCircle, Lock } from 'lucide-react';

type OpportunityStatus = 'open' | 'closed' | 'closing_soon';

interface OpportunityStatusBadgeProps {
  registrationDeadline?: string;
  status?: string;
  className?: string;
}

export function OpportunityStatusBadge({
  registrationDeadline,
  status,
  className = '',
}: OpportunityStatusBadgeProps) {
  const statusInfo = useMemo(() => {
    // Determine the actual status based on deadline (takes precedence)
    const deadline = registrationDeadline ? new Date(registrationDeadline) : null;
    const now = new Date();
    const timeUntilDeadline = deadline ? deadline.getTime() - now.getTime() : null;
    const daysUntilDeadline = timeUntilDeadline ? Math.ceil(timeUntilDeadline / (1000 * 60 * 60 * 24)) : null;

    // Check if closed (deadline passed)
    if (timeUntilDeadline !== null && timeUntilDeadline < 0) {
      return {
        type: 'closed' as OpportunityStatus,
        label: 'Closed',
        icon: Lock,
        bgColor: 'bg-red-50/80 dark:bg-red-500/15',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-500/40',
        badgeColor: 'bg-red-150 dark:bg-red-500/25',
        ringColor: 'ring-1 ring-red-200 dark:ring-red-500/30',
      };
    }

    // Check if closing soon
    if (daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
      return {
        type: 'closing_soon' as OpportunityStatus,
        label: `Closing in ${daysUntilDeadline}d`,
        icon: Clock,
        bgColor: 'bg-amber-50/80 dark:bg-amber-500/15',
        textColor: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-300 dark:border-amber-500/40',
        badgeColor: 'bg-amber-150 dark:bg-amber-500/25',
        ringColor: 'ring-1 ring-amber-200 dark:ring-amber-500/30',
      };
    }

    // Default to open
    return {
      type: 'open' as OpportunityStatus,
      label: 'Open',
      icon: CheckCircle,
      bgColor: 'bg-emerald-50/80 dark:bg-emerald-500/15',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-300 dark:border-emerald-500/40',
      badgeColor: 'bg-emerald-150 dark:bg-emerald-500/25',
      ringColor: 'ring-1 ring-emerald-200 dark:ring-emerald-500/30',
    };
  }, [registrationDeadline]);

  const IconComponent = statusInfo.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${statusInfo.badgeColor} px-2.5 py-1.5 border ${statusInfo.borderColor} ${statusInfo.textColor} text-xs font-bold ${statusInfo.ringColor} ${className}`}
    >
      <IconComponent className="h-4 w-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{statusInfo.label}</span>
    </div>
  );
}

export function OpportunityStatusBadgeMinimal({
  registrationDeadline,
  status,
}: OpportunityStatusBadgeProps) {
  const statusInfo = useMemo(() => {
    // Determine the actual status based on deadline (takes precedence)
    const deadline = registrationDeadline ? new Date(registrationDeadline) : null;
    const now = new Date();
    const timeUntilDeadline = deadline ? deadline.getTime() - now.getTime() : null;
    const daysUntilDeadline = timeUntilDeadline ? Math.ceil(timeUntilDeadline / (1000 * 60 * 60 * 24)) : null;

    // Check if closed (deadline passed)
    if (timeUntilDeadline !== null && timeUntilDeadline < 0) {
      return {
        label: 'Closed',
        dotColor: 'bg-red-500 shadow-red-500/50',
        textColor: 'text-red-700 dark:text-red-300',
        icon: Lock,
      };
    }

    // Check if closing soon
    if (daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
      return {
        label: `Closing in ${daysUntilDeadline}d`,
        dotColor: 'bg-amber-500 shadow-amber-500/50',
        textColor: 'text-amber-700 dark:text-amber-300',
        icon: Clock,
      };
    }

    // Default to open
    return {
      label: 'Open',
      dotColor: 'bg-emerald-500 shadow-emerald-500/50',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle,
    };
  }, [registrationDeadline]);

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${statusInfo.textColor}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${statusInfo.dotColor} shadow-lg`} />
      <span className="whitespace-nowrap">{statusInfo.label}</span>
    </div>
  );
}

