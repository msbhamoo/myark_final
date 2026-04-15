'use client';

import { useState, useRef, useCallback } from 'react';
import { bulkImportOrganisers, BulkOrganiserRow, BulkOrganiserResult } from './actions';

const CSV_HEADERS = ['name', 'slug', 'description', 'website_url'];

const TEMPLATE_CSV = CSV_HEADERS.join(',') + '\n' +
  '"Science Olympiad Foundation","science-olympiad-foundation","National body conducting science olympiads","https://sofworld.org"\n' +
  '"CBSE","cbse","Central Board of Secondary Education","https://cbse.gov.in"\n';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(current.trim()); current = ''; }
      else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        row.push(current.trim()); current = '';
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
        if (ch === '\r') i++;
      } else { current += ch; }
    }
  }
  row.push(current.trim());
  if (row.some(cell => cell !== '')) rows.push(row);
  return rows;
}

export function BulkImportOrganisersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [rows, setRows] = useState<BulkOrganiserRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<BulkOrganiserResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep('upload'); setRows([]); setValidationErrors([]); setImportResult(null); setIsImporting(false);
  }, []);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'myark_organisers_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length < 2) { setValidationErrors(['File must have a header row and at least one data row.']); return; }

      const headers = parsed[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
      const dataRows = parsed.slice(1);
      const mappedRows: BulkOrganiserRow[] = dataRows.map(cells => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = cells[i] || ''; });
        return obj as unknown as BulkOrganiserRow;
      });

      const allErrors: string[] = [];
      if (!headers.includes('name')) allErrors.push('Missing required column: name');
      if (!headers.includes('slug')) allErrors.push('Missing required column: slug');
      mappedRows.forEach((row, i) => {
        if (!row.name?.trim()) allErrors.push(`Row ${i + 2}: Name is required`);
        if (!row.slug?.trim()) allErrors.push(`Row ${i + 2}: Slug is required`);
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
      const result = await bulkImportOrganisers(rows);
      setImportResult(result); setStep('result');
    } catch {
      setImportResult({ success: 0, failed: rows.length, errors: [{ row: 0, message: 'Import failed unexpectedly' }] });
      setStep('result');
    }
    setIsImporting(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => { reset(); setIsOpen(true); }} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
        📥 Bulk Import
      </button>
    );
  }

  return (
    <>
      <button onClick={() => { reset(); setIsOpen(true); }} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
        📥 Bulk Import
      </button>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsOpen(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'upload' && '📥 Bulk Import Organisers'}
              {step === 'preview' && '👀 Preview & Validate'}
              {step === 'result' && '✅ Import Results'}
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {step === 'upload' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">CSV Format</h3>
                  <p className="text-sm text-blue-800">Columns: <code className="bg-blue-100 px-1 rounded">name, slug, description, website_url</code></p>
                  <p className="text-xs text-blue-700 mt-1">Only <strong>name</strong> and <strong>slug</strong> are required. Description and website are optional.</p>
                </div>
                <button onClick={downloadTemplate} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                  📄 Download CSV Template
                </button>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#0066FF] hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Click to upload your CSV file</p>
                  <p className="text-xs text-gray-500">CSV only</p>
                </div>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-4">
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ Validation Issues</h3>
                    <ul className="text-xs text-red-700 space-y-0.5 max-h-32 overflow-auto">
                      {validationErrors.map((err, i) => <li key={i}>• {err}</li>)}
                    </ul>
                  </div>
                )}
                {validationErrors.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-blue-800">✅ All {rows.length} row(s) passed validation</p>
                  </div>
                )}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[360px]">
                    <table className="w-full text-xs whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">#</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Name</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Slug</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Description</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Website</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-gray-900">{row.name}</td>
                            <td className="px-3 py-2 text-gray-500">{row.slug}</td>
                            <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate">{row.description || '—'}</td>
                            <td className="px-3 py-2 text-gray-500 max-w-[150px] truncate">{row.website_url || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {step === 'result' && importResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-blue-700">{importResult.success}</p>
                    <p className="text-sm text-blue-600 font-medium">Imported</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-red-700">{importResult.failed}</p>
                    <p className="text-sm text-red-600 font-medium">Failed</p>
                  </div>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <ul className="text-xs text-red-700 space-y-0.5 max-h-40 overflow-auto">
                      {importResult.errors.map((err, i) => <li key={i}>• Row {err.row}: {err.message}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button onClick={() => { if (step === 'preview') reset(); else setIsOpen(false); }} className="btn bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50">
              {step === 'preview' ? '← Back' : 'Close'}
            </button>
            {step === 'preview' && (
              <button onClick={handleImport} disabled={isImporting || validationErrors.some(e => e.startsWith('Missing'))} className="btn btn-primary bg-[#0066FF] text-white hover:bg-[#0050CC] disabled:opacity-50 px-8">
                {isImporting ? 'Importing...' : `Import ${rows.length} Organisers`}
              </button>
            )}
            {step === 'result' && (
              <button onClick={() => { reset(); setIsOpen(false); window.location.reload(); }} className="btn btn-primary bg-[#0066FF] text-white hover:bg-[#0050CC] px-8">Done</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
