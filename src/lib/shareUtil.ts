/**
 * Share Utility
 * Provides device-native sharing with fallback to copy-to-clipboard
 * Client-side utility for sharing opportunities
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
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
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
 * Share an opportunity using native share or copy to clipboard
 * Returns true if sharing was successful
 */
export const shareOpportunity = async (options: ShareOptions): Promise<boolean> => {
  try {
    if (isShareAPIAvailable()) {
      // For native share API, combine text and URL to ensure apps like WhatsApp get the full message
      // Some apps ignore the separate 'url' parameter and only use 'text'
      const shareData: ShareData = {
        title: options.title,
        text: options.text, // The text already includes the URL at the end
      };

      await navigator.share(shareData);
      return true;
    } else {
      // Fallback to copy full message to clipboard
      const fullMessage = options.text ?? options.url;
      const success = await copyToClipboard(fullMessage);
      return success;
    }
  } catch (error) {
    // User cancelled share or error occurred
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled, this is not an error
      return false;
    }
    console.error('Share failed', error);
    return false;
  }
};

/**
 * Generate a unique share tracking code
 * Format: usr_{userId}_{timestamp} for authenticated users
 *         anon_{timestamp}_{random} for anonymous users
 */
export const generateShareCode = (userId?: string): string => {
  const timestamp = Date.now().toString(36); // Base36 for shorter string
  const random = Math.random().toString(36).substring(2, 8); // Random string

  if (userId) {
    // Authenticated: usr_abc123_xyz789
    const userHash = userId.substring(0, 8);
    return `usr_${userHash}_${timestamp}${random}`;
  } else {
    // Anonymous: anon_xyz789_abc123
    return `anon_${timestamp}${random}`;
  }
};

/**
 * Generate a share URL for an opportunity with optional tracking code
 */
export const generateShareUrl = (
  baseUrl: string,
  opportunityId: string,
  opportunitySlug?: string,
  shareCode?: string,
): string => {
  const pathname = opportunitySlug
    ? `/opportunity/${opportunitySlug}`
    : `/opportunity/${opportunityId}`;

  const url = new URL(pathname, baseUrl);

  // Add tracking code if provided, otherwise use legacy parameter
  if (shareCode) {
    url.searchParams.set('ref', shareCode);
  } else {
    url.searchParams.set('shared', 'true');
  }

  return url.toString();
};

/**
 * Record a share event via API and get tracking code
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
    const platform = typeof window !== 'undefined' && window.innerWidth < 768
      ? 'mobile'
      : 'desktop';

    const response = await fetch('/api/shares/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        platform,
      }),
    });

    if (!response.ok) {
      console.error('Failed to record share');
      return null;
    }

    const data = await response.json();
    return data.shareCode;
  } catch (error) {
    console.error('Error recording share:', error);
    return null;
  }
};

/**
 * Generate an engaging, student-friendly share message for WhatsApp
 */
export const generateEngagingShareMessage = (
  opportunity: Opportunity,
  shareUrl: string,
): string => {
  const lines: string[] = [];

  // Header with excitement
  lines.push(`🎯 *${opportunity.title}*`);
  lines.push('');

  // Short Description
  if (opportunity.description) {
    // Strip HTML tags and normalize whitespace
    const cleanDesc = opportunity.description
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    const shortDesc = cleanDesc.length > 150
      ? cleanDesc.substring(0, 150) + '...'
      : cleanDesc;
    lines.push(`📝 ${shortDesc}`);
    lines.push('');
  }

  // Registration Deadline
  if (opportunity.registrationDeadline) {
    const deadline = opportunity.registrationDeadlineTBD
      ? 'To Be Announced'
      : new Date(opportunity.registrationDeadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    lines.push(`⏰ *Deadline:* ${deadline}`);
  }

  // Eligibility
  const eligibility = opportunity.ageEligibility
    ? opportunity.ageEligibility
    : opportunity.gradeEligibility || 'Open to All';
  lines.push(`👥 *Eligibility:* ${eligibility}`);

  // Fee
  const fee = opportunity.fee && opportunity.fee !== '0'
    ? `${opportunity.currency || '₹'}${opportunity.fee}`
    : 'FREE';
  lines.push(`💰 *Fee:* ${fee}`);
  lines.push('');

  // Key Benefits (top 3-5)
  if (opportunity.benefits && opportunity.benefits.length > 0) {
    lines.push(`✨ *Benefits:*`);
    const topBenefits = opportunity.benefits.slice(0, 5);
    topBenefits.forEach(benefit => {
      lines.push(`  • ${benefit}`);
    });
    lines.push('');
  }

  // Application Link
  lines.push(`🔗 *Apply Now:*`);
  lines.push(shareUrl);
  lines.push('');

  // Call to Action
  lines.push('━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(`📚 *Follow Myark for more verified opportunities!*`);
  lines.push('Get daily updates on scholarships, olympiads, competitions, internships & workshops!');
  lines.push('');

  // Social Media Links
  lines.push('🌐 *Connect with us:*');
  lines.push('Instagram: https://www.instagram.com/getmyark/');
  lines.push('LinkedIn: https://www.linkedin.com/company/getmyark');
  lines.push('Facebook: https://www.facebook.com/getmyark');
  lines.push('WhatsApp Channel: https://whatsapp.com/channel/0029VbBdZ5O545uvzvZf5V1A');
  lines.push('');

  // Motivational Quote
  lines.push('━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(getRandomQuote());

  return lines.join('\n');
};

/**
 * Generate a shareable message for an opportunity (simple version)
 */
export const generateShareMessage = (
  opportunityTitle: string,
  description?: string,
): string => {
  let message = `Check out this opportunity: ${opportunityTitle}`;

  if (description) {
    message += `\n\n${description}`;
  }

  return message;
};

/**
 * Share an opportunity with all available metadata
 * This is a convenience wrapper that handles all the details
 */
export const shareOpportunityWithMetadata = async (options: {
  opportunityId: string;
  opportunityTitle: string;
  opportunitySlug?: string;
  description?: string;
  baseUrl: string;
  opportunity?: Opportunity;
  userId?: string;
  userEmail?: string;
  userName?: string;
  analyticsCallback?: (method: 'native' | 'clipboard') => void;
}): Promise<boolean> => {
  const {
    opportunityId,
    opportunityTitle,
    opportunitySlug,
    description,
    baseUrl,
    opportunity,
    userId,
    userEmail,
    userName,
    analyticsCallback,
  } = options;

  const shareMethod = isShareAPIAvailable() ? 'native' : 'clipboard';

  // Record the share event and get tracking code
  const shareCode = await recordShare({
    opportunityId,
    opportunityTitle,
    opportunitySlug,
    shareMethod,
    userId,
    userEmail,
    userName,
  });

  // Generate URL with tracking code
  const url = generateShareUrl(baseUrl, opportunityId, opportunitySlug, shareCode || undefined);

  // Use engaging message if full opportunity data is available
  const text = opportunity
    ? generateEngagingShareMessage(opportunity, url)
    : generateShareMessage(opportunityTitle, description);
  const title = opportunityTitle;

  analyticsCallback?.(shareMethod);

  // Pass the formatted text which already includes the URL
  // URL parameter is kept for ShareOptions interface compatibility
  return shareOpportunity({
    title,
    text,
    url,
  });
};

/**
 * Get share method that will be used
 * Useful for showing user feedback about what will happen
 */
export const getShareMethod = (): 'native' | 'clipboard' => {
  return isShareAPIAvailable() ? 'native' : 'clipboard';
};

/**
 * Generate a Facebook share URL (for platforms that don't support Web Share API)
 */
export const generateFacebookShareUrl = (opportunityUrl: string): string => {
  const baseUrl = 'https://www.facebook.com/sharer/sharer.php';
  const url = new URL(baseUrl);
  url.searchParams.set('u', opportunityUrl);
  return url.toString();
};

/**
 * Generate a Twitter share URL (for platforms that don't support Web Share API)
 */
export const generateTwitterShareUrl = (
  opportunityUrl: string,
  text: string,
): string => {
  const baseUrl = 'https://twitter.com/intent/tweet';
  const url = new URL(baseUrl);
  url.searchParams.set('url', opportunityUrl);
  url.searchParams.set('text', text);
  return url.toString();
};

/**
 * Generate a WhatsApp share URL
 */
export const generateWhatsAppShareUrl = (
  opportunityUrl: string,
  text: string,
): string => {
  const message = `${text}\n${opportunityUrl}`;
  const baseUrl = 'https://wa.me/';
  const url = new URL(baseUrl);
  url.searchParams.set('text', message);
  return url.toString();
};
