'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ClientStats {
  totalClients: number;
  clientsByGoal: Array<{
    goal: string;
    count: number;
  }>;
  clientsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

const goalLabels: Record<string, string> = {
  mass_gain: 'Mass Gain',
  weight_loss: 'Weight Loss',
  maintain: 'Maintain',
};

export function ClientsGraph() {
  const { data: userData } = useSWR<{ id: number } | null>('/api/user', fetcher);
  const { data, error, isLoading, mutate: revalidate } = useSWR<{ stats: ClientStats }>(
    userData?.id ? '/api/dashboard/stats' : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  // Revalidate when user changes
  useEffect(() => {
    if (userData?.id) {
      revalidate();
    }
  }, [userData?.id, revalidate]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>My Clients</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>My Clients</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading statistics</p>
        </CardContent>
      </Card>
    );
  }

  const stats = data?.stats;
  if (!stats) {
    return null;
  }

  const maxCount = Math.max(
    ...stats.clientsByGoal.map(g => g.count),
    ...stats.clientsOverTime.map(t => t.count),
    1
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: '#44B080' }} />
          <CardTitle>My Clients</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Clients */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold mb-2" style={{ color: '#44B080' }}>
              {stats.totalClients}
            </div>
            <div className="text-sm text-gray-600">
              {stats.totalClients === 1 ? 'Client' : 'Clients'} Total
            </div>
          </div>

          {/* Clients by Fitness Goal */}
          {stats.clientsByGoal.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Clients by Fitness Goal
              </h3>
              <div className="space-y-3">
                {stats.clientsByGoal.map((item) => {
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  return (
                    <div key={item.goal} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {goalLabels[item.goal] || item.goal}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: '#44B080',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients Over Time (Last 30 Days) */}
          {stats.clientsOverTime.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Clients Added (Last 30 Days)
              </h3>
              <div className="space-y-2">
                {stats.clientsOverTime.map((item) => {
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  const date = new Date(item.date);
                  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <div key={item.date} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{formattedDate}</span>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: '#44B080',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stats.totalClients === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No clients yet</p>
              <p className="text-sm mt-1">Start adding clients to see statistics here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
