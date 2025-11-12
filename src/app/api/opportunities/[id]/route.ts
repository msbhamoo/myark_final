import { NextResponse } from 'next/server';
import { getOpportunityByIdOrSlug } from '@/lib/opportunityService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteContext {
  params?: { id?: string | string[] };
}

export async function GET(_: Request, ctx: any) {
  try {
    const params = (ctx && ctx.params) as { id?: string | string[] } | undefined;
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
    const opportunity = await getOpportunityByIdOrSlug(id);

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Failed to fetch opportunity detail', error);
    return NextResponse.json({ error: 'Failed to fetch opportunity detail' }, { status: 500 });
  }
}
