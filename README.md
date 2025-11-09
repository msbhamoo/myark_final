## Overview

This project is a Next.js 15 application that now loads opportunity data from Firebase Firestore at runtime. The home page and opportunity detail route consume the internal API (`/api/opportunities`) which reads from Firestore using the Firebase Admin SDK. A sample dataset plus a lightweight seeding script are included to help you bootstrap content quickly.

## Prerequisites

- Node.js 18.17+ / npm 9+
- Firebase CLI `firebase-tools` (`npm install -g firebase-tools`)
- A Firebase project with **Firestore** enabled
- Service-account credentials for the Firebase project (JSON key)

## Environment Setup

1. Create a `.env.local` file in the project root with the Firebase admin credentials (never commit this file):

   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
   ADMIN_PANEL_SECRET=change-me
   ```

   > WARNING: Keep the `\n` sequences - they are converted back to real newlines at runtime.

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

   The site runs at [http://localhost:3000](http://localhost:3000).

## Seeding Firestore with Sample Data

Sample opportunity documents live in `data/sample-opportunities.json`. Seed them into your Firestore project with:

```bash
FIREBASE_PROJECT_ID=... \
FIREBASE_CLIENT_EMAIL=... \
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" \
npm run seed:firebase
```

The script performs an upsert into the `opportunities` collection, so rerunning it is safe.

## Key Routes & Data Flow

- `src/app/api/opportunities/route.ts` - list endpoint returning opportunities plus segment groupings.
- `src/app/api/opportunities/[id]/route.ts` - fetches a single opportunity by document ID or `slug`.
- `src/lib/opportunityService.ts` - shared Firestore data access helpers.
- `src/app/page.tsx` - home page fetching from the list endpoint and rendering segments dynamically.
- `src/app/opportunity/[id]/page.tsx` - dynamic opportunity detail page, fetching by `id`/`slug`.
- `src/app/admin` - password-protected control panel and future CRUD interfaces.

## Firebase Hosting Deployment

1. Login and enable the web framework integration (once per machine):

   ```bash
   firebase login
   firebase experiments:enable webframeworks
   ```

2. Initialise Hosting (pick the existing Firebase project, choose **Web Frameworks**, point to `.`):

   ```bash
   firebase init hosting
   ```

   This generates `firebase.json` and `firebase.rc` with the Next.js adapter configuration.

3. Provide production credentials so the build running in Firebase Hosting can read Firestore. Create `.env.production.local` with the same keys you used for local development:

   ```
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ADMIN_PANEL_SECRET=...
   ```

4. Build and deploy:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

   The Firebase CLI runs `next build` automatically during deploy; the manual build step is optional but useful for catching issues locally first.

## Notes

- All Firestore documents must include `status: "published"` to be surfaced by the APIs.
- Use the `segments` array on each document (`["featured"]`, `["scholarships"]`, etc.) to control where an opportunity appears on the home page.
- When changing Firestore structure, update the transforms in `src/lib/opportunityService.ts` to keep the UI in sync.
- Set a strong `ADMIN_PANEL_SECRET` per environment and rotate it periodically; access the control panel at `/admin/login`.
