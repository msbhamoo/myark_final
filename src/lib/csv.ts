const needsQuoting = (value: string): boolean =>
  /[",\n\r]/.test(value);

const escapeCsvValue = (value: string): string => {
  if (!needsQuoting(value)) {
    return value;
  }
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const stringifyCsv = (headers: string[], rows: Array<string[]>): string => {
  const lines: string[] = [];
  lines.push(headers.map((header) => escapeCsvValue(header)).join(','));
  rows.forEach((row) => {
    const paddedRow = row.length < headers.length ? [...row, ...Array(headers.length - row.length).fill('')] : row;
    lines.push(paddedRow.map((value) => escapeCsvValue(value ?? '')).join(','));
  });
  return lines.join('\r\n');
};

export const parseCsv = (input: string): string[][] => {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;
  const pushField = () => {
    currentRow.push(currentField);
    currentField = '';
  };
  const pushRow = () => {
    rows.push(currentRow);
    currentRow = [];
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      pushField();
      continue;
    }

    if (char === '\r') {
      if (input[i + 1] === '\n') {
        i += 1;
      }
      pushField();
      pushRow();
      continue;
    }

    if (char === '\n') {
      pushField();
      pushRow();
      continue;
    }

    currentField += char;
  }

  pushField();
  pushRow();

  if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    if (lastRow.length === 1 && lastRow[0] === '') {
      rows.pop();
    }
  }

  return rows;
};

export const parseCsvWithHeaders = (
  input: string,
): { headers: string[]; records: Array<{ index: number; row: string[] }> } => {
  const rows = parseCsv(input);
  if (rows.length === 0) {
    return { headers: [], records: [] };
  }
  const headers = rows[0].map((header) => header.trim());
  const records = rows
    .slice(1)
    .map((row, index) => ({
      index: index + 2,
      row,
    }));
  return { headers, records };
};
