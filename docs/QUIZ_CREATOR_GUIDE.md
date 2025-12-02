# Quiz Creator System - Implementation Guide

## Overview

The Quiz Creator System is a comprehensive solution for creating, managing, and participating in quizzes with real-time leaderboards and advanced settings.

## Directory Structure

```
src/
├── types/
│   └── quiz.ts                          # TypeScript type definitions
├── app/
│   ├── admin/
│   │   └── opportunities/
│   │       └── create-quiz/
│   │           ├── page.tsx            # Main admin page
│   │           ├── actions.ts          # Server actions
│   │           ├── components/
│   │           │   └── StepIndicator.tsx
│   │           └── steps/
│   │               ├── BasicInfoStep.tsx
│   │               ├── QuizBuilderStep.tsx
│   │               ├── LeaderboardSettingsStep.tsx
│   │               └── PreviewStep.tsx
│   ├── api/
│   │   └── quiz/
│   │       └── [id]/
│   │           ├── route.ts            # GET quiz data
│   │           ├── submit/
│   │           │   └── route.ts        # POST quiz submission
│   │           └── leaderboard/
│   │               └── route.ts        # GET leaderboard
│   └── quiz/
│       └── [id]/
│           ├── page.tsx                # Quiz detail page
│           ├── attempt/
│           │   └── page.tsx            # Quiz attempt page
│           ├── result/
│           │   └── page.tsx            # Result page
│           └── leaderboard/
│               └── page.tsx            # Leaderboard page
└── components/
    └── quiz/
        ├── QuizAttemptInterface.tsx    # Quiz taking interface
        ├── QuizResultPage.tsx          # Result display
        └── QuizLeaderboard.tsx         # Leaderboard display
```

## Firestore Schema

### Collection: `quizzes`

```typescript
{
  type: 'quiz',
  title: string,
  slug: string,
  description: string,
  categoryId: string,
  thumbnailUrl?: string,
  
  createdAt: string (ISO),
  updatedAt: string (ISO),
  startDate: string (ISO),
  endDate: string (ISO),
  registrationDeadline?: string (ISO),
  publishedAt: string | null,
  
  eligibility: {
    ageRange?: { min: number, max: number },
    classes?: string[],
    locations?: { countries?: string[], states?: string[] }
  },
  
  attemptLimit: number,
  visibility: 'draft' | 'scheduled' | 'published',
  
  quizConfig: {
    questions: QuizQuestion[],
    settings: QuizSettings,
    leaderboardSettings: LeaderboardVisibilitySettings,
    totalMarks: number,
    totalQuestions: number
  },
  
  registrationCount: number,
  submissionCount: number,
  views: number
}
```

### Subcollection: `quizzes/{quizId}/attempts`

```typescript
{
  userId: string,
  userName: string,
  userEmail: string | null,
  quizId: string,
  attemptNumber: number,
  startedAt: string (ISO),
  submittedAt: string (ISO) | null,
  timeSpent: number (seconds),
  responses: QuizResponse[],
  score: number,
  maxScore: number,
  percentage: number,
  passed?: boolean,
  evaluated: boolean,
  evaluatedAt: string (ISO) | null
}
```

### Subcollection: `quizzes/{quizId}/leaderboard`

```typescript
{
  userId: string,
  userName: string,
  userAvatar?: string,
  score: number,
  maxScore: number,
  percentage: number,
  rank: number,
  timeTaken: number (seconds),
  submittedAt: string (ISO),
  attemptId: string
}
```

## Admin Usage

### Creating a Quiz

1. Navigate to `/admin/opportunities/create-quiz`
2. **Step 1 - Basic Info:**
   - Enter quiz title
   - Add description
   - Select category
   - Upload thumbnail (optional)
   - Set start/end dates
   - Configure attempt limits
   - Set age eligibility (optional)

3. **Step 2 - Quiz Builder:**
   - Click "Add Question" to create questions
   - For each question:
     - Enter question text
     - Select type (single-choice, multiple-choice, true-false)
     - Add options (minimum 2)
     - Mark correct answer(s)
     - Set marks and negative marks
     - Add explanation (optional)
     - Set difficulty (optional)
   - Configure quiz settings:
     - Total duration
     - Shuffle questions/options
     - Show instant results
     - Allow review before submit
     - Show explanations
     - Enable negative marking

4. **Step 3 - Leaderboard Settings:**
   - Choose visibility type:
     - **Instant**: Show immediately after submission
     - **Scheduled**: Show on specific date/time
     - **Delayed**: Show X hours after quiz ends
   - Toggle "Participants Only" for privacy

5. **Step 4 - Preview:**
   - Review all quiz details
   - Check validation errors
   - Click "Publish Quiz"

### Draft Management

- Click "Save Draft" at any step to save progress
- Drafts are auto-saved every 30 seconds
- Resume from where you left off

## User Flow

### 1. Viewing Quiz Details

URL: `/quiz/{quizId}`

- Displays quiz information
- Shows question count, marks, duration
- Lists important dates
- Shows quiz settings
- Provides "Start Quiz" button

### 2. Taking the Quiz

URL: `/quiz/{quizId}/attempt`

**Features:**
- Timer with auto-submit on timeout
- Question navigation palette
- Answer selection (radio/checkbox based on type)
- Mark questions for review
- Progress indicators:
  - Answered (green)
  - Marked for review (yellow)
  - Unanswered (gray)
- Review modal before submission

**User Actions:**
- Click options to select answers
- Click "Mark for Review" to flag questions
- Use "Previous"/"Next" to navigate
- Click question numbers for direct navigation
- Click "Submit Quiz" when ready

### 3. Viewing Results

URL: `/quiz/{quizId}/result?attemptId={attemptId}`

**Displays:**
- Overall percentage and score
- Pass/Fail status
- Statistics:
  - Correct answers
  - Incorrect answers
  - Unanswered questions
  - Time taken
- Rank and percentile (if available)
- Performance analysis bars
- Links to leaderboard and answer review

### 4. Viewing Leaderboard

URL: `/quiz/{quizId}/leaderboard`

**Features:**
- Top 3 podium display
- Full leaderboard table
- Current user highlighting
- Visibility controls based on settings
- Locked state with countdown if not yet visible

## API Endpoints

### GET `/api/quiz/{id}`

Fetch quiz data including questions, settings, and configuration.

**Response:**
```json
{
  "success": true,
  "quiz": { ...QuizOpportunity }
}
```

### POST `/api/quiz/{id}/submit`

Submit quiz attempt for evaluation.

**Request Body:**
```json
{
  "userId": "string",
  "userName": "string",
  "userEmail": "string",
  "responses": [
    {
      "questionId": "string",
      "selectedOptions": ["optionId1", "optionId2"],
      "markedForReview": false
    }
  ],
  "timeSpent": 300
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "attempt": { ...QuizAttempt },
    "correctAnswers": 8,
    "incorrectAnswers": 2,
    "unanswered": 0,
    "totalQuestions": 10,
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "passed": true,
    "timeTaken": 300
  }
}
```

### GET `/api/quiz/{id}/leaderboard`

Fetch quiz leaderboard with rankings.

**Response:**
```json
{
  "success": true,
  "leaderboard": [ ...LeaderboardEntry[] ],
  "totalParticipants": 42
}
```

## Leaderboard Visibility Types

### Instant
Leaderboard is visible immediately after each participant submits.

**Use Case:** Live competitions, quick quizzes

### Scheduled
Leaderboard becomes visible on a specific date/time.

**Configuration:**
```typescript
{
  type: 'scheduled',
  scheduledDate: '2024-12-25T10:00:00Z'
}
```

**Use Case:** Delayed announcement, scheduled results

### Delayed
Leaderboard becomes visible X hours after quiz end date.

**Configuration:**
```typescript
{
  type: 'delayed',
  delayHours: 24
}
```

**Use Case:** Fair competitions, time-zone considerations

## Scoring Logic

### Single Choice & True/False

- Correct answer: Full marks
- Incorrect answer: Negative marks (if enabled)
- Unanswered: 0 marks

### Multiple Choice

- All correct selected AND no incorrect selected: Full marks
- Any incorrect selected OR any correct not selected: Negative marks (if enabled)
- Unanswered: 0 marks

### Example

Question: 4 marks, -1 negative marking

- Correct answer: +4 marks
- Wrong answer: -1 mark
- No answer: 0 marks

## TODO Items

1. **Authentication Integration**
   - Replace mock user IDs with actual Firebase Auth
   - Implement session management
   - Add role-based access control

2. **User Profile Integration**
   - Fetch user avatar URLs
   - Get user profile slugs
   - Display user badges/achievements

3. **Result Fetching**
   - Implement actual Firestore query in result page
   - Cache results for performance

4. **Email Notifications**
   - Send quiz invitation emails
   - Send result emails
   - Send leaderboard announcement emails

5. **Analytics**
   - Track quiz performance metrics
   - Generate admin reports
   - Export data to CSV

6. **Advanced Features (Future)**
   - Image questions support
   - Question banks
   - Random question selection
   - Adaptive difficulty
   - Time per question limits
   - Offline mode support

## Testing

### Manual Testing Checklist

- [ ] Create quiz with all question types
- [ ] Test shuffle questions/options
- [ ] Verify timer auto-submit
- [ ] Test negative marking calculation
- [ ] Submit before time expires
- [ ] Check score calculation accuracy
- [ ] Verify leaderboard ranking
- [ ] Test all visibility types
- [ ] Test on mobile devices
- [ ] Verify dark mode support

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Performance Considerations

1. **Firestore Reads:**
   - Quiz data cached after first fetch
   - Leaderboard pagination for large lists
   - Batch operations for bulk updates

2. **Bundle Size:**
   - Components are lazy-loaded
   - Images optimized with Next.js Image
   - Code splitting by route

3. **Real-time Updates:**
   - Consider using Firestore listeners for live leaderboard
   - Debounce auto-save operations

## Security

1. **Server-side Validation:**
   - All quiz submissions validated on server
   - Score calculation done server-side
   - Prevent answer manipulation

2. **Access Control:**
   - Check quiz start/end dates before allowing attempts
   - Verify attempt limits
   - Validate user eligibility

3. **Data Privacy:**
   - Respect leaderboard privacy settings
   - Don't expose quiz answers before quiz ends
   - Secure user data

## Support

For issues or questions, contact the development team or refer to the main Myark documentation.
