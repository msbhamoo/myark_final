import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { State } from '@/types/masters';

let states: State[] = [];

export async function GET() {
  return NextResponse.json({ items: states });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, countryId } = body;

    if (!name || !countryId) {
      return NextResponse.json({ error: 'Name and Country are required' }, { status: 400 });
    }

    const newState: State = {
      id: uuidv4(),
      name,
      countryId,
    };

    states.push(newState);

    return NextResponse.json(newState, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
