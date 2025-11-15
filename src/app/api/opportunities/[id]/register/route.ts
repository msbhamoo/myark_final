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

    // Fetch student profile from Firestore
    const studentProfileRef = db.collection(STUDENT_PROFILE_COLLECTION).doc(user.uid);
    const studentProfileDoc = await studentProfileRef.get();
    const profileData = studentProfileDoc.data();
    const studentProfile = profileData ? buildStudentProfileResponse(profileData, user.uid, user.name || 'Student') : null;

    const opportunityRef = db.collection('opportunities').doc(opportunityId);
    const registrationRef = db.collection('opportunity_registrations').doc(`${opportunityId}_${user.uid}`);

    await db.runTransaction(async (transaction) => {
      const opportunityDoc = await transaction.get(opportunityRef);
      const registrationDoc = await transaction.get(registrationRef);

      if (!opportunityDoc.exists) {
        throw new Error('Opportunity not found');
      }

      if (registrationDoc.exists) {
        throw new Error('You are already registered for this opportunity');
      }

      const opportunityData = opportunityDoc.data();
      if (opportunityData?.registrationMode !== 'internal') {
        throw new Error('This opportunity does not accept internal registrations');
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
        opportunityTitle: opportunityData.title,
      };

      transaction.set(registrationRef, registrationRecord);

      transaction.update(opportunityRef, {
        registrationCount: (opportunityData.registrationCount || 0) + 1,
      });
    });

    return NextResponse.json({ message: 'Successfully registered' });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
