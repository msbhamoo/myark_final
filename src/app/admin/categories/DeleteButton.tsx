'use client';
import { deleteCategory } from './actions';

export function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
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
