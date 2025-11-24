import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import {
  STUDENT_PROFILE_COLLECTION,
  buildStudentProfileResponse,
} from '@/lib/studentProfileServer';

export async function POST(
  req: Request,
  ctx: any,
) {
  const params = (ctx && ctx.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const opportunityId = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  let user;
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const auth = getAdminAuth();
    user = await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const body = await req.json().catch(() => ({}));
    const isExternalConfirmation = body.status === 'external_confirmed';

    // Fetch student profile from Firestore
    const studentProfileRef = db.collection(STUDENT_PROFILE_COLLECTION).doc(user.uid);
    const studentProfileDoc = await studentProfileRef.get();
    const profileData = studentProfileDoc.data();
    const studentProfile = profileData ? buildStudentProfileResponse(profileData, user.uid, user.name || 'Student') : null;

    const opportunityRef = db.collection('opportunities').doc(opportunityId);
    const registrationRef = db.collection('opportunity_registrations').doc(`${opportunityId}_${user.uid}`);

    await db.runTransaction(async (transaction) => {
      // ALL READS MUST COME FIRST
      const opportunityDoc = await transaction.get(opportunityRef);
      const registrationDoc = await transaction.get(registrationRef);
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await transaction.get(userRef);

      // Validation
      if (!opportunityDoc.exists) {
        throw new Error('Opportunity not found');
      }

      if (registrationDoc.exists) {
        throw new Error('You are already registered for this opportunity');
      }

      const opportunityData = opportunityDoc.data();

      if (isExternalConfirmation) {
        if (opportunityData?.registrationMode !== 'external') {
          throw new Error('This opportunity is not configured for external registration');
        }
      } else {
        if (opportunityData?.registrationMode !== 'internal') {
          throw new Error('This opportunity does not accept internal registrations');
        }
      }

      const registrationRecord = {
        studentUid: user.uid,
        studentName: studentProfile?.displayName || user.name || 'Unknown',
        studentEmail: user.email || null,
        className: studentProfile?.schoolInfo?.className || null,
        schoolName: studentProfile?.schoolInfo?.schoolName || null,
        profileSlug: studentProfile?.slug || null,
        registeredAt: new Date().toISOString(),
        opportunityId: opportunityId,
        opportunityTitle: opportunityData?.title,
        registrationType: isExternalConfirmation ? 'external' : 'internal',
      };

      // ALL WRITES COME AFTER ALL READS
      transaction.set(registrationRef, registrationRecord);

      transaction.update(opportunityRef, {
        registrationCount: (opportunityData?.registrationCount || 0) + 1,
      });

      // Increment opportunitiesApplied counter on user document
      if (userDoc.exists) {
        transaction.update(userRef, {
          opportunitiesApplied: (userDoc.data()?.opportunitiesApplied || 0) + 1,
        });
      } else {
        // Create user document if it doesn't exist
        transaction.set(userRef, {
          uid: user.uid,
          email: user.email || null,
          opportunitiesApplied: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, { merge: true });
      }
    });

    return NextResponse.json({ message: 'Successfully registered' });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  ctx: any,
) {
  const params = (ctx && ctx.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const opportunityId = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  let user;
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const auth = getAdminAuth();
    user = await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const registrationRef = db.collection('opportunity_registrations').doc(`${opportunityId}_${user.uid}`);
    const registrationDoc = await registrationRef.get();

    if (registrationDoc.exists) {
      const data = registrationDoc.data();
      return NextResponse.json({
        isRegistered: true,
        registeredAt: data?.registeredAt || null
      });
    } else {
      return NextResponse.json({
        isRegistered: false,
        registeredAt: null
      });
    }
  } catch (error) {
    console.error('Error checking registration status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
