import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug) {
        return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
    }

    // Track unique views for the blog
    const cookieStore = req.cookies;
    const viewCookieName = `viewed_blog_${slug}`;
    const hasViewed = cookieStore.get(viewCookieName);

    let viewIncremented = false;

    if (!hasViewed) {
        try {
            const db = getDb();
            // We need to find the doc by slug first since we don't have the ID
            const snapshot = await db.collection('blogs').where('slug', '==', slug).limit(1).get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                await doc.ref.update({
                    viewCount: FieldValue.increment(1)
                });
                viewIncremented = true;
            }
        } catch (error) {
            console.error('Error incrementing blog view count:', error);
            // Continue execution even if increment fails
        }
    }

    const response = NextResponse.json({
        success: true,
        viewIncremented
    });

    // Set cookie if this was a new view
    if (viewIncremented) {
        response.cookies.set(viewCookieName, 'true', {
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    }

    return response;
}
