'use client';

import { useState } from 'react';
import { DuplicateOrganiserCheck } from './DuplicateOrganiserCheck';

interface NameInputWithCheckOrganiserProps {
  defaultValue?: string;
  name?: string;
  excludeId?: string;
  className?: string;
}

export function NameInputWithCheckOrganiser({ defaultValue = '', name = 'name', excludeId, className = 'input' }: NameInputWithCheckOrganiserProps) {
  const [organizerName, setOrganizerName] = useState(defaultValue);

  return (
    <div className="space-y-1">
      <input
        type="text"
        name={name}
        required
        value={organizerName}
        onChange={(e) => setOrganizerName(e.target.value)}
        className={className}
        placeholder="e.g. Science Olympiad Foundation (SOF)"
      />
      <DuplicateOrganiserCheck name={organizerName} excludeId={excludeId} />
    </div>
  );
}
