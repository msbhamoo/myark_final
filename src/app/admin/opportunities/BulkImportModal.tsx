'use client';

import { useState, useRef, useCallback } from 'react';
import { bulkImportOpportunities, BulkImportRow, BulkImportResult } from './actions';

const CSV_HEADERS = [
  'title', 'slug', 'category', 'organiser', 'description',
  'eligibility_text', 'eligibility_classes', 'registration_url',
  'registration_opens', 'deadline', 'is_ongoing',
  'fee_text', 'prize_text', 'how_to_apply',
  'is_published', 'is_verified'
];

const TEMPLATE_CSV = CSV_HEADERS.join(',') + '\n' +
  '"National Science Olympiad","national-science-olympiad","Olympiad","Science Olympiad Foundation","A national level science competition","Students of class 1 to 12","1,2,3,4,5,6,7,8,9,10,11,12","https://example.com","2025-01-01","2025-06-30","false","INR 150","Medals and Certificates","Visit the website and register","true","true"\n';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current.trim());
        current = '';
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        row.push(current.trim());
        current = '';
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
        if (ch === '\r') i++;
      } else {
        current += ch;
      }
    }
  }
  // Last row
  row.push(current.trim());
  if (row.some(cell => cell !== '')) rows.push(row);

  return rows;
}

function validateRow(row: BulkImportRow, index: number): string[] {
  const errors: string[] = [];
  if (!row.title?.trim()) errors.push(`Row ${index + 2}: Title is required`);
  if (!row.slug?.trim()) errors.push(`Row ${index + 2}: Slug is required`);
  if (!row.registration_url?.trim()) errors.push(`Row ${index + 2}: Registration URL is required`);
  if (!row.category?.trim()) errors.push(`Row ${index + 2}: Category is required`);
  if (!row.organiser?.trim()) errors.push(`Row ${index + 2}: Organiser is required`);
  return errors;
}

export function BulkImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [rows, setRows] = useState<BulkImportRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep('upload');
    setRows([]);
    setValidationErrors([]);
    setImportResult(null);
    setIsImporting(false);
  }, []);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myark_opportunities_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSV(text);

      if (parsed.length < 2) {
        setValidationErrors(['File must have a header row and at least one data row.']);
        return;
      }

      // Map header row to data
      const headers = parsed[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
      const dataRows = parsed.slice(1);

      const mappedRows: BulkImportRow[] = dataRows.map(cells => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = cells[i] || ''; });
        return obj as unknown as BulkImportRow;
      });

      // Validate
      const allErrors: string[] = [];

      // Check required headers
      const requiredHeaders = ['title', 'slug', 'category', 'organiser', 'registration_url'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        allErrors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      mappedRows.forEach((row, i) => {
        allErrors.push(...validateRow(row, i));
      });

      setValidationErrors(allErrors);
      setRows(mappedRows);
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await bulkImportOpportunities(rows);
      setImportResult(result);
      setStep('result');
    } catch {
      setImportResult({ success: 0, failed: rows.length, errors: [{ row: 0, message: 'Import failed unexpectedly' }] });
      setStep('result');
    }
    setIsImporting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { reset(); setIsOpen(true); }}
        className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50"
      >
        📥 Bulk Import
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => { reset(); setIsOpen(true); }}
        className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50"
      >
        📥 Bulk Import
      </button>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsOpen(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'upload' && '📥 Bulk Import Opportunities'}
              {step === 'preview' && '👀 Preview & Validate'}
              {step === 'result' && '✅ Import Results'}
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            
            {/* STEP 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">How it works</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Download the CSV template below</li>
                    <li>Fill in your opportunity data (one row per opportunity)</li>
                    <li>Upload the file — we&apos;ll validate before importing</li>
                    <li><strong>Category</strong> and <strong>Organiser</strong> must match existing names exactly</li>
                  </ol>
                </div>

                <button onClick={downloadTemplate} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                  📄 Download CSV Template
                </button>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#1b5e28] hover:bg-green-50/30 transition-colors cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Click to upload your CSV file</p>
                  <p className="text-xs text-gray-500">or drag and drop (CSV only)</p>
                </div>
              </div>
            )}

            {/* STEP 2: Preview */}
            {step === 'preview' && (
              <div className="space-y-4">
                {/* Validation Summary */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ Validation Issues ({validationErrors.length})</h3>
                    <ul className="text-xs text-red-700 space-y-0.5 max-h-32 overflow-auto">
                      {validationErrors.map((err, i) => <li key={i}>• {err}</li>)}
                    </ul>
                  </div>
                )}

                {validationErrors.length === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-green-800">✅ All {rows.length} row(s) passed validation</p>
                  </div>
                )}

                {/* Preview Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[360px]">
                    <table className="w-full text-xs whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">#</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Slug</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Category</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Organiser</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Deadline</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Fee</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Published</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-gray-900 max-w-[200px] truncate">{row.title}</td>
                            <td className="px-3 py-2 text-gray-500">{row.slug}</td>
                            <td className="px-3 py-2">{row.category}</td>
                            <td className="px-3 py-2">{row.organiser}</td>
                            <td className="px-3 py-2">{row.deadline || '—'}</td>
                            <td className="px-3 py-2">{row.fee_text || 'Free'}</td>
                            <td className="px-3 py-2">{row.is_published === 'false' || row.is_published === '0' ? '❌' : '✅'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-gray-500">Showing {rows.length} row(s) ready to import.</p>
              </div>
            )}

            {/* STEP 3: Result */}
            {step === 'result' && importResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-green-700">{importResult.success}</p>
                    <p className="text-sm text-green-600 font-medium">Imported successfully</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-red-700">{importResult.failed}</p>
                    <p className="text-sm text-red-600 font-medium">Failed</p>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-2">Error Details</h3>
                    <ul className="text-xs text-red-700 space-y-0.5 max-h-40 overflow-auto">
                      {importResult.errors.map((err, i) => (
                        <li key={i}>• Row {err.row}: {err.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button onClick={() => { if (step === 'preview') { reset(); } else { setIsOpen(false); } }} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
              {step === 'preview' ? '← Back' : 'Close'}
            </button>

            {step === 'preview' && (
              <button
                onClick={handleImport}
                disabled={isImporting || validationErrors.some(e => e.startsWith('Missing'))}
                className="btn btn-primary bg-[#1b5e28] text-white hover:bg-[#14461e] disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {isImporting ? 'Importing...' : `Import ${rows.length} Opportunities`}
              </button>
            )}

            {step === 'result' && (
              <button onClick={() => { reset(); setIsOpen(false); window.location.reload(); }} className="btn btn-primary bg-[#1b5e28] text-white hover:bg-[#14461e] px-8">
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
