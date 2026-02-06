
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

import { Subscriber, SubscribersResponse } from '@/types/subscriber';

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const data = await api.get<SubscribersResponse>('/api/subscribers');
            setSubscribers(data.subscribers);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subscribers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Newsletter Subscribers</h1>

            {loading && <p>Loading subscribers...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-card border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted border-b">
                            <tr>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Subscribed Date</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-muted/50">
                                    <td className="p-4">{sub.id}</td>
                                    <td className="p-4 font-medium">{sub.email}</td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {sub.is_active ? 'Active' : 'Unsubscribed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No subscribers yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
