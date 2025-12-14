import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { getAdminSession } from '@/lib/adminSession';

interface PageProps {
    params: Promise<{ id: string }>;
}

// PATCH - Update a school lead (admin only)
export async function PATCH(request: NextRequest, { params }: PageProps) {
    try {
        // Check admin session
        const session = getAdminSession(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, notes } = body;

        const updateData: Record<string, unknown> = {
            updatedAt: Timestamp.now(),
        };

        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const db = getDb();
        await db.collection('schoolLeads').doc(id).update(updateData);

        return NextResponse.json({ success: true, message: 'Lead updated' });
    } catch (error) {
        console.error('Error updating school lead:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a school lead (admin only)
export async function DELETE(request: NextRequest, { params }: PageProps) {
    try {
        // Check admin session
        const session = getAdminSession(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const db = getDb();
        await db.collection('schoolLeads').doc(id).delete();

        return NextResponse.json({ success: true, message: 'Lead deleted' });
    } catch (error) {
        console.error('Error deleting school lead:', error);
        return NextResponse.json(
            { error: 'Failed to delete lead' },
            { status: 500 }
        );
    }
}
