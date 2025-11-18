/**
 * Share Utility
 * Provides device-native sharing with fallback to copy-to-clipboard
 * Client-side utility for sharing opportunities
 */

import type { ShareOptions } from '@/types/community';

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
      // Use native share API when available
      await navigator.share(options);
      return true;
    } else {
      // Fallback to copy URL to clipboard
      const success = await copyToClipboard(options.url);
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
 * Generate a share URL for an opportunity
 */
export const generateShareUrl = (
  baseUrl: string,
  opportunityId: string,
  opportunitySlug?: string,
): string => {
  const pathname = opportunitySlug
    ? `/opportunity/${opportunitySlug}`
    : `/opportunity/${opportunityId}`;

  const url = new URL(pathname, baseUrl);
  url.searchParams.set('shared', 'true');

  return url.toString();
};

/**
 * Generate a shareable message for an opportunity
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
  analyticsCallback?: (method: 'native' | 'clipboard') => void;
}): Promise<boolean> => {
  const {
    opportunityId,
    opportunityTitle,
    opportunitySlug,
    description,
    baseUrl,
    analyticsCallback,
  } = options;

  const url = generateShareUrl(baseUrl, opportunityId, opportunitySlug);
  const text = generateShareMessage(opportunityTitle, description);
  const title = opportunityTitle;

  const shareMethod = isShareAPIAvailable() ? 'native' : 'clipboard';
  analyticsCallback?.(shareMethod);

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
