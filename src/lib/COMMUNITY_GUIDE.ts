/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMMUNITY INTERACTION SYSTEM - IMPLEMENTATION GUIDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This guide covers the complete Community Interaction System implementation,
 * which adds upvotes, comments, and sharing capabilities to opportunities
 * without modifying existing schemas or features.
 *
 * Last Updated: November 18, 2025
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 1. OVERVIEW
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * The Community Interaction System provides:
 *
 * ✓ Upvotes/Likes
 *   - Users can like/unlike opportunities
 *   - Real-time count updates
 *   - Individual user tracking
 *
 * ✓ Comments/Q&A
 *   - Users can post questions and discussions
 *   - Pagination support (20+ comments)
 *   - Soft delete for data integrity
 *   - Optional official responses
 *
 * ✓ Sharing
 *   - Native device sharing (when available)
 *   - Fallback to copy-to-clipboard
 *   - Social sharing URLs (optional)
 *
 * Key Design Principles:
 * • Completely separate from core Opportunity schema
 * • Uses independent Firebase collections
 * • Authentication required for user actions
 * • Read operations are public
 * • All writes are authenticated and validated
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 2. FIREBASE SCHEMA
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * The system uses three main collections:
 *
 * A. communityUpvotes
 *    └─ {docId}
 *       ├─ userId: string (who upvoted)
 *       ├─ opportunityId: string (which opportunity)
 *       └─ createdAt: timestamp
 *
 * B. communityComments
 *    └─ {commentId}
 *       ├─ id: string (comment ID)
 *       ├─ opportunityId: string
 *       ├─ userId: string
 *       ├─ userEmail: string
 *       ├─ userName: string
 *       ├─ content: string (max 5000 chars)
 *       ├─ createdAt: timestamp
 *       ├─ updatedAt: timestamp
 *       ├─ isOfficial: boolean (official response flag)
 *       ├─ officialReplyTo: string (optional parent comment ID)
 *       └─ isDeleted: boolean (soft delete)
 *
 * Indexes recommended:
 * • communityUpvotes: (userId, opportunityId)
 * • communityUpvotes: (opportunityId)
 * • communityComments: (opportunityId, isDeleted)
 * • communityComments: (opportunityId, createdAt)
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 3. TYPE DEFINITIONS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Location: src/types/community.ts
 *
 * Main Types:
 * • Upvote - Single upvote record
 * • UpvoteStats - Aggregated upvote data with user status
 * • Comment - Single comment with metadata
 * • CommentListResponse - Paginated comment results
 * • CommunityCounts - Aggregated engagement stats
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 4. FIREBASE SERVICE LAYER
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Location: src/lib/communityService.ts
 *
 * Core Functions:
 *
 * Authentication:
 *   verifyUserAuth(token, expectedUid?) → Promise<{uid, email}>
 *
 * Upvotes:
 *   getUpvoteStats(opportunityId, userId?) → Promise<UpvoteStats>
 *   getUpvoteCount(opportunityId) → Promise<number>
 *   addUpvote(userId, opportunityId) → Promise<UpvoteStats>
 *   removeUpvote(userId, opportunityId) → Promise<UpvoteStats>
 *   getUserUpvoteStatus(userId, opportunityId) → Promise<boolean>
 *
 * Comments:
 *   createComment(userId, email, name, opportunityId, content) → Promise<Comment>
 *   getComments(opportunityId, limit, offset, sortBy) → Promise<CommentListResponse>
 *   getCommentById(commentId) → Promise<Comment | null>
 *   updateComment(commentId, updates, userId) → Promise<Comment>
 *   deleteComment(commentId, userId) → void
 *
 * Aggregate:
 *   getCommunityCounts(opportunityId) → Promise<CommunityCounts>
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 5. API ENDPOINTS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * UPVOTES:
 *
 * GET /api/community/upvotes
 *   Query: ?opportunityId=X&userId=Y (optional)
 *   Returns: UpvoteStats
 *   Auth: Optional (userId for personalization)
 *
 * POST /api/community/upvotes/toggle
 *   Body: { opportunityId, action: 'upvote'|'remove' }
 *   Returns: { success, upvoteStats, message }
 *   Auth: Required (Bearer token)
 *
 * COMMENTS:
 *
 * GET /api/community/comments
 *   Query: ?opportunityId=X&limit=20&offset=0&sortBy=recent
 *   Returns: CommentListResponse
 *   Auth: Optional
 *
 * POST /api/community/comments
 *   Body: { opportunityId, content, userName }
 *   Returns: { success, comment }
 *   Auth: Required (Bearer token)
 *
 * PUT /api/community/comments/[id]
 *   Body: { content?, isOfficial?, officialReplyTo? }
 *   Returns: { success, comment }
 *   Auth: Required (owner or admin)
 *
 * DELETE /api/community/comments/[id]
 *   Returns: { success, message }
 *   Auth: Required (owner only)
 *
 * STATS:
 *
 * GET /api/community/counts
 *   Query: ?opportunityId=X
 *   Returns: CommunityCounts
 *   Auth: Optional
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 6. CUSTOM HOOKS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * useUpvotes(opportunityId, pollInterval?)
 *   Location: src/hooks/use-upvotes.ts
 *   Returns: {
 *     stats,                    // UpvoteStats | null
 *     loading,                  // boolean
 *     error,                    // string | null
 *     isToggling,              // boolean
 *     upvote(),                // async () => boolean
 *     removeUpvote(),          // async () => boolean
 *     refetch()                // async () => void
 *   }
 *   Features:
 *   • Automatic polling at specified interval
 *   • Authentication aware
 *   • Error handling
 *   • User upvote status tracking
 *
 * useComments(opportunityId, options?)
 *   Location: src/hooks/use-comments.ts
 *   Options: { limit, initialOffset, sortBy, autoFetch }
 *   Returns: {
 *     comments,                // Comment[]
 *     total,                   // number
 *     loading,                 // boolean
 *     error,                   // string | null
 *     isSubmitting,            // boolean
 *     postComment(content, userName),    // async () => Comment | null
 *     updateCommentById(id, updates),    // async () => Comment | null
 *     deleteCommentById(id),             // async () => boolean
 *     nextPage(),              // () => void
 *     previousPage(),          // () => void
 *     goToPage(n),             // (pageNumber) => void
 *     hasNextPage,             // boolean
 *     hasPreviousPage,         // boolean
 *     currentPage,             // number
 *     totalPages,              // number
 *     refetch()                // async () => void
 *   }
 *   Features:
 *   • Full pagination support
 *   • Sorting (recent/oldest)
 *   • Create/update/delete operations
 *   • Real-time count updates
 *
 * useCommunityCounts(opportunityId, pollInterval?)
 *   Location: src/hooks/use-community-counts.ts
 *   Returns: {
 *     counts,          // CommunityCounts | null
 *     loading,         // boolean
 *     error,           // string | null
 *     refetch()        // async () => void
 *   }
 *   Features:
 *   • Aggregated engagement metrics
 *   • Optional polling
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 7. UI COMPONENTS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Location: src/components/community/
 *
 * UpvoteButton
 *   Props: {
 *     opportunityId: string,
 *     showCount?: boolean,
 *     className?: string,
 *     onUpvoteChange?: (isUpvoted, count) => void
 *   }
 *   Features:
 *   • Heart icon (filled when upvoted)
 *   • Count display
 *   • Loading states
 *   • Auth modal on click if not logged in
 *   • Animation feedback
 *
 * ShareButton
 *   Props: {
 *     opportunityId: string,
 *     opportunityTitle: string,
 *     opportunitySlug?: string,
 *     description?: string,
 *     baseUrl?: string,
 *     showLabel?: boolean,
 *     className?: string,
 *     onShare?: (method) => void
 *   }
 *   Features:
 *   • Native share API support
 *   • Clipboard fallback
 *   • Success feedback
 *   • Social sharing metadata
 *
 * CommentForm
 *   Props: {
 *     opportunityId: string,
 *     onCommentPosted?: () => void,
 *     placeholder?: string,
 *     className?: string
 *   }
 *   Features:
 *   • Expandable textarea
 *   • Character limit (5000)
 *   • Auth modal integration
 *   • Error handling
 *   • Submit/cancel actions
 *
 * CommentItem
 *   Props: {
 *     comment: Comment,
 *     onDelete?: (id) => void,
 *     onReply?: (id) => void,
 *     isDeleting?: boolean,
 *     className?: string
 *   }
 *   Features:
 *   • User avatar
 *   • Relative timestamps
 *   • Official response badge
 *   • Delete/reply actions
 *   • Deleted state handling
 *
 * CommentSection
 *   Props: {
 *     opportunityId: string,
 *     limit?: number,
 *     showForm?: boolean,
 *     className?: string
 *   }
 *   Features:
 *   • Full comment management
 *   • Pagination
 *   • Empty state
 *   • Delete confirmation
 *   • Error handling
 *
 * CommunitySidebar
 *   Props: {
 *     opportunityId: string,
 *     opportunityTitle: string,
 *     opportunitySlug?: string,
 *     className?: string
 *   }
 *   Features:
 *   • Stats display
 *   • Quick upvote/share buttons
 *   • Engagement metrics
 *   • Live polling (30s interval)
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 8. SHARE UTILITY
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Location: src/lib/shareUtil.ts
 *
 * Functions:
 *   getShareMethod() → 'native' | 'clipboard'
 *   shareOpportunity(options) → Promise<boolean>
 *   shareOpportunityWithMetadata(metadata) → Promise<boolean>
 *   copyToClipboard(text) → Promise<boolean>
 *   generateShareUrl(baseUrl, id, slug?) → string
 *   generateShareMessage(title, description?) → string
 *   generateFacebookShareUrl(url) → string
 *   generateTwitterShareUrl(url, text) → string
 *   generateWhatsAppShareUrl(url, text) → string
 *   isSharingAvailable() → boolean
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 9. USAGE EXAMPLES
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * EXAMPLE 1: Display Upvote Button
 *
 *   import { UpvoteButton } from '@/components/community';
 *
 *   export const OpportunityCard = ({ opportunityId }) => (
 *     <div>
 *       <h2>Opportunity Title</h2>
 *       <UpvoteButton 
 *         opportunityId={opportunityId}
 *         showCount={true}
 *       />
 *     </div>
 *   );
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXAMPLE 2: Display Comments Section
 *
 *   import { CommentSection } from '@/components/community';
 *
 *   export const OpportunityDetail = ({ opportunityId }) => (
 *     <div>
 *       <h2>Opportunity Details</h2>
 *       <CommentSection 
 *         opportunityId={opportunityId}
 *         limit={10}
 *         showForm={true}
 *       />
 *     </div>
 *   );
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXAMPLE 3: Use useUpvotes Hook
 *
 *   import { useUpvotes } from '@/hooks/use-upvotes';
 *
 *   export const CustomUpvoteDisplay = ({ opportunityId }) => {
 *     const { stats, upvote, removeUpvote, isToggling } = 
 *       useUpvotes(opportunityId);
 *
 *     if (!stats) return <div>Loading...</div>;
 *
 *     return (
 *       <button onClick={stats.userHasUpvoted ? removeUpvote : upvote}>
 *         {stats.totalCount} likes
 *       </button>
 *     );
 *   };
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXAMPLE 4: Community Sidebar
 *
 *   import { CommunitySidebar } from '@/components/community';
 *
 *   export const OpportunityPage = ({ id, slug, title }) => (
 *     <div className="grid grid-cols-3 gap-4">
 *       <div className="col-span-2">
 *         Main content
 *       </div>
 *       <CommunitySidebar
 *         opportunityId={id}
 *         opportunityTitle={title}
 *         opportunitySlug={slug}
 *       />
 *     </div>
 *   );
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXAMPLE 5: Manual Comments Fetch
 *
 *   import { useComments } from '@/hooks/use-comments';
 *
 *   export const CommentStats = ({ opportunityId }) => {
 *     const { comments, total, nextPage, hasNextPage } = 
 *       useComments(opportunityId, { limit: 5 });
 *
 *     return (
 *       <div>
 *         <p>{total} total comments</p>
 *         <ul>
 *           {comments.map(c => <li key={c.id}>{c.content}</li>)}
 *         </ul>
 *         {hasNextPage && <button onClick={nextPage}>Load More</button>}
 *       </div>
 *     );
 *   };
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 10. AUTHENTICATION & SECURITY
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * All write operations require authentication:
 *
 * 1. Client sends ID token via "Authorization: Bearer <token>" header
 * 2. Server verifies token using Firebase Admin SDK
 * 3. User UID extracted and verified
 * 4. Operations validated against user ownership
 *
 * Security Rules (Firebase):
 * • Upvotes: Only user can create/delete their own
 * • Comments: User can delete only their own (soft delete)
 * • Admin can mark comments as official (future enhancement)
 *
 * Best Practices:
 * • Always verify token on backend
 * • Validate input length/content
 * • Implement rate limiting (recommended)
 * • Monitor for spam/abuse patterns
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 11. ERROR HANDLING
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * All hooks and components include error states:
 *
 * • Network errors → Display message in UI
 * • Auth errors → Redirect to login modal
 * • Validation errors → Display form errors
 * • Server errors → Fallback error messages
 *
 * Error Messages are user-friendly and actionable:
 * • "You must be logged in to upvote"
 * • "Failed to post comment - please try again"
 * • "Comment content exceeds maximum length"
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 12. PERFORMANCE CONSIDERATIONS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Upvotes:
 * • Direct count queries (very fast)
 * • Optional polling for real-time updates
 * • Efficient user status checks
 *
 * Comments:
 * • Pagination (default 20/page)
 * • Only fetches active comments
 * • Indexes on (opportunityId, isDeleted)
 *
 * Recommendations:
 * • Enable Firebase composite indexes
 * • Set appropriate cache headers
 * • Use pagination limits (max 100)
 * • Poll interval >= 5s for heavy traffic
 *
 * Firebase Indexes to Create:
 * 1. communityComments: (opportunityId, isDeleted) ASC, (createdAt) DESC
 * 2. communityUpvotes: (opportunityId) ASC
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 13. FUTURE ENHANCEMENTS
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Potential expansions:
 *
 * ✓ Comment threaded replies (officialReplyTo already in schema)
 * ✓ Comment voting/helpful flags
 * ✓ Notification system for comment replies
 * ✓ Admin moderation dashboard
 * ✓ Comment ratings by users
 * ✓ User reputation system
 * ✓ Spam/abuse reporting
 * ✓ Rich text editing (Markdown support)
 * ✓ Comment pinning
 * ✓ Advanced analytics
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 14. FILE STRUCTURE
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * Community System Files:
 *
 * src/types/community.ts
 *   └─ Type definitions for all community features
 *
 * src/lib/communityService.ts
 *   └─ Firebase backend service for community operations
 *
 * src/lib/shareUtil.ts
 *   └─ Sharing utilities (native + clipboard)
 *
 * src/hooks/use-upvotes.ts
 *   └─ Hook for upvote management
 *
 * src/hooks/use-comments.ts
 *   └─ Hook for comment management
 *
 * src/hooks/use-community-counts.ts
 *   └─ Hook for community stats
 *
 * src/components/community/
 *   ├─ UpvoteButton.tsx
 *   ├─ ShareButton.tsx
 *   ├─ CommentForm.tsx
 *   ├─ CommentItem.tsx
 *   ├─ CommentSection.tsx
 *   ├─ CommunitySidebar.tsx
 *   └─ index.ts
 *
 * src/app/api/community/
 *   ├─ upvotes/route.ts
 *   ├─ upvotes/toggle/route.ts
 *   ├─ comments/route.ts
 *   ├─ comments/[id]/route.ts
 *   └─ counts/route.ts
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────
 * │ 15. INTEGRATION CHECKLIST
 * └─────────────────────────────────────────────────────────────────────────────
 *
 * To integrate the Community System into existing pages:
 *
 * ☐ Import components from '@/components/community'
 * ☐ Add CommunitySidebar to opportunity detail pages
 * ☐ Add CommentSection to opportunity pages
 * ☐ Add UpvoteButton/ShareButton to opportunity cards
 * ☐ Ensure AuthProvider and AuthModalProvider wrap your app
 * ☐ Test all authentication flows
 * ☐ Test pagination and loading states
 * ☐ Create Firebase indexes (see section 12)
 * ☐ Set appropriate security rules
 * ☐ Monitor performance and adjust polling intervals
 *
 * Example: Add to opportunity detail page
 *
 *   import { CommunitySidebar, CommentSection } from '@/components/community';
 *
 *   export default function OpportunityPage({ params }) {
 *     const opportunity = fetchOpportunity(params.id);
 *
 *     return (
 *       <div className="grid grid-cols-3 gap-6">
 *         <div className="col-span-2">
 *           <h1>{opportunity.title}</h1>
 *           <p>{opportunity.description}</p>
 *         </div>
 *
 *         <aside>
 *           <CommunitySidebar
 *             opportunityId={opportunity.id}
 *             opportunityTitle={opportunity.title}
 *             opportunitySlug={opportunity.slug}
 *           />
 *         </aside>
 *       </div>
 *
 *       <section className="mt-8">
 *         <CommentSection opportunityId={opportunity.id} />
 *       </section>
 *     );
 *   }
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * END OF COMMUNITY SYSTEM GUIDE
 *
 * For questions or issues:
 * 1. Check the type definitions in src/types/community.ts
 * 2. Review API endpoints in src/app/api/community/
 * 3. Test components in isolation first
 * 4. Check browser console for detailed error messages
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const COMMUNITY_GUIDE = {
  version: '1.0.0',
  lastUpdated: '2025-11-18',
  status: 'production-ready',
};
