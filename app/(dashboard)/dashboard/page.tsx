import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { DashboardBarChart } from '@/components/dashboard/bar-chart';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentActivity } from '@/components/dashboard/recent-activity';
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
      
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardBarChart />
        <RecentActivity />
      </div>
    </section>
    </DashboardWrapper>
  );
}
