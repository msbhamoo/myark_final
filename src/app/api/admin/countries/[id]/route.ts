import { NextResponse } from 'next/server';
import { Country } from '@/types/masters';

// This is a temporary in-memory store.
// In a real application, you would use a database.
let countries: Country[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const country = countries.find((c) => c.id === id);

  if (!country) {
    return NextResponse.json({ error: 'Country not found' }, { status: 404 });
  }

  return NextResponse.json(country);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const countryIndex = countries.findIndex((c) => c.id === id);

    if (countryIndex === -1) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    countries[countryIndex] = { ...countries[countryIndex], name };

    return NextResponse.json(countries[countryIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const countryIndex = countries.findIndex((c) => c.id === id);

  if (countryIndex === -1) {
    return NextResponse.json({ error: 'Country not found' }, { status: 404 });
  }

  countries.splice(countryIndex, 1);

  return new Response(null, { status: 204 });
}
