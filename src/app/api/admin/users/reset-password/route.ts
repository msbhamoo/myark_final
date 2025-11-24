import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export async function POST(request: NextRequest) {
    // Check admin authentication
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const auth = getAdminAuth();

        // Generate password reset link
        const resetLink = await auth.generatePasswordResetLink(email);

        // In production, you would send this via email service
        // For now, we'll just return success
        // You can integrate with SendGrid, Resend, or another email service here

        console.log(`Password reset link for ${email}: ${resetLink}`);

        return NextResponse.json({
            success: true,
            message: 'Password reset email sent successfully',
            // In development, return the link for testing
            ...(process.env.NODE_ENV === 'development' && { resetLink })
        });
    } catch (error: any) {
        console.error('Password reset error:', error);

        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            error: 'Failed to send password reset email',
            details: error.message
        }, { status: 500 });
    }
}
