/**
 * Cloud Functions for MyArk Notifications
 * 
 * This file contains Firebase Cloud Functions for:
 * - Weekly Discover Weekly digest emails
 * - Deadline reminder notifications
 * - New opportunity alerts
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a 'functions' folder in your project root (if not exists)
 * 2. Run: cd functions && npm init -y && npm install firebase-functions firebase-admin
 * 3. Copy this file to functions/src/notifications.ts
 * 4. Set up email provider (SendGrid/Postmark) - add API key to Firebase config:
 *    firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
 * 5. Deploy: firebase deploy --only functions
 * 
 * For local testing: npm run serve
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize admin if not already done
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// ============================================================================
// TYPES
// ============================================================================

interface NotificationPreferences {
    weeklyDigest: boolean;
    deadlineReminders: boolean;
    newOpportunities: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
}

interface UserInterests {
    categories: Record<string, number>;
    keywords: Record<string, number>;
}

interface Opportunity {
    id: string;
    title: string;
    category: string;
    categoryName?: string;
    registrationDeadline?: string;
    organizer?: string;
    image?: string;
}

interface DigestData {
    opportunities: Array<{
        id: string;
        title: string;
        category: string;
        deadline?: string;
        matchReasons: string[];
    }>;
    headline: string;
    summary: string;
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

const generateWeeklyDigestEmail = (
    userName: string,
    digest: DigestData
): { subject: string; html: string; text: string } => {
    const subject = `🌟 ${digest.headline} - Your MyArk Weekly Digest`;

    const opportunityCards = digest.opportunities
        .map(
            (opp) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${opp.title}</h3>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${opp.category}</p>
                ${opp.deadline ? `<p style="margin: 0; color: #dc2626; font-size: 12px;">Deadline: ${new Date(opp.deadline).toLocaleDateString()}</p>` : ''}
                ${opp.matchReasons.length > 0 ? `<p style="margin: 8px 0 0 0; color: #7c3aed; font-size: 12px;">✨ ${opp.matchReasons[0]}</p>` : ''}
              </td>
              <td width="100" style="text-align: right;">
                <a href="https://myark.in/opportunity/${opp.id}" 
                   style="display: inline-block; padding: 8px 16px; background: linear-gradient(to right, #7c3aed, #6366f1); color: white; text-decoration: none; border-radius: 6px; font-size: 12px;">
                  View
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
        )
        .join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(to right, #7c3aed, #6366f1); padding: 32px; text-align: center;">
                  <img src="https://myark.in/logo-white.png" alt="MyArk" height="32" style="margin-bottom: 16px;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">${digest.headline}</h1>
                  <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your personalized opportunity digest</p>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 24px 32px 16px 32px;">
                  <p style="margin: 0; color: #374151; font-size: 16px;">Hi ${userName},</p>
                  <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">${digest.summary}</p>
                </td>
              </tr>

              <!-- Opportunities -->
              <tr>
                <td style="padding: 0 32px 24px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px;">
                    ${opportunityCards}
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding: 0 32px 32px 32px; text-align: center;">
                  <a href="https://myark.in/opportunities" 
                     style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #7c3aed, #6366f1); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                    Explore All Opportunities
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                    You're receiving this because you have weekly digest enabled.
                  </p>
                  <a href="https://myark.in/dashboard" style="color: #7c3aed; font-size: 12px; text-decoration: none;">
                    Manage notification preferences
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    const text = `
${digest.headline}

Hi ${userName},

${digest.summary}

Your recommended opportunities:

${digest.opportunities.map((opp) => `- ${opp.title} (${opp.category})${opp.deadline ? ` - Deadline: ${new Date(opp.deadline).toLocaleDateString()}` : ''}`).join('\n')}

View all opportunities: https://myark.in/opportunities

--
MyArk - Discover Your Next Opportunity
Manage preferences: https://myark.in/dashboard
  `;

    return { subject, html, text };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get personalized recommendations for a user
 */
async function getPersonalizedRecommendations(
    uid: string,
    limit = 5
): Promise<Opportunity[]> {
    // Get user interests
    const interestsDoc = await db
        .collection('users')
        .doc(uid)
        .collection('metadata')
        .doc('interests')
        .get();

    const interests: UserInterests = interestsDoc.exists
        ? (interestsDoc.data() as UserInterests)
        : { categories: {}, keywords: {} };

    const topCategories = Object.entries(interests.categories || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat);

    // Get active opportunities
    const now = new Date();
    let query = db
        .collection('opportunities')
        .where('status', '==', 'active')
        .orderBy('registrationDeadline', 'asc')
        .limit(50);

    const snapshot = await query.get();
    const opportunities: Opportunity[] = [];

    snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // Skip expired
        if (data.registrationDeadline && new Date(data.registrationDeadline) < now) {
            return;
        }

        // Score based on category match
        const category = data.categoryId || data.category;
        const isMatch = topCategories.includes(category);

        opportunities.push({
            id: doc.id,
            title: data.title || '',
            category: data.categoryName || data.category || '',
            categoryName: data.categoryName,
            registrationDeadline: data.registrationDeadline,
            organizer: data.organizer,
            image: data.image,
            _score: isMatch ? 100 : 50,
        } as Opportunity & { _score: number });
    });

    // Sort by score and return top results
    return opportunities
        .sort((a, b) => (b as any)._score - (a as any)._score)
        .slice(0, limit);
}

/**
 * Send email using SendGrid
 */
async function sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
): Promise<boolean> {
    const sendgridKey = functions.config().sendgrid?.key;

    if (!sendgridKey) {
        console.error('SendGrid API key not configured');
        return false;
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: 'hello@myark.in', name: 'MyArk' },
                subject,
                content: [
                    { type: 'text/plain', value: text },
                    { type: 'text/html', value: html },
                ],
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

// ============================================================================
// CLOUD FUNCTIONS
// ============================================================================

/**
 * Weekly Digest - Runs every Sunday at 9 AM IST
 * 
 * Sends personalized opportunity digest to users with weeklyDigest enabled
 */
export const sendWeeklyDigest = functions
    .runWith({ timeoutSeconds: 540, memory: '512MB' })
    .pubsub.schedule('0 9 * * 0') // Every Sunday at 9:00 AM
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
        console.log('Starting weekly digest job...');

        // Find users with weekly digest enabled
        const prefsSnapshot = await db
            .collectionGroup('notifications')
            .where('weeklyDigest', '==', true)
            .where('emailEnabled', '==', true)
            .limit(1000)
            .get();

        const userIds = new Set<string>();
        prefsSnapshot.docs.forEach((doc) => {
            const pathParts = doc.ref.path.split('/');
            const usersIndex = pathParts.indexOf('users');
            if (usersIndex >= 0 && pathParts[usersIndex + 1]) {
                userIds.add(pathParts[usersIndex + 1]);
            }
        });

        console.log(`Found ${userIds.size} users for weekly digest`);

        let sentCount = 0;
        let errorCount = 0;

        for (const uid of userIds) {
            try {
                // Get user info
                const userDoc = await db.collection('users').doc(uid).get();
                if (!userDoc.exists) continue;

                const userData = userDoc.data();
                const email = userData?.email;
                const name = userData?.displayName || 'Student';

                if (!email) continue;

                // Get personalized recommendations
                const opportunities = await getPersonalizedRecommendations(uid, 5);

                if (opportunities.length === 0) {
                    console.log(`No recommendations for user ${uid}, skipping`);
                    continue;
                }

                // Generate digest content
                const categories = [...new Set(opportunities.map((o) => o.categoryName || o.category))];
                const digest: DigestData = {
                    opportunities: opportunities.map((o) => ({
                        id: o.id,
                        title: o.title,
                        category: o.categoryName || o.category,
                        deadline: o.registrationDeadline,
                        matchReasons: ['Matched your interests'],
                    })),
                    headline: categories.length > 0
                        ? `${categories.slice(0, 2).join(' & ')} Opportunities`
                        : 'Your Weekly Picks',
                    summary: `We found ${opportunities.length} opportunities that match your interests. Check them out before the deadlines!`,
                };

                // Generate and send email
                const { subject, html, text } = generateWeeklyDigestEmail(name, digest);
                const success = await sendEmail(email, subject, html, text);

                if (success) {
                    sentCount++;
                    // Log the notification
                    await db
                        .collection('users')
                        .doc(uid)
                        .collection('notificationLogs')
                        .add({
                            type: 'weekly_digest',
                            sentAt: admin.firestore.FieldValue.serverTimestamp(),
                            success: true,
                            opportunityCount: opportunities.length,
                        });
                } else {
                    errorCount++;
                }

                // Rate limiting - wait 100ms between emails
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error processing user ${uid}:`, error);
                errorCount++;
            }
        }

        console.log(`Weekly digest complete. Sent: ${sentCount}, Errors: ${errorCount}`);
        return null;
    });

/**
 * Deadline Reminders - Runs daily at 8 AM IST
 * 
 * Sends reminders for saved opportunities with deadlines in next 3 days
 */
export const sendDeadlineReminders = functions
    .runWith({ timeoutSeconds: 300, memory: '256MB' })
    .pubsub.schedule('0 8 * * *') // Every day at 8:00 AM
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
        console.log('Starting deadline reminders job...');

        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Find users with deadline reminders enabled
        const prefsSnapshot = await db
            .collectionGroup('notifications')
            .where('deadlineReminders', '==', true)
            .limit(1000)
            .get();

        const userIds = new Set<string>();
        prefsSnapshot.docs.forEach((doc) => {
            const pathParts = doc.ref.path.split('/');
            const usersIndex = pathParts.indexOf('users');
            if (usersIndex >= 0 && pathParts[usersIndex + 1]) {
                userIds.add(pathParts[usersIndex + 1]);
            }
        });

        console.log(`Checking ${userIds.size} users for deadline reminders`);

        let sentCount = 0;

        for (const uid of userIds) {
            try {
                // Get user's saved opportunities
                const savedSnapshot = await db
                    .collection('users')
                    .doc(uid)
                    .collection('savedOpportunities')
                    .get();

                const urgentOpps: Opportunity[] = [];

                for (const savedDoc of savedSnapshot.docs) {
                    const oppDoc = await db.collection('opportunities').doc(savedDoc.id).get();
                    if (!oppDoc.exists) continue;

                    const data = oppDoc.data();
                    if (!data?.registrationDeadline) continue;

                    const deadline = new Date(data.registrationDeadline);
                    if (deadline > now && deadline <= threeDaysFromNow) {
                        urgentOpps.push({
                            id: oppDoc.id,
                            title: data.title,
                            category: data.categoryName || data.category,
                            registrationDeadline: data.registrationDeadline,
                        });
                    }
                }

                if (urgentOpps.length === 0) continue;

                // Get user FCM tokens for push notification
                const tokensSnapshot = await db
                    .collection('users')
                    .doc(uid)
                    .collection('fcmTokens')
                    .get();

                if (tokensSnapshot.empty) continue;

                const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

                // Send push notification
                const message = {
                    notification: {
                        title: `⏰ ${urgentOpps.length} deadline${urgentOpps.length > 1 ? 's' : ''} approaching!`,
                        body: urgentOpps.length === 1
                            ? `${urgentOpps[0].title} deadline is in ${Math.ceil((new Date(urgentOpps[0].registrationDeadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`
                            : `You have ${urgentOpps.length} saved opportunities with upcoming deadlines`,
                    },
                    data: {
                        type: 'deadline_reminder',
                        url: '/dashboard',
                    },
                    tokens,
                };

                await admin.messaging().sendEachForMulticast(message);
                sentCount++;

                // Log
                await db
                    .collection('users')
                    .doc(uid)
                    .collection('notificationLogs')
                    .add({
                        type: 'deadline_reminder',
                        sentAt: admin.firestore.FieldValue.serverTimestamp(),
                        success: true,
                        opportunityCount: urgentOpps.length,
                    });
            } catch (error) {
                console.error(`Error processing user ${uid}:`, error);
            }
        }

        console.log(`Deadline reminders complete. Sent: ${sentCount}`);
        return null;
    });

/**
 * New Opportunity Alert - Triggered when a new opportunity is published
 */
export const notifyNewOpportunity = functions.firestore
    .document('opportunities/{opportunityId}')
    .onCreate(async (snap, context) => {
        const opportunity = snap.data();
        const opportunityId = context.params.opportunityId;

        if (opportunity.status !== 'active') {
            return null;
        }

        console.log(`New opportunity published: ${opportunity.title}`);

        const category = opportunity.categoryId || opportunity.category;

        // Find users interested in this category
        const interestsSnapshot = await db
            .collectionGroup('interests')
            .limit(500)
            .get();

        const interestedUsers = new Set<string>();

        interestsSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.categories && data.categories[category] > 0) {
                const pathParts = doc.ref.path.split('/');
                const usersIndex = pathParts.indexOf('users');
                if (usersIndex >= 0 && pathParts[usersIndex + 1]) {
                    interestedUsers.add(pathParts[usersIndex + 1]);
                }
            }
        });

        console.log(`Found ${interestedUsers.size} interested users`);

        // Send push notifications (batch)
        const allTokens: string[] = [];

        for (const uid of interestedUsers) {
            // Check if user has new opportunity notifications enabled
            const prefsDoc = await db
                .collection('users')
                .doc(uid)
                .collection('notifications')
                .doc('preferences')
                .get();

            const prefs = prefsDoc.exists ? prefsDoc.data() : { newOpportunities: true };
            if (!prefs?.newOpportunities || !prefs?.pushEnabled) continue;

            const tokensSnapshot = await db
                .collection('users')
                .doc(uid)
                .collection('fcmTokens')
                .get();

            tokensSnapshot.docs.forEach((doc) => {
                allTokens.push(doc.data().token);
            });
        }

        if (allTokens.length === 0) {
            console.log('No tokens to notify');
            return null;
        }

        // Send in batches of 500 (FCM limit)
        const batches = [];
        for (let i = 0; i < allTokens.length; i += 500) {
            batches.push(allTokens.slice(i, i + 500));
        }

        for (const batch of batches) {
            const message = {
                notification: {
                    title: `🌟 New: ${opportunity.title}`,
                    body: `A new ${opportunity.categoryName || opportunity.category} opportunity is available!`,
                    image: opportunity.image,
                },
                data: {
                    type: 'new_opportunity',
                    opportunityId,
                    url: `/opportunity/${opportunityId}`,
                },
                tokens: batch,
            };

            await admin.messaging().sendEachForMulticast(message);
        }

        console.log(`Sent new opportunity notification to ${allTokens.length} devices`);
        return null;
    });
