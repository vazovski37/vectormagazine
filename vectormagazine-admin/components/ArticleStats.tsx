'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '@/services/endpoints';
import { fetchApi } from '@/services/api';

interface ChartData {
    date: string;
    views: number;
}

interface StatsData {
    period: string;
    summary: {
        views: number;
        unique_visitors: number;
    };
    chart_data: ChartData[];
}

export function ArticleStats({ articleId }: { articleId: number | null }) {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [days, setDays] = useState(30);

    useEffect(() => {
        if (articleId) {
            fetchStats();
        }
    }, [articleId, days]);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await fetchApi<StatsData>(`${API_ENDPOINTS.ANALYTICS.ARTICLE(articleId!)}?days=${days}`);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!articleId) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                Save article to view statistics
            </div>
        );
    }

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!stats) return null;

    const maxViews = Math.max(...stats.chart_data.map(d => d.views), 1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Performance</span>
                </div>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="text-xs border rounded px-2 py-1 bg-transparent hover:bg-muted transition-colors"
                >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                </select>
            </div>

            {/* key Metrics */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Views</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.summary.views}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Visitors</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.summary.unique_visitors}</p>
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Views over time</p>
                <div className="h-32 flex items-end gap-1 pt-4 pb-2">
                    {stats.chart_data.map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group relative">
                            <div
                                className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm min-h-[4px]"
                                style={{ height: `${(item.views / maxViews) * 100}%` }}
                            ></div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                                <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {item.views}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
