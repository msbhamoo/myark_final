import { NextResponse } from 'next/server';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import { getDb } from '@/lib/firebaseAdmin';
import {
  buildValidationContext,
  ensureRowLimit,
  persistImportRecord,
  validateImportRow,
} from '@/lib/bulkImport';
import { isBulkEntity } from '@/types/bulk';

type CommitRowPayload = {
  index: number;
  raw: Record<string, string>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request, { params }: { params: { entity: string } }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = params;
  if (!isBulkEntity(entity)) {
    return NextResponse.json({ error: 'Unsupported entity' }, { status: 404 });
  }

  const payload = (await request.json().catch(() => null)) as { rows?: unknown } | null;
  if (!payload || !Array.isArray(payload.rows)) {
    return NextResponse.json({ error: 'Rows array is required' }, { status: 400 });
  }

  const normalizedRows: CommitRowPayload[] = [];
  const malformedRows: Array<{ index: number | null; errors: string[] }> = [];

  payload.rows.forEach((entry, idx) => {
    if (
      entry &&
      typeof entry === 'object' &&
      'raw' in entry &&
      typeof (entry as CommitRowPayload).raw === 'object' &&
      (entry as CommitRowPayload).raw !== null
    ) {
      const cast = entry as CommitRowPayload;
      normalizedRows.push({
        index: typeof cast.index === 'number' ? cast.index : idx + 2,
        raw: Object.fromEntries(
          Object.entries(cast.raw).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : value === null || value === undefined ? '' : String(value),
          ]),
        ),
      });
    } else {
      malformedRows.push({
        index: null,
        errors: ['Row payload is malformed.'],
      });
    }
  });

  if (normalizedRows.length === 0) {
    return NextResponse.json({ error: 'No valid rows supplied for import.' }, { status: 400 });
  }

  ensureRowLimit(normalizedRows.length);

  const db = getDb();
  const context = await buildValidationContext(entity, db);

  let created = 0;
  let updated = 0;
  const failed: Array<{ index: number; errors: string[] }> = [];

  for (const row of normalizedRows) {
    const validation = validateImportRow(entity, row.raw, context as never);
    if (validation.errors.length > 0) {
      failed.push({ index: row.index, errors: validation.errors });
      continue;
    }
    try {
      const outcome = await persistImportRecord(entity, db, validation.data as never);
      if (outcome === 'created') {
        created += 1;
      } else {
        updated += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to persist record.';
      failed.push({ index: row.index, errors: [message] });
    }
  }

  const total = normalizedRows.length;

  return NextResponse.json({
    summary: {
      total,
      created,
      updated,
      failed: failed.length + malformedRows.length,
    },
    failed: [...failed, ...malformedRows],
  });
}
