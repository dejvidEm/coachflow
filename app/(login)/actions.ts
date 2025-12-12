'use server';

import { z } from 'zod';
import { client } from '@/lib/db/drizzle';
import {
  User,
  Team,
  TeamMember,
  Invitation,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  ActivityType,
} from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getUserWithTeam } from '@/lib/db/queries';
import {
  validatedAction,
  validatedActionWithUser
} from '@/lib/auth/middleware';

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  await client`
    INSERT INTO activity_logs (team_id, user_id, action, ip_address, timestamp)
    VALUES (${teamId}, ${userId}, ${type}, ${ipAddress || ''}, NOW())
  `;
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

// Helper function to transform snake_case to camelCase
function transformUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    pdfLogoUrl: row.pdf_logo_url ? String(row.pdf_logo_url) : null,
    pdfLogoPosition: row.pdf_logo_position || null,
    pdfAccentColor: row.pdf_accent_color || null,
    pdfFirstPageHeading: row.pdf_first_page_heading || null,
    pdfFirstPageText: row.pdf_first_page_text || null,
    pdfFirstPageFooter: row.pdf_first_page_footer || null,
    pdfFirstPageShowLogo: row.pdf_first_page_show_logo ?? false,
    pdfLastPageHeading: row.pdf_last_page_heading || null,
    pdfLastPageText: row.pdf_last_page_text || null,
    pdfLastPageFooter: row.pdf_last_page_footer || null,
    pdfLastPageShowLogo: row.pdf_last_page_show_logo ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function transformTeam(row: any): Team {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripeProductId: row.stripe_product_id,
    planName: row.plan_name,
    subscriptionStatus: row.subscription_status,
  };
}

function transformInvitation(row: any): Invitation {
  return {
    id: row.id,
    teamId: row.team_id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    invitedAt: row.invited_at,
    status: row.status,
  };
}

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const users = await client<any[]>`
    SELECT u.*
    FROM users u
    WHERE u.email = ${email} AND u.deleted_at IS NULL
    LIMIT 1
  `;

  if (users.length === 0) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  const foundUser = transformUser(users[0]);

  // Get team for user
  const teamMembers = await client<Array<{ team_id: number }>>`
    SELECT team_id
    FROM team_members
    WHERE user_id = ${foundUser.id}
    LIMIT 1
  `;

  let foundTeam: Team | null = null;
  if (teamMembers.length > 0) {
    const teams = await client<any[]>`
      SELECT * FROM teams
      WHERE id = ${teamMembers[0].team_id}
      LIMIT 1
    `;
    foundTeam = teams.length > 0 ? transformTeam(teams[0]) : null;
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  await Promise.all([
    setSession(foundUser),
    logActivity(foundTeam?.id || null, foundUser.id, ActivityType.SIGN_IN)
  ]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: foundTeam, priceId });
  }

  redirect('/dashboard');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  // Check if user already exists (including deleted users)
  const existingUsers = await client<any[]>`
    SELECT * FROM users 
    WHERE email = ${email} 
    LIMIT 1
  `;

  if (existingUsers.length > 0) {
    const existingUser = existingUsers[0];
    // If user is deleted, they can sign up again
    if (existingUser.deleted_at) {
      // Allow sign up for deleted users
    } else {
      return {
        error: 'This email is already registered. Please sign in instead.',
        email,
        password
      };
    }
  }

  const passwordHash = await hashPassword(password);

  let createdUsers;
  try {
    createdUsers = await client<any[]>`
      INSERT INTO users (email, password_hash, role, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, ${'owner'}, NOW(), NOW())
      RETURNING *
    `;
  } catch (error: any) {
    // Handle unique constraint violation (email already exists)
    if (error?.code === '23505' || error?.message?.includes('unique') || error?.message?.includes('duplicate')) {
      return {
        error: 'This email is already registered. Please sign in instead.',
        email,
        password
      };
    }
    // Re-throw other errors
    throw error;
  }

  if (createdUsers.length === 0) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  const createdUser = transformUser(createdUsers[0]);

  let teamId: number;
  let userRole: string;
  let createdTeam: Team | null = null;

  if (inviteId) {
    // Check if there's a valid invitation
    const invitations = await client<any[]>`
      SELECT * FROM invitations 
      WHERE id = ${parseInt(inviteId)} 
        AND email = ${email} 
        AND status = ${'pending'} 
      LIMIT 1
    `;

    if (invitations.length > 0) {
      const invitation = transformInvitation(invitations[0]);
      teamId = invitation.teamId;
      userRole = invitation.role;

      await client`
        UPDATE invitations 
        SET status = ${'accepted'} 
        WHERE id = ${invitation.id}
      `;

      await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);

      const teams = await client<any[]>`
        SELECT * FROM teams 
        WHERE id = ${teamId} 
        LIMIT 1
      `;
      createdTeam = teams.length > 0 ? transformTeam(teams[0]) : null;
    } else {
      return { error: 'Invalid or expired invitation.', email, password };
    }
  } else {
    // Create a new team if there's no invitation
    const newTeams = await client<any[]>`
      INSERT INTO teams (name, created_at, updated_at)
      VALUES (${`${email}'s Team`}, NOW(), NOW())
      RETURNING *
    `;

    if (newTeams.length === 0) {
      return {
        error: 'Failed to create team. Please try again.',
        email,
        password
      };
    }

    createdTeam = transformTeam(newTeams[0]);
    teamId = createdTeam.id;
    userRole = 'owner';

    await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  }

  await Promise.all([
    client`
      INSERT INTO team_members (user_id, team_id, role, joined_at)
      VALUES (${createdUser.id}, ${teamId}, ${userRole}, NOW())
    `,
    logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
    setSession(createdUser)
  ]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect('/dashboard');
});

export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId || null, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'Current password is incorrect.'
      };
    }

    if (currentPassword === newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password must be different from the current password.'
      };
    }

    if (confirmPassword !== newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password and confirmation password do not match.'
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      client`
        UPDATE users 
        SET password_hash = ${newPasswordHash} 
        WHERE id = ${user.id}
      `,
      logActivity(userWithTeam?.teamId || null, user.id, ActivityType.UPDATE_PASSWORD)
    ]);

    return {
      success: 'Password updated successfully.'
    };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        password,
        error: 'Incorrect password. Account deletion failed.'
      };
    }

    const userWithTeam = await getUserWithTeam(user.id);

    await logActivity(
      userWithTeam?.teamId || null,
      user.id,
      ActivityType.DELETE_ACCOUNT
    );

    // Soft delete
    await client`
      UPDATE users 
      SET 
        deleted_at = NOW(),
        email = CONCAT(email, '-', id::text, '-deleted'),
        updated_at = NOW()
      WHERE id = ${user.id}
    `;

    if (userWithTeam?.teamId) {
      await client`
        DELETE FROM team_members 
        WHERE user_id = ${user.id} AND team_id = ${userWithTeam.teamId}
      `;
    }

    (await cookies()).delete('session');
    redirect('/sign-in');
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      client`
        UPDATE users 
        SET name = ${name}, email = ${email}, updated_at = NOW() 
        WHERE id = ${user.id}
      `,
      logActivity(userWithTeam?.teamId || null, user.id, ActivityType.UPDATE_ACCOUNT)
    ]);

    return { name, success: 'Account updated successfully.' };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.number()
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await client`
      DELETE FROM team_members 
      WHERE id = ${memberId} AND team_id = ${userWithTeam.teamId}
    `;

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: 'Team member removed successfully' };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const existingMembers = await client<TeamMember[]>`
      SELECT tm.*
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE u.email = ${email} AND tm.team_id = ${userWithTeam.teamId}
      LIMIT 1
    `;

    if (existingMembers.length > 0) {
      return { error: 'User is already a member of this team' };
    }

    // Check if there's an existing invitation
    const existingInvitations = await client<any[]>`
      SELECT * FROM invitations 
      WHERE email = ${email} 
        AND team_id = ${userWithTeam.teamId} 
        AND status = ${'pending'} 
      LIMIT 1
    `;

    if (existingInvitations.length > 0) {
      return { error: 'An invitation has already been sent to this email' };
    }

    // Create a new invitation
    await client`
      INSERT INTO invitations (team_id, email, role, invited_by, invited_at, status)
      VALUES (${userWithTeam.teamId}, ${email}, ${role}, ${user.id}, NOW(), ${'pending'})
    `;

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: 'Invitation sent successfully' };
  }
);
