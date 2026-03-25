'use client';

import { useState } from 'react';

interface ClassSelectorProps {
  initialClasses?: number[];
}

export function ClassSelector({ initialClasses = [] }: ClassSelectorProps) {
  const [selected, setSelected] = useState<number[]>(initialClasses);

  const toggleClass = (num: number) => {
    setSelected(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const selectAll = () => setSelected([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const clearAll = () => setSelected([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button 
          type="button" 
          onClick={selectAll}
          className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider"
        >
          Select All
        </button>
        <span className="text-gray-300">|</span>
        <button 
          type="button" 
          onClick={clearAll}
          className="text-[11px] font-bold text-gray-400 hover:text-gray-600 hover:underline uppercase tracking-wider"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
          <label 
            key={num} 
            className={`flex items-center justify-center gap-2 text-sm p-3 rounded-xl border transition-all cursor-pointer ${
              selected.includes(num) 
                ? 'bg-primary/5 border-primary text-primary font-bold' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
            }`}
          >
            <input 
              type="checkbox" 
              name="eligibility_classes" 
              value={num} 
              checked={selected.includes(num)}
              onChange={() => toggleClass(num)}
              className="hidden" 
            />
            Class {num}
          </label>
        ))}
      </div>
    </div>
  );
}
