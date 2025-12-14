import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export interface SchoolLead {
    id?: string;
    schoolName: string;
    contactName: string;
    email: string;
    phone: string;
    city: string;
    status: 'new' | 'contacted' | 'converted' | 'rejected';
    notes?: string;
    createdAt: FirebaseFirestore.Timestamp | string;
    updatedAt?: FirebaseFirestore.Timestamp | string;
}

// GET - Fetch all school leads (for admin)
export async function GET() {
    try {
        const db = getDb();
        const snapshot = await db.collection('schoolLeads')
            .orderBy('createdAt', 'desc')
            .get();

        const leads: SchoolLead[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                schoolName: data.schoolName || '',
                contactName: data.contactName || '',
                email: data.email || '',
                phone: data.phone || '',
                city: data.city || '',
                status: data.status || 'new',
                notes: data.notes || '',
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || undefined,
            };
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Error fetching school leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

// POST - Create a new school lead (from form submission)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { schoolName, contactName, email, phone, city } = body;

        // Validate required fields
        if (!schoolName || !contactName || !email || !phone || !city) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create the lead document
        const leadData = {
            schoolName: schoolName.trim(),
            contactName: contactName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            city: city.trim(),
            status: 'new',
            notes: '',
            createdAt: Timestamp.now(),
        };

        const db = getDb();
        const docRef = await db.collection('schoolLeads').add(leadData);

        return NextResponse.json({
            success: true,
            message: 'Lead submitted successfully',
            id: docRef.id,
        });
    } catch (error) {
        console.error('Error creating school lead:', error);
        return NextResponse.json(
            { error: 'Failed to submit lead' },
            { status: 500 }
        );
    }
}
