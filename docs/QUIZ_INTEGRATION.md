# Quiz Integration Guide

## Admin Panel Access

### 1. Creating a Quiz

**Navigation Path:**
```
Admin Panel → Quizzes → Create Quiz
```

**Or directly:**
```
/admin/opportunities/create-quiz
```

### 2. Managing Quizzes

**Navigation Path:**
```
Admin Panel → Quizzes
```

**Or directly:**
```
/admin/opportunities/quizzes
```

This page shows:
- List of all quizzes (published and drafts)
- Quick stats (questions, duration, views, submissions)
- Actions: View quiz, View leaderboard
- Create Quiz button

## Frontend Access for Students

### 1. Quizzes Listing Page

**URL:** `/quizzes`

Shows all published quizzes in a beautiful card grid layout with:
- Quiz thumbnails
- Title and description
- Stats (questions, duration, attempts)
- Direct link to start quiz

### 2. Individual Quiz Pages

**Quiz Detail:** `/quiz/{id}`
- Shows quiz information
- Important dates
- Settings and rules
- "Start Quiz" button

**Quiz Attempt:** `/quiz/{id}/attempt`
- Interactive quiz interface
- Timer and navigation
- Submit quiz

**Quiz Results:** `/quiz/{id}/result`
- Score and performance
- Rank (if available)
- Link to leaderboard

**Leaderboard:** `/quiz/{id}/leaderboard`
- Top 3 podium
- Full rankings
- Visibility controlled by admin settings

## Integration Options

### Option 1: Add to Main Navigation

Edit your main header component to add a "Quizzes" link:

```tsx
// In src/components/Header.tsx (or similar)
<Link href="/quizzes">Quizzes</Link>
```

### Option 2: Add to Home Page

Add a quizzes section to your home page:

```tsx
// In src/app/page.tsx or home component
import Link from 'next/link';

export function QuizzesSection() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8">Test Your Knowledge</h2>
      <Link 
        href="/quizzes"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Browse Quizzes →
      </Link>
    </section>
  );
}
```

### Option 3: Integrate with Opportunities

If you want quizzes to show alongside regular opportunities, you can:

1. **Fetch both** in your opportunities page:
```tsx
// Fetch regular opportunities
const opportunities = await getOpportunities();

// Fetch quizzes
const quizzes = await getQuizzes();

// Combine and display
const allItems = [
  ...opportunities.map(o => ({ ...o, itemType: 'opportunity' })),
  ...quizzes.map(q => ({ ...q, itemType: 'quiz', href: `/quiz/${q.id}` }))
];
```

2. **Add type filter:**
```tsx
// In opportunities page
<select onChange={handleFilterChange}>
  <option value="all">All Opportunities</option>
  <option value="regular">Regular Opportunities</option>
  <option value="quiz">Quizzes</option>
</select>
```

## Quick Start Example

### Add Quizzes to Homepage

```tsx
// src/app/page.tsx
import Link from 'next/link';
import { getDb } from '@/lib/firebaseAdmin';

async function getFeaturedQuizzes() {
  const db = getDb();
  const snapshot = await db
    .collection('quizzes')
    .where('visibility', '==', 'published')
    .orderBy('views', 'desc')
    .limit(3)
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function HomePage() {
  const featuredQuizzes = await getFeaturedQuizzes();
  
  return (
    <div>
      {/* Your existing homepage content */}
      
      {/* Featured Quizzes Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            📝 Featured Quizzes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz: any) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📝 {quiz.quizConfig?.totalQuestions || 0} Questions</span>
                  <span>⏱️ {quiz.quizConfig?.settings?.totalDuration || 0} min</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              View All Quizzes →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Summary

**Admin Access:**
- Click "Quizzes" in admin sidebar
- Click "Create Quiz" button
- Fill in 4 steps and publish

**Student Access:**
- Visit `/quizzes` to browse all quizzes
- Click any quiz card to view details
- Click "Start Quiz" to attempt
- View results and leaderboard after submission

The system is now fully integrated and accessible from both admin and frontend!
