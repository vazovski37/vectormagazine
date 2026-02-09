import Header from '@/components/Header';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <Header />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <AnalyticsDashboard />
            </div>
        </div>
    );
}
