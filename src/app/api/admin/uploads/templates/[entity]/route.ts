import { NextResponse } from 'next/server';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import { createTemplateCsv } from '@/lib/bulkImport';
import { isBulkEntity } from '@/types/bulk';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { entity: string } }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = params;
  if (!isBulkEntity(entity)) {
    return NextResponse.json({ error: 'Unknown template' }, { status: 404 });
  }

  const csv = createTemplateCsv(entity);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${entity}-template.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
