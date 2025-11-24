/**
 * Track when a user views an opportunity
 * This should be called once when the opportunity detail page loads
 */
export async function trackOpportunityView(opportunityId: string): Promise<void> {
    try {
        // Get auth token from Firebase
        const { getFirebaseAuth } = await import('@/lib/firebaseClient');
        const auth = getFirebaseAuth();
        const user = auth.currentUser;

        if (!user) {
            // User not logged in, don't track
            return;
        }

        const token = await user.getIdToken();

        await fetch(`/api/opportunities/${opportunityId}/track-view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        // Silently fail - tracking is not critical
        console.error('Failed to track opportunity view:', error);
    }
}
