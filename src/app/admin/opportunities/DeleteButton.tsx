'use client';

import { useTransition } from 'react';
import { deleteOpportunity } from './actions';

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => {
        if (confirm('Are you sure you want to delete this opportunity?')) {
          startTransition(() => deleteOpportunity(id));
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
