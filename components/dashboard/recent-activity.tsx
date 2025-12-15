'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, UserCircle } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Client } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fitnessGoalLabels: Record<string, string> = {
  mass_gain: 'Mass Gain',
  weight_loss: 'Weight Loss',
  maintain: 'Maintain',
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const getGenderColors = (gender: string | null) => {
  if (!gender) return { bg: '#E5E5E520', icon: '#9CA3AF' };
  
  const genderLower = gender.toLowerCase();
  if (genderLower === 'male' || genderLower === 'm') {
    return { bg: '#3B82F620', icon: '#3B82F6' };
  } else if (genderLower === 'female' || genderLower === 'f') {
    return { bg: '#EC489920', icon: '#EC4899' };
  } else {
    return { bg: '#E5E5E520', icon: '#9CA3AF' };
  }
};

export function RecentActivity() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<{ clients: Client[] }>(
    '/api/clients',
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading recent activity...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading recent activity</p>
        </CardContent>
      </Card>
    );
  }

  const clients = data?.clients || [];

  // Sort by updated_at (most recent first) and take top 10
  const recentClients = [...clients]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 10);

  if (recentClients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: '#44B080' }} />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" style={{ color: '#44B080' }} />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Goal
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentClients.map((client: any) => {
                const genderColors = getGenderColors(client.gender);
                const hasMealPlan = client.hasMealPdf === true;
                const hasTrainingPlan = client.hasTrainingPdf === true;
                
                return (
                  <tr
                    key={client.id}
                    onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: genderColors.bg }}
                        >
                          <UserCircle className="w-5 h-5" style={{ color: genderColors.icon }} />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{client.name}</div>
                          {client.email && (
                            <div className="text-xs text-gray-500">{client.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 
                            client.fitnessGoal === 'mass_gain' ? '#B4E5FF' :
                            client.fitnessGoal === 'weight_loss' ? '#FFB4E5' :
                            '#E5FFB4',
                          color: '#333',
                        }}
                      >
                        {fitnessGoalLabels[client.fitnessGoal] || client.fitnessGoal}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        {hasMealPlan && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            Meal
                          </span>
                        )}
                        {hasTrainingPlan && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            Training
                          </span>
                        )}
                        {!hasMealPlan && !hasTrainingPlan && (
                          <span className="text-xs text-gray-400">No plans</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="text-xs text-gray-600">
                        {formatDate(client.updatedAt)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

