'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { shareOpportunityWithMetadata, getShareMethod } from '@/lib/shareUtil';
import { Career } from '@/constants/careers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CareerShareButtonProps {
    career: Career;
    className?: string;
}

export function CareerShareButton({ career, className }: CareerShareButtonProps) {
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const shareMethod = getShareMethod();
            const success = await shareOpportunityWithMetadata({
                opportunityId: career.slug,
                opportunityTitle: career.title,
                opportunitySlug: career.slug,
                baseUrl: window.location.origin,
                opportunity: career as any,
                type: 'career'
            });

            if (success) {
                if (shareMethod === 'clipboard') {
                    setCopied(true);
                    toast.success('Link copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    toast.success('Shared successfully!');
                }
            }
        } catch (error) {
            console.error('Share failed', error);
            toast.error('Failed to share');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Button
            onClick={handleShare}
            disabled={isSharing}
            variant="ghost"
            size="sm"
            className={cn(
                "inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition dark:text-slate-400",
                className
            )}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4" />
                    {isSharing ? 'Sharing...' : 'Share'}
                </>
            )}
        </Button>
    );
}
