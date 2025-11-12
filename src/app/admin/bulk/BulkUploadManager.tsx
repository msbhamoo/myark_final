"use client";

import { useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Download, RefreshCcw, Upload } from 'lucide-react';
import type { BulkEntity } from '@/types/bulk';

type PreviewRow = {
  index: number;
  raw: Record<string, string>;
  data: Record<string, unknown>;
  errors: string[];
};

type PreviewResponse = {
  fileName?: string;
  headers: string[];
  rows: PreviewRow[];
  totals: {
    total: number;
    valid: number;
    invalid: number;
  };
};

type EntityState = {
  fileName: string | null;
  preview: PreviewResponse | null;
  loading: boolean;
  committing: boolean;
  error: string | null;
  success: string | null;
};

const ENTITY_CONFIG: Record<
  BulkEntity,
  {
    label: string;
    description: string;
    helper: string;
  }
> = {
  opportunities: {
    label: 'Opportunities',
    description:
      'Upload CSV data for opportunities. Segments must match the configured home layout segment keys.',
    helper: 'Arrays such as eligibility, benefits, and segments should be separated with commas or semicolons.',
  },
  schools: {
    label: 'Schools',
    description: 'Bulk create or update school entries used across the platform.',
    helper: 'Mark the isVerified column as true or false.',
  },
  organizers: {
    label: 'Organizers',
    description: 'Import organizer profiles with their core metadata.',
    helper: 'Foundation year should be a number; visibility accepts public or private.',
  },
};

const createInitialState = (): Record<BulkEntity, EntityState> => ({
  opportunities: {
    fileName: null,
    preview: null,
    loading: false,
    committing: false,
    error: null,
    success: null,
  },
  schools: {
    fileName: null,
    preview: null,
    loading: false,
    committing: false,
    error: null,
    success: null,
  },
  organizers: {
    fileName: null,
    preview: null,
    loading: false,
    committing: false,
    error: null,
    success: null,
  },
});

export function BulkUploadManager() {
  const [activeEntity, setActiveEntity] = useState<BulkEntity>('opportunities');
  const [states, setStates] = useState<Record<BulkEntity, EntityState>>(createInitialState);
  const inputRefs = useRef<Record<BulkEntity, HTMLInputElement | null>>({
    opportunities: null,
    schools: null,
    organizers: null,
  });

  const activeState = states[activeEntity];

  const updateState = (entity: BulkEntity, updater: Partial<EntityState> | ((prev: EntityState) => EntityState)) => {
    setStates((prev) => {
      const current = prev[entity];
      const nextState = typeof updater === 'function' ? (updater as (state: EntityState) => EntityState)(current) : { ...current, ...updater };
      return { ...prev, [entity]: nextState };
    });
  };

  const handleDownloadTemplate = async (entity: BulkEntity) => {
    updateState(entity, { error: null, success: null });
    try {
      const response = await fetch(`/api/admin/uploads/templates/${entity}`, {
        method: 'GET',
        headers: { Accept: 'text/csv' },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to download template.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${entity}-template.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      updateState(entity, {
        error: error instanceof Error ? error.message : 'Template download failed.',
      });
    }
  };

  const handleFileChange = async (entity: BulkEntity, file: File | null) => {
    if (!file) {
      return;
    }
    updateState(entity, { loading: true, error: null, success: null });
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/uploads/${entity}/preview`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to preview file.');
      }

      const preview = (await response.json()) as PreviewResponse;
      updateState(entity, {
        fileName: file.name,
        preview,
        loading: false,
      });
    } catch (error) {
      updateState(entity, {
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to preview file.',
      });
    } finally {
      const ref = inputRefs.current[entity];
      if (ref) {
        ref.value = '';
      }
    }
  };

  const handleCommit = async (entity: BulkEntity) => {
    const preview = states[entity].preview;
    if (!preview) {
      return;
    }

    const validRows = preview.rows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      updateState(entity, { error: 'There are no valid rows to import.' });
      return;
    }

    updateState(entity, { committing: true, error: null, success: null });
    try {
      const response = await fetch(`/api/admin/uploads/${entity}/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: validRows.map((row) => ({
            index: row.index,
            raw: row.raw,
          })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to import records.');
      }

      const result = await response.json();
      const summary = result.summary ?? {};
      const failed = result.failed ?? [];

      const messageParts = [];
      if (summary.created) {
        messageParts.push(`${summary.created} created`);
      }
      if (summary.updated) {
        messageParts.push(`${summary.updated} updated`);
      }
      const message = messageParts.length > 0 ? `Import completed: ${messageParts.join(', ')}.` : 'Import completed.';

      if (failed.length > 0) {
        const updatedRows = preview.rows.map((row) => {
          const failedRow = failed.find((entry: { index: number }) => entry.index === row.index);
          return failedRow ? { ...row, errors: failedRow.errors } : row;
        });
        const validAfterUpdate = updatedRows.filter((row) => row.errors.length === 0).length;
        updateState(entity, {
          committing: false,
          success: message,
          error: `Some rows failed to import (${failed.length}).`,
          preview: {
            ...preview,
            rows: updatedRows,
            totals: {
              total: updatedRows.length,
              valid: validAfterUpdate,
              invalid: updatedRows.length - validAfterUpdate,
            },
          },
          fileName: preview.fileName ?? states[entity].fileName,
        });
      } else {
        updateState(entity, {
          committing: false,
          success: message,
          error: null,
          preview: null,
          fileName: null,
        });
      }
    } catch (error) {
      updateState(entity, {
        committing: false,
        error: error instanceof Error ? error.message : 'Failed to import records.',
      });
    }
  };

  const handleReset = (entity: BulkEntity) => {
    updateState(entity, {
      fileName: null,
      preview: null,
      error: null,
      success: null,
    });
    const ref = inputRefs.current[entity];
    if (ref) {
      ref.value = '';
    }
  };

  const renderValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    return String(value);
  };

  const validRowCount = useMemo(
    () => activeState.preview?.rows.filter((row) => row.errors.length === 0).length ?? 0,
    [activeState.preview],
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeEntity} onValueChange={(value) => setActiveEntity(value as BulkEntity)}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(ENTITY_CONFIG) as BulkEntity[]).map((entity) => (
            <TabsTrigger key={entity} value={entity} className="capitalize">
              {ENTITY_CONFIG[entity].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(ENTITY_CONFIG) as BulkEntity[]).map((entity) => {
          const state = states[entity];
          const config = ENTITY_CONFIG[entity];
          const preview = state.preview;
          const totals = preview?.totals;

          return (
            <TabsContent key={entity} value={entity} className="space-y-6">
              <Card className="border-white/10 bg-slate-900/60 p-6">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground dark:text-white">{config.label}</h2>
                    <p className="text-sm text-slate-300">{config.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{config.helper}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadTemplate(entity)}
                      disabled={state.loading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download template
                    </Button>

                    <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                      <input
                        ref={(node) => {
                          inputRefs.current[entity] = node;
                        }}
                        type="file"
                        accept=".csv,text/csv"
                        className="sr-only"
                        onChange={(event) => handleFileChange(entity, event.target.files?.[0] ?? null)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => inputRefs.current[entity]?.click()}
                        disabled={state.loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload CSV
                      </Button>
                      {state.fileName && <span className="text-xs text-slate-400">{state.fileName}</span>}
                    </label>

                    {preview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(entity)}
                        disabled={state.loading || state.committing}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {state.error && (
                    <div className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{state.error}</span>
                    </div>
                  )}

                  {state.success && (
                    <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{state.success}</span>
                    </div>
                  )}
                </div>
              </Card>

              {preview ? (
                <Card className="border-white/10 bg-slate-900/60 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-300">
                        Parsed <strong>{totals?.total ?? 0}</strong> rows —{' '}
                        <span className="text-emerald-300">{totals?.valid ?? 0} valid</span>,{' '}
                        <span className="text-red-300">{totals?.invalid ?? 0} invalid</span>.
                      </p>
                      <p className="text-xs text-slate-400">
                        Review the parsed rows below. Invalid rows will not be imported until corrected in the CSV and re-uploaded.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCommit(entity)}
                      disabled={state.committing || state.loading || validRowCount === 0}
                    >
                      {state.committing ? 'Importing…' : `Import ${validRowCount} valid row${validRowCount === 1 ? '' : 's'}`}
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border/60 dark:border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-card/80 dark:bg-white/5">
                          <TableHead className="w-16 text-slate-200">Row</TableHead>
                          <TableHead className="w-28 text-slate-200">Status</TableHead>
                          {preview.headers.map((header) => (
                            <TableHead key={header} className="text-slate-200">
                              {header}
                            </TableHead>
                          ))}
                          <TableHead className="text-slate-200">Errors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.rows.map((row) => (
                          <TableRow key={row.index} className="border-white/5">
                            <TableCell className="text-sm text-slate-300">{row.index}</TableCell>
                            <TableCell>
                              {row.errors.length === 0 ? (
                                <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30">Valid</Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-500/40 bg-red-500/10 text-red-200">
                                  Invalid
                                </Badge>
                              )}
                            </TableCell>
                            {preview.headers.map((header) => (
                              <TableCell key={header} className="text-sm text-slate-200">
                                {renderValue(row.data[header]) || renderValue(row.raw[header])}
                              </TableCell>
                            ))}
                            <TableCell className="text-xs text-red-300">
                              {row.errors.length > 0 ? row.errors.join('; ') : ''}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              ) : (
                <Card className="border-dashed border-border/60 dark:border-white/10 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
                  <p>
                    Upload a CSV template to preview records before importing them into the database.
                  </p>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}



