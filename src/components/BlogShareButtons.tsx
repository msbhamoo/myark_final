'use client';

import React, { useState, useEffect } from 'react';
import { Languages, MessageCircle, Copy, Check, Facebook, Linkedin, Share2 } from 'lucide-react';

/**
 * Pool of motivational quotes for blog sharing
 */
const BLOG_QUOTES = [
  "📚 Knowledge shared is knowledge multiplied. Pass it on!",
  "🌟 Sharing knowledge is the seed of success. Plant it today!",
  "💡 Great minds discuss ideas. Share this with fellow learners!",
  "🚀 Learning never exhausts the mind. Keep exploring!",
  "✨ Education is the most powerful weapon. Spread knowledge!",
  "🎯 Today a reader, tomorrow a leader. Share the wisdom!",
  "💪 The more you share, the more you learn. Keep sharing!",
  "🌈 Knowledge grows when shared. Pass it forward!",
];

/**
 * Get a random motivational quote for blog sharing
 */
const getRandomBlogQuote = (): string => {
  return BLOG_QUOTES[Math.floor(Math.random() * BLOG_QUOTES.length)];
};

interface BlogShareData {
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  coverImage?: string;
}

interface ShareButtonsProps {
  slug: string;
  title: string;
  blog?: BlogShareData;
}

/**
 * Generate an engaging share message for blogs (similar to opportunities)
 */
function generateBlogShareMessage(blog: BlogShareData, shareUrl: string): string {
  const lines: string[] = [];

  // Header with excitement
  lines.push(`📖 *${blog.title}*`);
  lines.push('');

  // Short Excerpt/Description
  if (blog.excerpt) {
    const cleanExcerpt = blog.excerpt
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
    const shortExcerpt = cleanExcerpt.length > 150
      ? cleanExcerpt.substring(0, 150) + '...'
      : cleanExcerpt;
    lines.push(`📝 ${shortExcerpt}`);
    lines.push('');
  }

  // Author
  if (blog.author) {
    lines.push(`✍️ *Author:* ${blog.author}`);
  }

  // Published Date
  if (blog.publishedAt) {
    const publishDate = new Date(blog.publishedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    lines.push(`📅 *Published:* ${publishDate}`);
  }

  // Tags
  if (blog.tags && blog.tags.length > 0) {
    const tagString = blog.tags.slice(0, 3).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
    lines.push(`🏷️ ${tagString}`);
  }

  lines.push('');

  // Read Link
  lines.push(`🔗 *Read Full Article:*`);
  lines.push(shareUrl);
  lines.push('');

  // Call to Action
  lines.push('━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(`📚 *Follow Myark Blog for more insights!*`);
  lines.push('Get daily updates on scholarships, olympiads, competitions & student success stories!');
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
  lines.push(getRandomBlogQuote());

  return lines.join('\n');
}

/**
 * Generate a simple share message for blogs
 */
function generateSimpleBlogMessage(title: string): string {
  return `📖 Check out this article: ${title}`;
}

export function ShareButtons({ slug, title, blog }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  async function share(network: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'other') {
    try {
      await fetch(`/api/blogs/${slug}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network })
      });

      const url = typeof window !== 'undefined' ? window.location.href : '';
      const shareUrl = encodeURIComponent(url);

      // Generate engaging message for WhatsApp
      const engagingMessage = blog
        ? generateBlogShareMessage(blog, url)
        : generateSimpleBlogMessage(title);

      const simpleText = encodeURIComponent(title);
      const whatsappText = encodeURIComponent(engagingMessage);

      const map: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${simpleText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${whatsappText}`,
        other: url,
      };
      window.open(map[network], '_blank');
    } catch { }
  }

  async function copyLink() {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';

      // Copy engaging message along with URL
      const message = blog
        ? generateBlogShareMessage(blog, url)
        : `📖 ${title}\n\n${url}`;

      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* WhatsApp Share - Primary Button with beautiful gradient */}
      <button
        onClick={() => share('whatsapp')}
        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Share on WhatsApp</span>
      </button>

      {/* Other Social Buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => share('facebook')}
          className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white border border-blue-500/20 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </button>
        <button
          onClick={() => share('twitter')}
          className="p-2.5 rounded-xl bg-slate-500/10 hover:bg-slate-800 text-slate-600 hover:text-white border border-slate-500/20 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25 dark:hover:bg-white dark:hover:text-slate-900"
          title="Share on X (Twitter)"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={() => share('linkedin')}
          className="p-2.5 rounded-xl bg-blue-700/10 hover:bg-blue-700 text-blue-700 hover:text-white border border-blue-700/20 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/25"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
      </div>

      {/* Copy Link Button */}
      <button
        onClick={copyLink}
        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all duration-300"
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>

      {/* Mobile Share Menu */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="sm:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all duration-300"
        title="More share options"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* Mobile Dropdown */}
      {showShareMenu && (
        <div className="sm:hidden absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 min-w-[160px]">
          <button
            onClick={() => { share('facebook'); setShowShareMenu(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm transition-colors"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </button>
          <button
            onClick={() => { share('twitter'); setShowShareMenu(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </button>
          <button
            onClick={() => { share('linkedin'); setShowShareMenu(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm transition-colors"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            LinkedIn
          </button>
        </div>
      )}
    </div>
  );
}

// Translate button component for Hindi translation
export function TranslateToHindiButton() {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load Google Translate script on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already translated (from cookie)
    const googtrans = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (googtrans && googtrans.includes('/hi')) {
      setIsTranslated(true);
    }

    // Define the callback before loading the script
    (window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,en',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    // Load Google Translate script
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Add styles to hide Google branding
    const style = document.createElement('style');
    style.id = 'google-translate-styles';
    style.textContent = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-menu-frame {
        display: none !important;
      }
      body { top: 0 !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      #google_translate_element { position: absolute; left: -9999px; }
    `;
    if (!document.getElementById('google-translate-styles')) {
      document.head.appendChild(style);
    }
  }, []);

  const translateToHindi = () => {
    setIsLoading(true);

    try {
      if (isTranslated) {
        // Reset to English - clear the translation cookie and reload
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
        window.location.reload();
      } else {
        // Trigger Hindi translation 
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = 'hi';
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          setIsTranslated(true);
          setIsLoading(false);
        } else {
          // Fallback: Set cookie and reload
          document.cookie = 'googtrans=/en/hi; path=/';
          document.cookie = 'googtrans=/en/hi; path=/; domain=' + window.location.hostname;
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" />

      {/* Custom styled button */}
      <button
        onClick={translateToHindi}
        disabled={isLoading}
        className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isTranslated
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25 hover:shadow-green-500/40 text-white'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25 hover:shadow-orange-500/40 text-white'
          }`}
        title={isTranslated ? "Show original (English)" : "Read in Hindi (हिंदी में पढ़ें)"}
      >
        <Languages className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isTranslated ? 'Show Original' : 'हिंदी में पढ़ें'}</span>
        <span className="text-xs opacity-80">{isTranslated ? '(English)' : '(Hindi)'}</span>
      </button>
    </>
  );
}
