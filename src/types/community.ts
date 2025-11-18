/**
 * Community Interaction Types
 * Separate data models for upvotes, comments, and community engagement
 * These are intentionally separate from the core Opportunity schema
 */

/**
 * Represents a single upvote/like on an opportunity
 */
export interface Upvote {
  userId: string;
  opportunityId: string;
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Aggregated upvote data for an opportunity
 */
export interface UpvoteStats {
  opportunityId: string;
  totalCount: number;
  userHasUpvoted: boolean; // Only populated when fetched for a specific user
}

/**
 * Response when creating/deleting an upvote
 */
export interface UpvoteResponse {
  success: boolean;
  upvoteStats: UpvoteStats;
  message?: string;
}

/**
 * Represents a comment or question on an opportunity
 */
export interface Comment {
  id: string;
  opportunityId: string;
  userId: string;
  userEmail: string;
  userName: string;
  content: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt?: string; // ISO 8601 timestamp
  isOfficial?: boolean; // Indicates if this is an official response from organizer
  officialReplyTo?: string; // If this is an official reply, reference the original comment ID
  isDeleted?: boolean; // Soft delete for comments
}

/**
 * Query parameters for fetching comments
 */
export interface CommentQueryParams {
  opportunityId: string;
  limit?: number;
  offset?: number;
  sortBy?: 'recent' | 'oldest';
}

/**
 * Response when fetching comments
 */
export interface CommentListResponse {
  comments: Comment[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Request body for creating a comment
 */
export interface CreateCommentRequest {
  opportunityId: string;
  content: string;
}

/**
 * Response when creating a comment
 */
export interface CommentResponse {
  success: boolean;
  comment?: Comment;
  message?: string;
}

/**
 * Request body for updating a comment (official response)
 */
export interface UpdateCommentRequest {
  isOfficial?: boolean;
  officialReplyTo?: string;
}

/**
 * Share metadata for an opportunity
 */
export interface ShareMetadata {
  opportunityId: string;
  opportunityTitle: string;
  url: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Share options for device share
 */
export interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
}

/**
 * Community stats aggregated for display
 */
export interface CommunityCounts {
  opportunityId: string;
  upvotes: number;
  comments: number;
  timestamp?: string; // ISO 8601 timestamp for last update
}

/**
 * Full community context for an opportunity
 */
export interface CommunityContext {
  opportunityId: string;
  upvoteStats: UpvoteStats;
  comments: Comment[];
  counts: CommunityCounts;
}
