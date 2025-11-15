import { NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FETCH_LIMIT = 200;
const MAX_OPPORTUNITIES_PER_STATE = 8;

export async function GET() {
  try {
    const { opportunities } = await getOpportunities({ limit: FETCH_LIMIT });

    const grouped = new Map<string, Opportunity[]>();
    opportunities.forEach((opportunity) => {
      const state = opportunity.state;
      if (!state) {
        return;
      }
      const trimmed = state.trim();
      if (!INDIAN_STATES_SET.has(trimmed as any)) {
        return;
      }
      if (!grouped.has(trimmed)) {
        grouped.set(trimmed, []);
      }
      grouped.get(trimmed)!.push(opportunity);
    });

    const stateOrder = new Map(INDIAN_STATES.map((state, index) => [state, index]));

    const items = Array.from(grouped.entries())
      .map(([state, list]) => ({
        state,
        count: list.length,
        opportunities: list.slice(0, MAX_OPPORTUNITIES_PER_STATE),
      }))
      .sort((a, b) => {
        const orderA = stateOrder.get(a.state as any) ?? Number.MAX_SAFE_INTEGER;
        const orderB = stateOrder.get(b.state as any) ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.state.localeCompare(b.state);
      });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch state opportunities', error);
    return NextResponse.json({ error: 'Failed to fetch state opportunities' }, { status: 500 });
  }
}
