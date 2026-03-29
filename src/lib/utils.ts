export function getDaysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export type DeadlineUrgency = 'urgent' | 'warning' | 'safe' | 'ongoing';

export function getDeadlineUrgency(
  deadline: string | null,
  isOngoing: boolean
): { urgency: DeadlineUrgency; label: string; bg: string; text: string } {
  if (isOngoing || !deadline) {
    return {
      urgency: 'ongoing',
      label: 'Open registration',
      bg: 'var(--deadline-ongoing-bg)',
      text: 'var(--deadline-ongoing-text)',
    };
  }

  const days = getDaysUntilDeadline(deadline);
  if (days === null || days < 0) {
    return {
      urgency: 'ongoing',
      label: 'Registration closed',
      bg: 'var(--deadline-ongoing-bg)',
      text: 'var(--deadline-ongoing-text)',
    };
  }

  if (days <= 7) {
    return {
      urgency: 'urgent',
      label: `${days} day${days !== 1 ? 's' : ''} left — apply now`,
      bg: 'var(--deadline-urgent-bg)',
      text: 'var(--deadline-urgent-text)',
    };
  }

  if (days <= 21) {
    return {
      urgency: 'warning',
      label: `${days} days left`,
      bg: 'var(--deadline-warning-bg)',
      text: 'var(--deadline-warning-text)',
    };
  }

  return {
    urgency: 'safe',
    label: `Open — ${days} days`,
    bg: 'var(--deadline-safe-bg)',
    text: 'var(--deadline-safe-text)',
  };
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr || dateStr === 'TBA') return 'TBA';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as is if it's already a string like "Late Nov"
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** 
 * Smartly formats date info, prioritizing exact but falling back to tentative.
 */
export function formatStatusDate(exact: string | null, tentative: string | null): string {
  if (exact) return formatDate(exact);
  if (tentative) return tentative;
  return 'TBA';
}

import { marked } from 'marked';

/**
 * Modern Markdown to HTML converter using 'marked' library
 */
export function renderMarkdown(text: string | null): string {
  if (!text) return '';
  return marked.parse(text, { breaks: true }) as string;
}

export function generateSlug(title: string, year?: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return year ? `${base}-${year}` : base;
}

export function formatClassRange(classes: number[]): string {
  if (!classes || classes.length === 0) return 'All Classes';
  const sorted = [...classes].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  return min === max ? `Class ${min}` : `Class ${min}–${max}`;
}

export function classRangeOverlaps(eligibleClasses: number[], rangeClasses: number[]): boolean {
  return eligibleClasses.some((c) => rangeClasses.includes(c));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
