# MyArk Cloud Functions

This folder contains Firebase Cloud Functions for automated notifications.

## Setup

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Configure SendGrid (for emails)

Get your API key from [SendGrid](https://sendgrid.com) and set it:

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

### 3. Deploy

```bash
npm run deploy
# or
firebase deploy --only functions
```

## Functions

### 1. `sendWeeklyDigest`
- **Schedule**: Every Sunday at 9:00 AM IST
- **Purpose**: Sends personalized "Discover Weekly" email digest
- **Required**: `weeklyDigest: true` and `emailEnabled: true` in user preferences

### 2. `sendDeadlineReminders`
- **Schedule**: Every day at 8:00 AM IST
- **Purpose**: Push notification for saved opportunities with deadlines in 3 days
- **Required**: `deadlineReminders: true` in user preferences

### 3. `notifyNewOpportunity`
- **Trigger**: When a new opportunity document is created
- **Purpose**: Push notification to users interested in that category
- **Required**: `newOpportunities: true` and `pushEnabled: true` in user preferences

## Local Testing

```bash
npm run serve
```

This starts the Firebase emulator for local testing.

## Logs

View function logs:

```bash
firebase functions:log
```

## Email Template

The weekly digest uses a beautiful HTML email template with:
- Gradient header with MyArk branding
- Personalized greeting
- Up to 5 recommended opportunities with deadlines
- CTA button to explore all opportunities
- Footer with preference management link
