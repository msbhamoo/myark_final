'use client';
import { deleteOrganiser } from './actions';

export function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this organiser?')) {
      await deleteOrganiser(id);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium"
    >
      Delete
    </button>
  );
}
