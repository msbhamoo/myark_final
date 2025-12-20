/**
 * Share Utility
 * Provides device-native sharing with fallback to copy-to-clipboard
 * Client-side utility for sharing opportunities and careers
 */

import type { ShareOptions } from '@/types/community';
import type { Opportunity } from '@/types/opportunity';

/**
 * Pool of motivational quotes for students
 */
const MOTIVATIONAL_QUOTES = [
  "🌟 Every opportunity is a stepping stone to your dreams. Take the leap!",
  "💪 Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "🚀 Your future is created by what you do today, not tomorrow. Start now!",
  "✨ Believe in yourself and all that you are. You are capable of amazing things!",
  "🎯 The only way to do great work is to love what you do. Chase your passion!",
  "🌈 Don't wait for opportunity. Create it. Your success starts here!",
  "💫 Dream big, work hard, stay focused, and surround yourself with good people.",
  "🔥 Success doesn't come from what you do occasionally. It comes from what you do consistently.",
  "⭐ The future belongs to those who believe in the beauty of their dreams.",
  "🎓 Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
];

/**
 * Get a random motivational quote
 */
const getRandomQuote = (): string => {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};

/**
 * Check if the Web Share API is available
 */
export const isShareAPIAvailable = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return !!navigator.share;
};

/**
 * Copy text to clipboard with fallback for older browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard', error);
    return false;
  }
};

/**
 * Share using native share or copy to clipboard
 */
export const shareOpportunity = async (options: ShareOptions): Promise<boolean> => {
  try {
    if (isShareAPIAvailable()) {
      const shareData: ShareData = {
        title: options.title,
        text: options.text,
      };
      await navigator.share(shareData);
      return true;
    } else {
      const fullMessage = options.text ?? options.url;
      const success = await copyToClipboard(fullMessage);
      return success;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    console.error('Share failed', error);
    return false;
  }
};

/**
 * Generate a unique share tracking code
 */
export const generateShareCode = (userId?: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  if (userId) {
    const userHash = userId.substring(0, 8);
    return `usr_${userHash}_${timestamp}${random}`;
  } else {
    return `anon_${timestamp}${random}`;
  }
};

/**
 * Generate a share URL
 */
export const generateShareUrl = (
  baseUrl: string,
  id: string,
  slug?: string,
  shareCode?: string,
  type: 'opportunity' | 'career' = 'opportunity'
): string => {
  const pathname = type === 'career'
    ? `/career-finder/${slug || id}`
    : `/opportunity/${slug || id}`;

  const url = new URL(pathname, baseUrl);
  if (shareCode) {
    url.searchParams.set('ref', shareCode);
  } else {
    url.searchParams.set('shared', 'true');
  }
  return url.toString();
};

/**
 * Record a share event
 */
export const recordShare = async (params: {
  opportunityId: string;
  opportunityTitle: string;
  opportunitySlug?: string;
  shareMethod: 'native' | 'clipboard';
  userId?: string;
  userEmail?: string;
  userName?: string;
}): Promise<string | null> => {
  try {
    const platform = typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';
    const response = await fetch('/api/shares/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, platform }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.shareCode;
  } catch (error) {
    console.error('Error recording share:', error);
    return null;
  }
};

/**
 * Generate an engaging share message for opportunities
 */
export const generateEngagingShareMessage = (
  opportunity: Opportunity,
  shareUrl: string,
): string => {
  const lines: string[] = [];
  lines.push(`🎯 *${opportunity.title}*`);
  lines.push('');
  if (opportunity.description) {
    const cleanDesc = opportunity.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    lines.push(`📝 ${cleanDesc.substring(0, 150)}...`);
    lines.push('');
  }
  if (opportunity.registrationDeadline) {
    const deadline = new Date(opportunity.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    lines.push(`⏰ *Deadline:* ${deadline}`);
  }
  lines.push(`🔗 *Apply:* ${shareUrl}`);
  lines.push('');
  lines.push(getRandomQuote());
  return lines.join('\n');
};

/**
 * Generate an engaging share message for careers
 */
export const generateCareerShareMessage = (
  career: any,
  shareUrl: string,
): string => {
  const lines: string[] = [];
  lines.push(`🚀 *Career Spotlight: ${career.title}*`);
  lines.push('');
  const cleanDesc = (career.shortDescription || career.fullDescription || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  lines.push(`📝 ${cleanDesc.substring(0, 150)}...`);
  lines.push('');
  lines.push(`💰 *Salary:* ₹${career.salary.min} - ₹${career.salary.max} per year`);
  lines.push(`🔗 *Explorer:* ${shareUrl}`);
  lines.push('');
  lines.push(getRandomQuote());
  return lines.join('\n');
};

/**
 * Simple share message
 */
export const generateShareMessage = (title: string, description?: string): string => {
  return description ? `${title}\n\n${description}` : title;
};

/**
 * Share with full metadata
 */
export const shareOpportunityWithMetadata = async (options: {
  opportunityId: string;
  opportunityTitle: string;
  opportunitySlug?: string;
  description?: string;
  baseUrl: string;
  opportunity?: Opportunity;
  type?: 'opportunity' | 'career';
}): Promise<boolean> => {
  const shareMethod = isShareAPIAvailable() ? 'native' : 'clipboard';
  const url = generateShareUrl(options.baseUrl, options.opportunityId, options.opportunitySlug, undefined, options.type);

  let text = '';
  if (options.type === 'career' && options.opportunity) {
    text = generateCareerShareMessage(options.opportunity, url);
  } else if (options.opportunity) {
    text = generateEngagingShareMessage(options.opportunity, url);
  } else {
    text = generateShareMessage(options.opportunityTitle, options.description);
  }

  return shareOpportunity({
    title: options.opportunityTitle,
    text: text,
    url: url,
  });
};

/**
 * Get share method that will be used
 */
export const getShareMethod = (): 'native' | 'clipboard' => {
  return isShareAPIAvailable() ? 'native' : 'clipboard';
};
