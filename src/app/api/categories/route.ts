import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection('opportunityCategories').get();
    const categories = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    return NextResponse.json({ 
      categories: categories,
      items: categories 
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
