import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { City } from '@/types/masters';

let cities: City[] = [];

export async function GET() {
  return NextResponse.json({ items: cities });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json({ error: 'Name and State are required' }, { status: 400 });
    }

    const newCity: City = {
      id: uuidv4(),
      name,
      stateId,
    };

    cities.push(newCity);

    return NextResponse.json(newCity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
