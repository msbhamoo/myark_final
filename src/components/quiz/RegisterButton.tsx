'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterButton({ quizId, requiresRegistration }: { quizId: string; requiresRegistration: boolean }) {
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setLoading(true);
        try {
            // TODO: Get actual user ID from session
            const userId = 'user-' + Date.now(); // Replace with actual user ID
            const userName = 'Test User'; // Replace with actual user name
            const userEmail = 'test@example.com'; // Replace with actual email

            const response = await fetch(`/api/quiz/${quizId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userName, userEmail }),
            });

            const data = await response.json();

            if (data.success) {
                setRegistered(true);
                alert('✅ Successfully registered! You can now attempt the quiz.');
                router.refresh(); // Refresh to update UI
            } else {
                alert(data.error || 'Failed to register');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!requiresRegistration) {
        return null;
    }

    return (
        <button
            onClick={handleRegister}
            disabled={loading || registered}
            className={`flex-1 px-8 py-4 rounded-lg transition-all shadow-lg font-semibold text-lg ${registered
                    ? 'bg-green-500 text-white cursor-default'
                    : loading
                        ? 'bg-gray-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                }`}
        >
            {loading ? '⏳ Registering...' : registered ? '✅ Registered!' : '📝 Register for Quiz'}
        </button>
    );
}
