import { NextResponse } from 'next/server';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import { getDb } from '@/lib/firebaseAdmin';
import {
  buildValidationContext,
  ensureRowLimit,
  parseCsvToRecords,
  validateImportRow,
} from '@/lib/bulkImport';
import { isBulkEntity } from '@/types/bulk';

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

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Upload file is required (CSV).' }, { status: 400 });
  }

  const fileContents = await file.text();
  if (!fileContents.trim()) {
    return NextResponse.json({ error: 'The uploaded file is empty.' }, { status: 400 });
  }

  const parsed = parseCsvToRecords(fileContents);
  if (parsed.headers.length === 0) {
    return NextResponse.json({ error: 'No header row detected in CSV.' }, { status: 400 });
  }

  ensureRowLimit(parsed.rows.length);
  if (parsed.rows.length === 0) {
    return NextResponse.json({ error: 'No data rows found in the CSV. Add at least one row below the header.' }, { status: 400 });
  }

  const db = getDb();
  const context = await buildValidationContext(entity, db);

  const rows = parsed.rows.map((row) => {
    const validation = validateImportRow(entity, row.raw, context as never);
    return {
      index: row.index,
      raw: row.raw,
      data: validation.data,
      errors: validation.errors,
    };
  });

  const validCount = rows.filter((row) => row.errors.length === 0).length;
  const invalidCount = rows.length - validCount;

  return NextResponse.json({
    headers: parsed.headers,
    rows,
    totals: {
      total: rows.length,
      valid: validCount,
      invalid: invalidCount,
    },
  });
}
