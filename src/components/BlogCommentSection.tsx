'use client';

import { CommentSection } from '@/components/community/CommentSection';

interface BlogCommentSectionProps {
    blogId: string;
}

export function BlogCommentSection({ blogId }: BlogCommentSectionProps) {
    return <CommentSection entityId={blogId} entityType="blog" />;
}
