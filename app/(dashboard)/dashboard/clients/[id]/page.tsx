import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { ClientDetailContent } from '@/components/clients/client-detail-content';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Optimized: Get user and team in parallel
  const [user, { id }] = await Promise.all([
    getUser(),
    params.then(p => ({ id: p.id }))
  ]);

  if (!user) {
    redirect('/sign-in');
  }

  const clientId = parseInt(id);
  if (isNaN(clientId)) {
    redirect('/dashboard/clients');
  }

  // Check subscription (this is fast with optimized getTeamForUser)
  const team = await getTeamForUser(user.id);
  const hasPaidPlan = team?.subscriptionStatus === 'active' || team?.subscriptionStatus === 'trialing';

  if (!hasPaidPlan) {
    redirect('/dashboard');
  }

  return <ClientDetailContent clientId={clientId} />;
}

