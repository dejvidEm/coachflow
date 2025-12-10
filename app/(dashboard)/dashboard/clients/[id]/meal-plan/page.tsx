import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { NewMealPlanContent } from '@/components/clients/new-meal-plan-content';

export default async function NewMealPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // First check authentication
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Then check if user has a paid subscription
  const team = await getTeamForUser(user.id);
  const hasPaidPlan = team?.subscriptionStatus === 'active' || team?.subscriptionStatus === 'trialing';

  if (!hasPaidPlan) {
    // Redirect unpaid users back to dashboard
    redirect('/dashboard');
  }

  const { id } = await params;
  const clientId = parseInt(id);

  if (isNaN(clientId)) {
    redirect('/dashboard/clients');
  }

  return <NewMealPlanContent clientId={clientId} />;
}



