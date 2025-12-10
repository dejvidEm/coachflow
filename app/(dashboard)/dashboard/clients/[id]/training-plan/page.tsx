import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { NewTrainingPlanContent } from '@/components/clients/new-training-plan-content';

export default async function NewTrainingPlanPage({
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

  return <NewTrainingPlanContent clientId={clientId} />;
}



