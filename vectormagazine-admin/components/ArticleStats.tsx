'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

            // Calculate date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);
            const startDateStr = startDate.toISOString();

            // Fetch analytics data for this article
            const { data: rawData, error } = await supabase
                .from('analytics')
                .select('*')
                .eq('path', `/article/${articleId}`) // Assuming the path contains the article ID
                .gte('timestamp', startDateStr)
                .order('timestamp', { ascending: true });

            if (error) throw error;

            // Format into expected stats format
            const uniqueVisitors = new Set((rawData || []).map(r => r.session_id || r.ip_address)).size;

            // Group by date for chart
            const chartDataMap = new Map<string, number>();

            // Pre-fill days with 0
            for (let d = 0; d < days; d++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + d);
                chartDataMap.set(date.toISOString().split('T')[0], 0);
            }

            (rawData || []).forEach(row => {
                const dateKey = new Date(row.timestamp).toISOString().split('T')[0];
                if (chartDataMap.has(dateKey)) {
                    chartDataMap.set(dateKey, chartDataMap.get(dateKey)! + 1);
                }
            });

            const chart_data = Array.from(chartDataMap.entries()).map(([date, views]) => ({ date, views }));

            setStats({
                period: `${days} days`,
                summary: {
                    views: rawData?.length || 0,
                    unique_visitors: uniqueVisitors
                },
                chart_data
            });
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
