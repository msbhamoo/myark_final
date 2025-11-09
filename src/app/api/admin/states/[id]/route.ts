import { NextResponse } from 'next/server';
import { State } from '@/types/masters';

// This is a temporary in-memory store.
// In a real application, you would use a database.
let states: State[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const state = states.find((s) => s.id === id);

  if (!state) {
    return NextResponse.json({ error: 'State not found' }, { status: 404 });
  }

  return NextResponse.json(state);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const { name, countryId } = body;

    if (!name || !countryId) {
      return NextResponse.json({ error: 'Name and Country are required' }, { status: 400 });
    }

    const stateIndex = states.findIndex((s) => s.id === id);

    if (stateIndex === -1) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    states[stateIndex] = { ...states[stateIndex], name, countryId };

    return NextResponse.json(states[stateIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const stateIndex = states.findIndex((s) => s.id === id);

  if (stateIndex === -1) {
    return NextResponse.json({ error: 'State not found' }, { status: 404 });
  }

  states.splice(stateIndex, 1);

  return new Response(null, { status: 204 });
}
