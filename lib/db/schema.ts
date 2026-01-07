// TypeScript types for database tables

export interface User {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
  role: string;
  pdfLogoUrl: string | null;
  pdfLogoPosition: 'top-left' | 'top-center' | 'top-right' | null;
  pdfAccentColor: string | null;
  pdfFirstPageHeading: string | null;
  pdfFirstPageText: string | null;
  pdfFirstPageFooter: string | null;
  pdfFirstPageShowLogo: boolean | null;
  pdfLastPageHeading: string | null;
  pdfLastPageText: string | null;
  pdfLastPageFooter: string | null;
  pdfLastPageShowLogo: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Team {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeProductId: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
}

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  joinedAt: Date;
}

export interface ActivityLog {
  id: number;
  teamId: number;
  userId: number | null;
  action: string;
  timestamp: Date;
  ipAddress: string | null;
}

export interface Invitation {
  id: number;
  teamId: number;
  email: string;
  role: string;
  invitedBy: number;
  invitedAt: Date;
  status: string;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type NewTeam = Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'stripeCustomerId' | 'stripeSubscriptionId' | 'stripeProductId' | 'planName' | 'subscriptionStatus'>;
export type NewTeamMember = Omit<TeamMember, 'id' | 'joinedAt'>;
export type NewActivityLog = Omit<ActivityLog, 'id' | 'timestamp'>;
export type NewInvitation = Omit<Invitation, 'id' | 'invitedAt'>;

export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export interface Meal {
  id: number;
  userId: number;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  portionSize: string;
  category: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  note: string | null;
  lactofree: boolean;
  glutenfree: boolean;
  nutfree: boolean;
  vegan: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewMeal = Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>;

export interface Exercise {
  id: number;
  userId: number;
  name: string;
  muscleGroup: 'back' | 'chest' | 'arms';
  description: string | null;
  photo: string | null;
  sets: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewExercise = Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>;

export interface Client {
  id: number;
  userId: number;
  name: string;
  dateOfBirth: Date | null;
  email: string | null;
  gender: string | null;
  note: string | null;
  actualWeight: number | null;
  actualHeight: number | null;
  fitnessGoal: 'mass_gain' | 'weight_loss' | 'maintain';
  mealPdf: string | null;
  trainingPdf: string | null;
  mealPlanUpdatedAt: Date | null;
  trainingPlanUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export interface Supplement {
  id: number;
  userId: number;
  name: string;
  pillsPerDose: number;
  whenToTake: 'morning' | 'afternoon' | 'evening' | 'before_meal' | 'after_meal' | 'with_meal' | 'before_bed' | 'as_needed';
  benefits: string;
  dosage: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewSupplement = Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
