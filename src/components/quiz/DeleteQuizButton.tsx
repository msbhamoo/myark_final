'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DeleteQuizButtonProps {
    quizId: string;
    quizTitle: string;
}

export default function DeleteQuizButton({ quizId, quizTitle }: DeleteQuizButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/quiz/${quizId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete quiz');
            }

            alert('Quiz deleted successfully!');
            router.refresh(); // Refresh the page to show updated list
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Failed to delete quiz. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex gap-2">
                <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button
                    onClick={() => setShowConfirm(false)}
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={() => setShowConfirm(true)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
            Delete
        </Button>
    );
}
