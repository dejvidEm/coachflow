import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientStatistics } from '@/lib/db/queries';

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated user.
 * Requires paid subscription.
 */
export async function GET(request: NextRequest) {
  try {
    await requirePaidSubscription();

    const stats = await getClientStatistics();
    return NextResponse.json({ stats });
  } catch (error: any) {
    if (error.message === 'User is not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (error.message === 'This feature requires a paid subscription') {
      return NextResponse.json(
        { error: 'This feature requires a paid subscription' },
        { status: 403 }
      );
    }
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

