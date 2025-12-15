'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ActivityData {
  date: string;
  value: number;
}

export function ActivityGraph() {
  const { data: userData } = useSWR<{ id: number } | null>('/api/user', fetcher);
  const { data, error, isLoading, mutate: revalidate } = useSWR<{ activity: ActivityData[] }>(
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
            <TrendingUp className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Activity Overview</CardTitle>
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
            <TrendingUp className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Activity Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading chart data</p>
        </CardContent>
      </Card>
    );
  }

  // Get activity data from stats or use mock data for demonstration
  const activityData = data?.activity || [];
  
  // If no data, show empty state
  if (activityData.length === 0) {
    // Generate sample data for demonstration
    const sampleData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 10) + 1,
      };
    });

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Activity Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#44B080" 
                  strokeWidth={2}
                  dot={{ fill: '#44B080', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Sample data - Activity tracking coming soon
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = activityData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" style={{ color: '#44B080' }} />
          <CardTitle>Activity Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#44B080" 
                strokeWidth={2}
                dot={{ fill: '#44B080', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

