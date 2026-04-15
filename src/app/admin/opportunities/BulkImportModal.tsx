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
        className="h-14 px-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-black shadow-lg shadow-black/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Bulk Import
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => { reset(); setIsOpen(true); }}
        className="h-14 px-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-black shadow-lg shadow-black/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Bulk Import
      </button>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in transition-all" onClick={() => setIsOpen(false)}>
        <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl uppercase tracking-widest text-[10px] text-gray-500 font-black">Step {step === 'upload' ? '1' : step === 'preview' ? '2' : '3'}</span>
              {step === 'upload' && 'Bulk Import'}
              {step === 'preview' && 'Preview & Validate'}
              {step === 'result' && 'Import Results'}
            </h2>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all text-2xl font-light">&times;</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-8">
            
            {/* STEP 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-6">
                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Import Guidelines
                  </h3>
                  <ol className="text-sm text-indigo-800 dark:text-indigo-400 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                    <li>Download the official CSV template</li>
                    <li>Ensure <strong>Title</strong> and <strong>Slug</strong> are unique</li>
                    <li><strong>Category</strong> and <strong>Organiser</strong> names must exist in the database</li>
                    <li>Dates should be in <code>YYYY-MM-DD</code> format</li>
                  </ol>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={downloadTemplate} className="btn bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all px-6 py-3 rounded-xl text-sm flex-1 flex items-center justify-center gap-2">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     CSV Template
                  </button>
                  
                  <div className="flex-1" />
                </div>

                <div className="group relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer overflow-hidden"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
                  <p className="text-base font-bold text-gray-900 dark:text-white mb-1">Upload Your File</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-medium tracking-wide">CLICK TO BROWSE OR DRAG CSV HERE</p>
                </div>
              </div>
            )}

            {/* STEP 2: Preview */}
            {step === 'preview' && (
              <div className="space-y-6">
                {/* Validation Summary */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-2xl p-6 animate-in slide-in-from-top-2">
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      Validation Errors ({validationErrors.length})
                    </h3>
                    <ul className="text-xs text-red-700 dark:text-red-400/80 space-y-1 max-h-40 overflow-auto font-medium pr-2">
                      {validationErrors.map((err, i) => <li key={i} className="flex gap-2"><span>•</span> {err}</li>)}
                    </ul>
                  </div>
                )}

                {validationErrors.length === 0 && (
                  <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-blue-800 dark:text-blue-400">All Checks Passed</p>
                      <p className="text-xs text-blue-700/70 dark:text-blue-400/60 font-medium">Ready to import {rows.length} records into the database.</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl">✓</div>
                  </div>
                )}

                {/* Preview Table */}
                <div className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto max-h-[380px]">
                    <table className="w-full text-[11px] whitespace-nowrap">
                      <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">ID</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">Title</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">Category</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">Organiser</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">Deadline</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-widest text-[9px]">Pub</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                        {rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 text-gray-400 font-mono italic">{i + 1}</td>
                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-white max-w-[200px] truncate">{row.title}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{row.category}</td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-500">{row.organiser}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-300 font-mono">{row.deadline || '—'}</td>
                            <td className="px-4 py-3">{row.is_published === 'false' || row.is_published === '0' ? '🌑' : '🌕'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Result */}
            {step === 'result' && importResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center transition-all hover:scale-[1.02]">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{importResult.success}</div>
                    <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Successful</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center transition-all hover:scale-[1.02]">
                    <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-1">{importResult.failed}</div>
                    <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Failed</p>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-400 mb-4 uppercase tracking-widest">Detailed Failure Report</h3>
                    <ul className="text-xs text-red-700 dark:text-red-400/70 space-y-2 max-h-48 overflow-auto font-medium pr-2">
                      {importResult.errors.map((err, i) => (
                        <li key={i} className="flex gap-3 items-start border-b border-red-100 dark:border-red-500/10 pb-2 last:border-0">
                           <span className="bg-red-100 dark:bg-red-500/20 px-1.5 rounded font-bold">R{err.row}</span>
                           <span className="flex-1">{err.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <button 
              onClick={() => { if (step === 'preview') { reset(); } else { setIsOpen(false); } }} 
              className="px-6 h-12 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:shadow-lg transition-all"
            >
              {step === 'preview' ? '← Back' : 'Close'}
            </button>

            {step === 'preview' && (
              <button
                onClick={handleImport}
                disabled={isImporting || validationErrors.some(e => e.startsWith('Missing'))}
                className="px-8 h-12 bg-[#0066FF] text-white font-bold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0050CC] shadow-xl hover:shadow-[#0066FF]/20 transition-all flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Importing...
                  </span>
                ) : `Process ${rows.length} Items`}
              </button>
            )}

            {step === 'result' && (
              <button onClick={() => { reset(); setIsOpen(false); window.location.reload(); }} className="px-8 h-12 bg-primary text-white font-bold rounded-xl text-sm shadow-xl transition-all">
                Done & Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
