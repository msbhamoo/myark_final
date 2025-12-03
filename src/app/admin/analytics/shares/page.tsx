'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, MousePointerClick, TrendingUp, Users } from 'lucide-react';

interface AnalyticsData {
    totalShares: number;
    totalClicks: number;
    totalConversions: number;
    clickThroughRate: number;
    conversionRate: number;
    shareBreakdown: {
        authenticated: number;
        anonymous: number;
    };
    conversionBreakdown: {
        viewed: number;
        registered: number;
        bookmarked: number;
    };
    topSharers: Array<{
        userId: string;
        userName: string;
        userEmail: string;
        shares: number;
        clicks: number;
        conversions: number;
        conversionRate: number;
    }>;
    recentShares: any[];
    sharesOverTime: Array<{
        date: string;
        shares: number;
        clicks: number;
        conversions: number;
    }>;
}

export default function ShareAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/shares/analytics');
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const analytics = await response.json();
            setData(analytics);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!data) return;

        const csv = [
            ['Rank', 'User', 'Email', 'Shares', 'Clicks', 'Conversions', 'Conversion Rate %'],
            ...data.topSharers.map((user, index) => [
                index + 1,
                user.userName,
                user.userEmail,
                user.shares,
                user.clicks,
                user.conversions,
                user.conversionRate.toFixed(1),
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `share-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading analytics...</div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-600">Error: {error || 'No data available'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Share Analytics</h1>
                    <p className="text-gray-600 mt-1">Track and analyze opportunity shares</p>
                </div>
                <Button onClick={exportCSV} variant="outline">
                    📥 Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Shares</p>
                            <p className="text-3xl font-bold mt-2">{data.totalShares}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {data.shareBreakdown.authenticated} auth, {data.shareBreakdown.anonymous} anon
                            </p>
                        </div>
                        <Share2 className="h-12 w-12 text-blue-500 opacity-20" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Clicks</p>
                            <p className="text-3xl font-bold mt-2">{data.totalClicks}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                From shared links
                            </p>
                        </div>
                        <MousePointerClick className="h-12 w-12 text-green-500 opacity-20" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Click-Through Rate</p>
                            <p className="text-3xl font-bold mt-2">{data.clickThroughRate}%</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Clicks per share
                            </p>
                        </div>
                        <TrendingUp className="h-12 w-12 text-purple-500 opacity-20" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Conversion Rate</p>
                            <p className="text-3xl font-bold mt-2">{data.conversionRate}%</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {data.totalConversions} total conversions
                            </p>
                        </div>
                        <Users className="h-12 w-12 text-orange-500 opacity-20" />
                    </div>
                </Card>
            </div>

            {/* Conversion Breakdown */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Conversion Breakdown</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{data.conversionBreakdown.viewed}</p>
                        <p className="text-sm text-gray-600 mt-1">Viewed</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{data.conversionBreakdown.registered}</p>
                        <p className="text-sm text-gray-600 mt-1">Registered</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{data.conversionBreakdown.bookmarked}</p>
                        <p className="text-sm text-gray-600 mt-1">Bookmarked</p>
                    </div>
                </div>
            </Card>

            {/* Top Sharers Leaderboard */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">🏆 Top Sharers Leaderboard</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 text-sm font-semibold">Rank</th>
                                <th className="text-left p-3 text-sm font-semibold">User</th>
                                <th className="text-right p-3 text-sm font-semibold">Shares</th>
                                <th className="text-right p-3 text-sm font-semibold">Clicks</th>
                                <th className="text-right p-3 text-sm font-semibold">Conversions</th>
                                <th className="text-right p-3 text-sm font-semibold">Conv. Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topSharers.map((user, index) => (
                                <tr key={user.userId} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <span className="font-bold">
                                            {index === 0 && '🥇'}
                                            {index === 1 && '🥈'}
                                            {index === 2 && '🥉'}
                                            {index > 2 && `#${index + 1}`}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div>
                                            <p className="font-medium">{user.userName}</p>
                                            <p className="text-sm text-gray-500">{user.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="text-right p-3 font-semibold">{user.shares}</td>
                                    <td className="text-right p-3">{user.clicks}</td>
                                    <td className="text-right p-3">{user.conversions}</td>
                                    <td className="text-right p-3">
                                        <span className={`font-semibold ${user.conversionRate > 50 ? 'text-green-600' :
                                                user.conversionRate > 25 ? 'text-yellow-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {user.conversionRate.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.topSharers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No share data available yet</p>
                )}
            </Card>
        </div>
    );
}
