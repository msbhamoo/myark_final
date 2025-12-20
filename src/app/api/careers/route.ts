import { NextResponse } from 'next/server';
import { getCareersFromFirestore } from '@/lib/careerServiceFirestore';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const careers = await getCareersFromFirestore();
        return NextResponse.json(careers);
    } catch (error) {
        console.error('Error fetching careers:', error);
        return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
    }
}
