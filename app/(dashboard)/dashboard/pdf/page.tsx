import { redirect } from 'next/navigation';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { PdfPagesContent } from '@/components/pdf/pdf-pages-content';

export default async function PdfPagesPage() {
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

  return <PdfPagesContent />;
}
