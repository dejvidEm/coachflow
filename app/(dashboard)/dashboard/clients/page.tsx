import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { ClientsPageContent } from '@/components/clients/clients-page-content';

export default async function ClientsPage() {
  // First check authentication
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Then check if user has a paid subscription
  const team = await getTeamForUser();
  const hasPaidPlan = team?.subscriptionStatus === 'active' || team?.subscriptionStatus === 'trialing';

  if (!hasPaidPlan) {
    // Redirect unpaid users back to dashboard
    redirect('/dashboard');
  }

  return <ClientsPageContent />;
}
