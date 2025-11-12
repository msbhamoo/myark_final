import { NextResponse } from 'next/server';
import { City } from '@/types/masters';

// Accept Next.js style route params which can be string or string[]
type Params = { id?: string | string[] };

// This is a temporary in-memory store.
// In a real application, you would use a database.
let cities: City[] = [];

export async function GET(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  const city = cities.find((c) => c.id === id);

  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  return NextResponse.json(city);
}

export async function PUT(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  try {
    const body = await request.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json({ error: 'Name and State are required' }, { status: 400 });
    }

    const cityIndex = cities.findIndex((c) => c.id === id);

    if (cityIndex === -1) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    cities[cityIndex] = { ...cities[cityIndex], name, stateId };

    return NextResponse.json(cities[cityIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  const cityIndex = cities.findIndex((c) => c.id === id);

  if (cityIndex === -1) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  cities.splice(cityIndex, 1);

  return new Response(null, { status: 204 });
}
