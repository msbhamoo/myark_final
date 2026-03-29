'use client';

import { useState } from 'react';
import { DuplicateCareerCheck } from './DuplicateCareerCheck';

interface NameInputWithCheckCareerProps {
  defaultValue?: string;
  name?: string;
  excludeId?: string;
  className?: string;
}

export function NameInputWithCheckCareer({ defaultValue = '', name = 'name', excludeId, className = 'input' }: NameInputWithCheckCareerProps) {
  const [careerName, setCareerName] = useState(defaultValue);

  return (
    <div className="space-y-1">
      <input
        type="text"
        name={name}
        required
        value={careerName}
        onChange={(e) => setCareerName(e.target.value)}
        className={className}
        placeholder="e.g. Artificial Intelligence Engineer"
      />
      <DuplicateCareerCheck name={careerName} excludeId={excludeId} />
    </div>
  );
}
