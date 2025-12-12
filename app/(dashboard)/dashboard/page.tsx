import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { ClientsGraph } from '@/components/dashboard/clients-graph';
import { DashboardWrapper } from '@/components/onboarding/dashboard-wrapper';

export default async function DashboardPage() {
  // First check authentication
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Then check if user has a paid subscription
  const team = await getTeamForUser();
  const hasPaidPlan = team?.subscriptionStatus === 'active' || team?.subscriptionStatus === 'trialing';

  if (!hasPaidPlan) {
    // Redirect unpaid users to settings
    redirect('/dashboard/settings/team');
  }

  return (
    <DashboardWrapper>
      <section className="flex-1 p-4 lg:p-8" data-onboarding="dashboard">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
          {user.name ? `Welcome back, ${user.name}` : 'Welcome back'}
        </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5" style={{ color: '#44B080' }} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Active Sessions</CardTitle>
              <Activity className="h-5 w-5" style={{ color: '#44B080' }} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-5 w-5" style={{ color: '#44B080' }} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0%</p>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientsGraph />
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" style={{ color: '#44B080' }} />
              <CardTitle>Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Welcome to your dashboard! Analytics and graphs will be displayed here.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              More charts and detailed analytics coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
    </DashboardWrapper>
  );
}
