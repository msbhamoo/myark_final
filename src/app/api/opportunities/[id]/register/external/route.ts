import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import { getStudentProfileFromUid } from '@/lib/studentProfileServer';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: opportunityId } = await params;
  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  let user = null;
  try {
    // Try to get token from Authorization header first
    let token = req.headers.get('authorization')?.split('Bearer ')[1];
    
    // If not in header, try to get from query parameter
    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get('token') || undefined;
    }

    if (token) {
      const auth = getAdminAuth();
      user = await auth.verifyIdToken(token);
    }
  } catch (error) {
    console.error('Error verifying auth token:', error);
    // Non-blocking, as we want to track clicks even for anonymous users
  }

  try {
    const db = getDb();
    const opportunityRef = db.collection('opportunities').doc(opportunityId);
    const opportunityDoc = await opportunityRef.get();

    if (!opportunityDoc.exists) {
      throw new Error('Opportunity not found');
    }

    const opportunityData = opportunityDoc.data();
    if (!opportunityData?.applicationUrl) {
      throw new Error('Application URL not found for this opportunity');
    }

    const clickData: {
      opportunityId: string;
      clickedAt: string;
      userId?: string;
      userName?: string;
      userEmail?: string;
    } = {
      opportunityId: opportunityId,
      clickedAt: new Date().toISOString(),
    };

    if (user) {
      const studentProfile = await getStudentProfileFromUid(user.uid);
      clickData.userId = user.uid;
      clickData.userName = studentProfile?.displayName || user.displayName || user.name || 'Unknown';
      clickData.userEmail = user.email || undefined;
    }

    await db.collection('external_registration_clicks').add(clickData);

    await db.runTransaction(async (transaction) => {
      transaction.update(opportunityRef, {
        externalRegistrationClickCount: (opportunityData.externalRegistrationClickCount || 0) + 1,
      });
    });

    return NextResponse.redirect(opportunityData.applicationUrl);
  } catch (error) {
    console.error('Error processing external registration click:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
