import { z } from 'zod';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: User
) => Promise<T>;

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const user = await getUser();
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData, user);
  };
}

type ActionWithTeamFunction<T> = (
  formData: FormData,
  team: TeamDataWithMembers
) => Promise<T>;

export function withTeam<T>(action: ActionWithTeamFunction<T>) {
  return async (formData: FormData): Promise<T> => {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    const team = await getTeamForUser();
    if (!team) {
      throw new Error('Team not found');
    }

    return action(formData, team);
  };
}

/**
 * Checks if the current user has a paid subscription (active or trialing).
 * Throws an error if user is not authenticated or doesn't have a paid plan.
 * Use this in API routes to protect paid features.
 * Returns both user and team to avoid duplicate queries.
 * 
 * Optimized: Uses getTeamForUser which internally calls getUser if needed,
 * but we pass user.id to avoid redundant getUser call.
 */
export async function requirePaidSubscription(): Promise<{ user: User; team: TeamDataWithMembers }> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Pass user.id to avoid getTeamForUser calling getUser again
  const team = await getTeamForUser(user.id);
  if (!team) {
    throw new Error('Team not found');
  }

  const hasPaidPlan = team.subscriptionStatus === 'active' || team.subscriptionStatus === 'trialing';
  if (!hasPaidPlan) {
    throw new Error('This feature requires a paid subscription');
  }

  return { user, team };
}
