'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileX, Dumbbell, Clock } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DashboardStats {
  totalClients: number;
  clientsWithoutMealPlans: number;
  clientsWithoutTrainings: number;
  clientsWithOldPlans: number;
}

export function DashboardStats() {
  const { data: userData } = useSWR<{ id: number } | null>('/api/user', fetcher);
  const { data, error, isLoading } = useSWR<{ stats: DashboardStats }>(
    userData?.id ? '/api/dashboard/stats' : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats || {
    totalClients: 0,
    clientsWithoutMealPlans: 0,
    clientsWithoutTrainings: 0,
    clientsWithOldPlans: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Aktívny klienti</CardTitle>
            <Users className="h-5 w-5" style={{ color: '#44B080' }} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalClients}</p>
          <p className="text-sm text-gray-500 mt-1">Všetci klienti</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Klienti bez jedálničku</CardTitle>
            <FileX className="h-5 w-5" style={{ color: '#44B080' }} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.clientsWithoutMealPlans}</p>
          <p className="text-sm text-gray-500 mt-1">Potrebujú jedálniček</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Klienti bez tréningového plánu</CardTitle>
            <Dumbbell className="h-5 w-5" style={{ color: '#44B080' }} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.clientsWithoutTrainings}</p>
          <p className="text-sm text-gray-500 mt-1">Potrebujú tréningový plán</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Staré plány</CardTitle>
            <Clock className="h-5 w-5" style={{ color: '#44B080' }} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.clientsWithOldPlans}</p>
          <p className="text-sm text-gray-500 mt-1">Aktualizované &gt;30 dní dozadu</p>
        </CardContent>
      </Card>
    </div>
  );
}

