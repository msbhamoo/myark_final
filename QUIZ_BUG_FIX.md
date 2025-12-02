# Quiz Auto-Select Bug Fix

## Problem
Options in the quiz are auto-selecting or behaving strangely because they are being re-shuffled on every component render.

## Root Cause
In `QuizAttemptInterface.tsx`, around line 145-147, the options are shuffled like this:

```typescript
const displayOptions = settings.shuffleOptions
    ? [...(currentQuestion?.options || [])].sort(() => Math.random() - 0.5)
    : currentQuestion?.options || [];
```

This runs on **every render**, causing:
1. Options to get new random order each time React re-renders
2. React to think the options are different elements
3. Selection state to become confused
4. Auto-select behavior

## Solution
Memoize the shuffled options using `useState` so they only shuffle once when the quiz starts:

### Step 1: Add shuffled options state (after line 32)
```typescript
// Shuffle options once and memoize
const [shuffledOptions] = useState(() => {
  if (!settings.shuffleOptions) return null;
  
  // Create shuffled options for each question
  const shuffled: { [questionId: string]: typeof questions[0]['options'] } = {};
  displayQuestions.forEach((q) => {
    shuffled[q.id] = [...q.options].sort(() => Math.random() - 0.5);
  });
  return shuffled;
});
```

### Step 2: Replace the displayOptions calculation (around line 145)
Change from:
```typescript
const displayOptions = settings.shuffleOptions
    ? [...(currentQuestion?.options || [])].sort(() => Math.random() - 0.5)
    : currentQuestion?.options || [];
```

To:
```typescript
const displayOptions = shuffledOptions
  ? shuffledOptions[currentQuestion?.id] || []
  : currentQuestion?.options || [];
```

## Result
- Options shuffle only once when quiz loads
- No re-shuffling on render
- Selection state remains stable
- Bug fixed!

## File Location
`src/components/quiz/QuizAttemptInterface.tsx`

## Note
The file is currently corrupted. You need to either:
1. Restore from a backup
2. Rewrite the component cleanly
3. Or manually apply this fix to a working version
