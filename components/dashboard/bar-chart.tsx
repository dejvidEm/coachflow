'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BarChartData {
  category: string;
  value: number;
}

export function DashboardBarChart() {
  const { data: userData } = useSWR<{ id: number } | null>('/api/user', fetcher);
  const { data, error, isLoading, mutate: revalidate } = useSWR<{ chartData: BarChartData[] }>(
    userData?.id ? '/api/dashboard/stats' : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

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
            <BarChart3 className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Mesačná aktivita</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Mesačná aktivita</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading chart data</p>
        </CardContent>
      </Card>
    );
  }

  // Sample data for demonstration
  const chartData = data?.chartData || [
    { category: 'Jan', value: 12 },
    { category: 'Feb', value: 19 },
    { category: 'Mar', value: 15 },
    { category: 'Apr', value: 25 },
    { category: 'May', value: 22 },
    { category: 'Jun', value: 30 },
    { category: 'Jul', value: 28 },
    { category: 'Aug', value: 35 },
    { category: 'Sep', value: 32 },
    { category: 'Oct', value: 40 },
    { category: 'Nov', value: 38 },
    { category: 'Dec', value: 45 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" style={{ color: '#44B080' }} />
          <CardTitle>Mesačná aktivita</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#44B080"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Activity metrics by month
        </p>
      </CardContent>
    </Card>
  );
}

