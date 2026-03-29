'use client';

import { useState } from 'react';
import { DuplicateOpportunityCheck } from './DuplicateOpportunityCheck';

interface TitleInputWithCheckProps {
  defaultValue?: string;
  name?: string;
  excludeId?: string;
}

export function TitleInputWithCheck({ defaultValue = '', name = 'title', excludeId }: TitleInputWithCheckProps) {
  const [title, setTitle] = useState(defaultValue);

  return (
    <div className="space-y-1">
      <input
        type="text"
        name={name}
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input bg-white dark:bg-white/5 dark:border-white/10 dark:text-white focus:ring-primary"
        placeholder="e.g. National Science Olympiad"
      />
      <DuplicateOpportunityCheck title={title} excludeId={excludeId} />
    </div>
  );
}
