import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Country } from '@/types/masters';

let countries: Country[] = [];

export async function GET() {
  return NextResponse.json({ items: countries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newCountry: Country = {
      id: uuidv4(),
      name,
    };

    countries.push(newCountry);

    return NextResponse.json(newCountry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
