'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3, Users, Eye, TrendingUp, Calendar, ArrowUpRight,
    Smartphone, Monitor, Globe
} from 'lucide-react';
import { API_ENDPOINTS } from '@/services/endpoints';
import { fetchApi } from '@/services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface ChartData {
    date: string;
    views: number;
}

interface TopArticle {
    title: string;
    slug: string;
    views: number;
}

interface DeviceStat {
    name: string;
    value: number;
}

interface CountryStat {
    code: string;
    views: number;
}

interface DashboardData {
    period: string;
    summary: {
        total_views: number;
        unique_visitors: number;
    };
    chart_data: ChartData[];
    top_content: TopArticle[];
    device_breakdown: DeviceStat[];
    country_breakdown: CountryStat[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

export function AnalyticsDashboard() {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchStats();
    }, [days]);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await fetchApi<DashboardData>(`${API_ENDPOINTS.ANALYTICS.DASHBOARD}?days=${days}`);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!stats) return <div className="p-8 text-center text-muted-foreground">Failed to load data</div>;

    return (
        <div className="space-y-8">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your magazine's performance</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${days === d
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-slate-50'
                                }`}
                        >
                            {d} days
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Eye className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +12%
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Total Views</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.summary.total_views.toLocaleString()}</h3>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Unique Visitors</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.summary.unique_visitors.toLocaleString()}</h3>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                            <Smartphone className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Mobile Traffic</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">
                        {Math.round((stats.device_breakdown.find(d => d.name === 'mobile')?.value || 0) / (stats.summary.total_views || 1) * 100)}%
                    </h3>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                            <Globe className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Top Country</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">
                        {stats.country_breakdown[0]?.code || 'N/A'}
                    </h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900">Traffic Overview</h3>
                            <p className="text-sm text-muted-foreground">Daily views over the selected period</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chart_data}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val: string) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(val: string) => new Date(val).toLocaleDateString()}
                                />
                                <Area type="monotone" dataKey="views" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Device Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.device_breakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.device_breakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Content */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Top Articles</h3>
                    <div className="space-y-4">
                        {stats.top_content.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No data available yet</p>
                        ) : (
                            stats.top_content.map((article, i) => (
                                <div key={article.slug} className="flex items-start gap-3 group border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                                    <div className="flex-shrink-0 w-6 text-center text-sm font-bold text-muted-foreground mt-0.5">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors cursor-default" title={article.title}>
                                            {article.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {article.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={`/editor?slug=${article.slug}`}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Top Countries</h3>
                    <div className="space-y-4">
                        {stats.country_breakdown.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No data available yet</p>
                        ) : (
                            stats.country_breakdown.map((country, i) => (
                                <div key={country.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-500 w-4">{i + 1}</span>
                                        <span className="font-medium text-slate-900">{country.code}</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">{country.views} views</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
