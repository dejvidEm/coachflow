import { client } from './drizzle';
import { User, Team, TeamMember, ActivityLog, TeamDataWithMembers, Meal, NewMeal, Exercise, NewExercise, Client, NewClient, Supplement, NewSupplement } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

// Helper function to transform snake_case database rows to camelCase TypeScript objects
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

function transformTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    role: row.role,
    joinedAt: row.joined_at,
  };
}

export async function getUser(): Promise<User | null> {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const users = await client<any[]>`
    SELECT * FROM users 
    WHERE id = ${sessionData.user.id} AND deleted_at IS NULL 
    LIMIT 1
  `;

  if (users.length === 0) {
    return null;
  }

  return transformUser(users[0]);
}

export async function updateUserPdfSettings(pdfSettings: {
  pdfLogoUrl?: string | null;
  pdfLogoPosition?: 'top-left' | 'top-center' | 'top-right' | null;
  pdfAccentColor?: string | null;
}): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const users = await client<any[]>`
    UPDATE users
    SET 
      pdf_logo_url = ${pdfSettings.pdfLogoUrl !== undefined ? pdfSettings.pdfLogoUrl : null},
      pdf_logo_position = ${pdfSettings.pdfLogoPosition !== undefined ? pdfSettings.pdfLogoPosition : null},
      pdf_accent_color = ${pdfSettings.pdfAccentColor !== undefined ? pdfSettings.pdfAccentColor : null},
      updated_at = NOW()
    WHERE id = ${user.id}
    RETURNING *
  `;

  return transformUser(users[0]);
}

export async function updateUserPdfPages(pdfPages: {
  pdfFirstPageHeading?: string | null;
  pdfFirstPageText?: string | null;
  pdfFirstPageFooter?: string | null;
  pdfFirstPageShowLogo?: boolean | null;
  pdfLastPageHeading?: string | null;
  pdfLastPageText?: string | null;
  pdfLastPageFooter?: string | null;
  pdfLastPageShowLogo?: boolean | null;
}): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const users = await client<any[]>`
    UPDATE users
    SET 
      pdf_first_page_heading = ${pdfPages.pdfFirstPageHeading !== undefined ? pdfPages.pdfFirstPageHeading : null},
      pdf_first_page_text = ${pdfPages.pdfFirstPageText !== undefined ? pdfPages.pdfFirstPageText : null},
      pdf_first_page_footer = ${pdfPages.pdfFirstPageFooter !== undefined ? pdfPages.pdfFirstPageFooter : null},
      pdf_first_page_show_logo = ${pdfPages.pdfFirstPageShowLogo !== undefined ? pdfPages.pdfFirstPageShowLogo : false},
      pdf_last_page_heading = ${pdfPages.pdfLastPageHeading !== undefined ? pdfPages.pdfLastPageHeading : null},
      pdf_last_page_text = ${pdfPages.pdfLastPageText !== undefined ? pdfPages.pdfLastPageText : null},
      pdf_last_page_footer = ${pdfPages.pdfLastPageFooter !== undefined ? pdfPages.pdfLastPageFooter : null},
      pdf_last_page_show_logo = ${pdfPages.pdfLastPageShowLogo !== undefined ? pdfPages.pdfLastPageShowLogo : false},
      updated_at = NOW()
    WHERE id = ${user.id}
    RETURNING *
  `;

  return transformUser(users[0]);
}

export async function getTeamByStripeCustomerId(customerId: string): Promise<Team | null> {
  const teams = await client<any[]>`
    SELECT * FROM teams 
    WHERE stripe_customer_id = ${customerId} 
    LIMIT 1
  `;

  return teams.length > 0 ? transformTeam(teams[0]) : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await client`
    UPDATE teams 
    SET 
      stripe_subscription_id = ${subscriptionData.stripeSubscriptionId},
      stripe_product_id = ${subscriptionData.stripeProductId},
      plan_name = ${subscriptionData.planName},
      subscription_status = ${subscriptionData.subscriptionStatus},
      updated_at = NOW()
    WHERE id = ${teamId}
  `;
}

export async function getUserWithTeam(userId: number): Promise<{ user: User; teamId: number | null } | null> {
  const results = await client<any[]>`
    SELECT 
      u.*,
      tm.team_id
    FROM users u
    LEFT JOIN team_members tm ON u.id = tm.user_id
    WHERE u.id = ${userId}
    LIMIT 1
  `;

  if (results.length === 0) {
    return null;
  }

  const result = results[0];
  const { team_id, ...userRow } = result;
  return {
    user: transformUser(userRow),
    teamId: team_id
  };
}

export async function getActivityLogs(): Promise<Array<{
  id: number;
  action: string;
  timestamp: Date;
  ipAddress: string | null;
  userName: string | null;
}>> {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const logs = await client<any[]>`
    SELECT 
      al.id,
      al.action,
      al.timestamp,
      al.ip_address,
      u.name as user_name
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.user_id = ${user.id}
    ORDER BY al.timestamp DESC
    LIMIT 10
  `;

  return logs.map(log => ({
    id: log.id,
    action: log.action,
    timestamp: log.timestamp,
    ipAddress: log.ip_address,
    userName: log.user_name
  }));
}

export async function getTeamForUser(userId?: number): Promise<TeamDataWithMembers | null> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    return null;
  }

  // Optimized: Get team and team member in one query (reduces from 3 queries to 2)
  const teamResults = await client<any[]>`
    SELECT 
      t.*,
      tm.id as tm_id,
      tm.user_id as tm_user_id,
      tm.team_id as tm_team_id,
      tm.role as tm_role,
      tm.joined_at as tm_joined_at
    FROM team_members tm
    INNER JOIN teams t ON tm.team_id = t.id
    WHERE tm.user_id = ${user.id}
    LIMIT 1
  `;

  if (teamResults.length === 0) {
    return null;
  }

  const firstRow = teamResults[0];
  const team = transformTeam({
    id: firstRow.id,
    name: firstRow.name,
    created_at: firstRow.created_at,
    updated_at: firstRow.updated_at,
    stripe_customer_id: firstRow.stripe_customer_id,
    stripe_subscription_id: firstRow.stripe_subscription_id,
    stripe_product_id: firstRow.stripe_product_id,
    plan_name: firstRow.plan_name,
    subscription_status: firstRow.subscription_status,
  });

  // Get all team members with user info in one query
  const allTeamMembers = await client<any[]>`
    SELECT 
      tm.*,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email
    FROM team_members tm
    INNER JOIN users u ON tm.user_id = u.id
    WHERE tm.team_id = ${team.id}
  `;

  const teamDataWithMembers: TeamDataWithMembers = {
    ...team,
    teamMembers: allTeamMembers.map(row => {
      const tm = transformTeamMember({
        id: row.id,
        user_id: row.user_id,
        team_id: row.team_id,
        role: row.role,
        joined_at: row.joined_at,
      });
      return {
        ...tm,
        user: {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email
        }
      };
    })
  };

  return teamDataWithMembers;
}

function transformMeal(row: any): Meal {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    calories: row.calories,
    proteinG: parseFloat(row.protein_g),
    carbsG: parseFloat(row.carbs_g),
    fatsG: parseFloat(row.fats_g),
    portionSize: row.portion_size,
    category: row.category,
    note: row.note,
    lactofree: row.lactofree ?? false,
    glutenfree: row.glutenfree ?? false,
    nutfree: row.nutfree ?? false,
    vegan: row.vegan ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getMealsForUser(userId?: number): Promise<Meal[]> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const meals = await client<any[]>`
    SELECT * FROM meals 
    WHERE user_id = ${user.id} 
    ORDER BY created_at DESC
  `;

  return meals.map(transformMeal);
}

export async function createMeal(mealData: NewMeal): Promise<Meal> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const meals = await client<any[]>`
    INSERT INTO meals (
      user_id, 
      name, 
      calories, 
      protein_g, 
      carbs_g, 
      fats_g, 
      portion_size, 
      category, 
      note,
      lactofree,
      glutenfree,
      nutfree,
      vegan
    )
    VALUES (
      ${user.id},
      ${mealData.name},
      ${mealData.calories},
      ${mealData.proteinG},
      ${mealData.carbsG},
      ${mealData.fatsG},
      ${mealData.portionSize},
      ${mealData.category},
      ${mealData.note || null},
      ${mealData.lactofree ?? false},
      ${mealData.glutenfree ?? false},
      ${mealData.nutfree ?? false},
      ${mealData.vegan ?? false}
    )
    RETURNING *
  `;

  return transformMeal(meals[0]);
}

export async function updateMeal(mealId: number, mealData: Partial<NewMeal>): Promise<Meal> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the meal belongs to the user
  const existingMeals = await client<any[]>`
    SELECT * FROM meals WHERE id = ${mealId} AND user_id = ${user.id}
  `;
  
  if (existingMeals.length === 0) {
    throw new Error('Meal not found or access denied');
  }

  const meals = await client<any[]>`
    UPDATE meals
    SET 
      name = ${mealData.name ?? existingMeals[0].name},
      calories = ${mealData.calories ?? existingMeals[0].calories},
      protein_g = ${mealData.proteinG ?? existingMeals[0].protein_g},
      carbs_g = ${mealData.carbsG ?? existingMeals[0].carbs_g},
      fats_g = ${mealData.fatsG ?? existingMeals[0].fats_g},
      portion_size = ${mealData.portionSize ?? existingMeals[0].portion_size},
      category = ${mealData.category ?? existingMeals[0].category},
      note = ${mealData.note !== undefined ? mealData.note : existingMeals[0].note},
      lactofree = ${mealData.lactofree !== undefined ? mealData.lactofree : existingMeals[0].lactofree},
      glutenfree = ${mealData.glutenfree !== undefined ? mealData.glutenfree : existingMeals[0].glutenfree},
      nutfree = ${mealData.nutfree !== undefined ? mealData.nutfree : existingMeals[0].nutfree},
      vegan = ${mealData.vegan !== undefined ? mealData.vegan : existingMeals[0].vegan},
      updated_at = NOW()
    WHERE id = ${mealId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformMeal(meals[0]);
}

export async function deleteMeal(mealId: number): Promise<void> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const result = await client`
    DELETE FROM meals WHERE id = ${mealId} AND user_id = ${user.id}
  `;

  // Check if any rows were deleted
  if (result.count === 0) {
    throw new Error('Meal not found or access denied');
  }
}

function transformExercise(row: any): Exercise {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    muscleGroup: row.muscle_group,
    description: row.description,
    photo: row.photo,
    sets: row.sets,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getExercisesForUser(userId?: number): Promise<Exercise[]> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const exercises = await client<any[]>`
    SELECT * FROM exercises 
    WHERE user_id = ${user.id} 
    ORDER BY created_at DESC
  `;

  return exercises.map(transformExercise);
}

export async function createExercise(exerciseData: NewExercise): Promise<Exercise> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const exercises = await client<any[]>`
    INSERT INTO exercises (
      user_id, 
      name, 
      muscle_group, 
      description, 
      photo, 
      sets
    )
    VALUES (
      ${user.id},
      ${exerciseData.name},
      ${exerciseData.muscleGroup},
      ${exerciseData.description || null},
      ${exerciseData.photo || null},
      ${exerciseData.sets}
    )
    RETURNING *
  `;

  return transformExercise(exercises[0]);
}

export async function updateExercise(exerciseId: number, exerciseData: Partial<NewExercise>): Promise<Exercise> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the exercise belongs to the user
  const existingExercises = await client<any[]>`
    SELECT * FROM exercises WHERE id = ${exerciseId} AND user_id = ${user.id}
  `;
  
  if (existingExercises.length === 0) {
    throw new Error('Exercise not found or access denied');
  }

  const exercises = await client<any[]>`
    UPDATE exercises
    SET 
      name = ${exerciseData.name ?? existingExercises[0].name},
      muscle_group = ${exerciseData.muscleGroup ?? existingExercises[0].muscle_group},
      description = ${exerciseData.description !== undefined ? exerciseData.description : existingExercises[0].description},
      photo = ${exerciseData.photo !== undefined ? exerciseData.photo : existingExercises[0].photo},
      sets = ${exerciseData.sets ?? existingExercises[0].sets},
      updated_at = NOW()
    WHERE id = ${exerciseId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformExercise(exercises[0]);
}

export async function deleteExercise(exerciseId: number): Promise<void> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const result = await client`
    DELETE FROM exercises WHERE id = ${exerciseId} AND user_id = ${user.id}
  `;

  // Check if any rows were deleted
  if (result.count === 0) {
    throw new Error('Exercise not found or access denied');
  }
}

function transformClient(row: any): Client {
  // meal_pdf and training_pdf are now text fields storing the Supabase Storage URLs
  const mealPdfUrl = row.meal_pdf ? String(row.meal_pdf) : null;
  const trainingPdfUrl = row.training_pdf ? String(row.training_pdf) : null;

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : null,
    email: row.email,
    gender: row.gender,
    note: row.note,
    actualWeight: row.actual_weight ? parseFloat(row.actual_weight) : null,
    actualHeight: row.actual_height ? parseFloat(row.actual_height) : null,
    fitnessGoal: row.fitness_goal,
    mealPdf: mealPdfUrl,
    trainingPdf: trainingPdfUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getClientsForUser(userId?: number): Promise<Client[]> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const clients = await client<any[]>`
    SELECT * FROM clients 
    WHERE user_id = ${user.id} 
    ORDER BY created_at DESC
  `;

  return clients.map(transformClient);
}

export async function getClientById(clientId: number, userId?: number): Promise<Client | null> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const clients = await client<any[]>`
    SELECT * FROM clients 
    WHERE id = ${clientId} AND user_id = ${user.id}
    LIMIT 1
  `;

  if (clients.length === 0) {
    return null;
  }

  return transformClient(clients[0]);
}

export async function createClient(clientData: NewClient): Promise<Client> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const clients = await client<any[]>`
    INSERT INTO clients (
      user_id, 
      name, 
      date_of_birth, 
      email, 
      gender, 
      note, 
      actual_weight, 
      actual_height, 
      fitness_goal
    )
    VALUES (
      ${user.id},
      ${clientData.name},
      ${clientData.dateOfBirth ? clientData.dateOfBirth.toISOString().split('T')[0] : null},
      ${clientData.email || null},
      ${clientData.gender || null},
      ${clientData.note || null},
      ${clientData.actualWeight || null},
      ${clientData.actualHeight || null},
      ${clientData.fitnessGoal}
    )
    RETURNING *
  `;

  return transformClient(clients[0]);
}

export async function updateClient(clientId: number, clientData: Partial<NewClient>): Promise<Client> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the client belongs to the user
  const existingClients = await client<any[]>`
    SELECT * FROM clients WHERE id = ${clientId} AND user_id = ${user.id}
  `;
  
  if (existingClients.length === 0) {
    throw new Error('Client not found or access denied');
  }

  const clients = await client<any[]>`
    UPDATE clients
    SET 
      name = ${clientData.name ?? existingClients[0].name},
      date_of_birth = ${clientData.dateOfBirth ? clientData.dateOfBirth.toISOString().split('T')[0] : existingClients[0].date_of_birth},
      email = ${clientData.email !== undefined ? clientData.email : existingClients[0].email},
      gender = ${clientData.gender !== undefined ? clientData.gender : existingClients[0].gender},
      note = ${clientData.note !== undefined ? clientData.note : existingClients[0].note},
      actual_weight = ${clientData.actualWeight !== undefined ? clientData.actualWeight : existingClients[0].actual_weight},
      actual_height = ${clientData.actualHeight !== undefined ? clientData.actualHeight : existingClients[0].actual_height},
      fitness_goal = ${clientData.fitnessGoal ?? existingClients[0].fitness_goal},
      updated_at = NOW()
    WHERE id = ${clientId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformClient(clients[0]);
}

export async function updateClientMealPdf(clientId: number, pdfUrl: string): Promise<Client> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the client belongs to the user
  const existingClients = await client<any[]>`
    SELECT * FROM clients WHERE id = ${clientId} AND user_id = ${user.id}
  `;
  
  if (existingClients.length === 0) {
    throw new Error('Client not found or access denied');
  }

  // Note: The savePdf function will handle deletion of the old file
  // We don't need to delete here since savePdf does it automatically

  // Update only pdf_url and updated_at
  const clients = await client<any[]>`
    UPDATE clients
    SET 
      meal_pdf = ${pdfUrl},
      updated_at = NOW()
    WHERE id = ${clientId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformClient(clients[0]);
}

export async function updateClientTrainingPdf(clientId: number, pdfUrl: string): Promise<Client> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the client belongs to the user
  const existingClients = await client<any[]>`
    SELECT * FROM clients WHERE id = ${clientId} AND user_id = ${user.id}
  `;
  
  if (existingClients.length === 0) {
    throw new Error('Client not found or access denied');
  }

  // Update only training_pdf and updated_at
  const clients = await client<any[]>`
    UPDATE clients
    SET 
      training_pdf = ${pdfUrl},
      updated_at = NOW()
    WHERE id = ${clientId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformClient(clients[0]);
}

export async function deleteClient(clientId: number): Promise<void> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const result = await client`
    DELETE FROM clients WHERE id = ${clientId} AND user_id = ${user.id}
  `;

  // Check if any rows were deleted
  if (result.count === 0) {
    throw new Error('Client not found or access denied');
  }
}

export async function getClientStatistics() {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Get statistics about the current user's clients
  const stats = await client<any[]>`
    SELECT 
      COUNT(*) as total_clients
    FROM clients
    WHERE user_id = ${user.id}
  `;

  // Get clients grouped by fitness goal
  const clientsByGoal = await client<any[]>`
    SELECT 
      fitness_goal,
      COUNT(*) as count
    FROM clients
    WHERE user_id = ${user.id}
    GROUP BY fitness_goal
    ORDER BY count DESC
  `;

  // Get clients created over time (last 30 days, grouped by day)
  const clientsOverTime = await client<any[]>`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM clients
    WHERE user_id = ${user.id}
      AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  return {
    totalClients: parseInt(stats[0]?.total_clients || '0'),
    clientsByGoal: clientsByGoal.map(row => ({
      goal: row.fitness_goal,
      count: parseInt(row.count || '0'),
    })),
    clientsOverTime: clientsOverTime.map(row => ({
      date: row.date,
      count: parseInt(row.count || '0'),
    })),
  };
}

function transformSupplement(row: any): Supplement {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    pillsPerDose: row.pills_per_dose,
    whenToTake: row.when_to_take,
    benefits: row.benefits,
    dosage: row.dosage,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSupplementsForUser(userId?: number): Promise<Supplement[]> {
  const user = userId ? { id: userId } : await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const supplements = await client<any[]>`
    SELECT * FROM supplements 
    WHERE user_id = ${user.id} 
    ORDER BY created_at DESC
  `;

  return supplements.map(transformSupplement);
}

export async function createSupplement(supplementData: NewSupplement): Promise<Supplement> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const supplements = await client<any[]>`
    INSERT INTO supplements (
      user_id, 
      name, 
      pills_per_dose, 
      when_to_take, 
      benefits, 
      dosage, 
      note
    )
    VALUES (
      ${user.id},
      ${supplementData.name},
      ${supplementData.pillsPerDose},
      ${supplementData.whenToTake},
      ${supplementData.benefits},
      ${supplementData.dosage || null},
      ${supplementData.note || null}
    )
    RETURNING *
  `;

  return transformSupplement(supplements[0]);
}

export async function updateSupplement(supplementId: number, supplementData: Partial<NewSupplement>): Promise<Supplement> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // First verify the supplement belongs to the user
  const existingSupplements = await client<any[]>`
    SELECT * FROM supplements WHERE id = ${supplementId} AND user_id = ${user.id}
  `;
  
  if (existingSupplements.length === 0) {
    throw new Error('Supplement not found or access denied');
  }

  const supplements = await client<any[]>`
    UPDATE supplements
    SET 
      name = ${supplementData.name ?? existingSupplements[0].name},
      pills_per_dose = ${supplementData.pillsPerDose ?? existingSupplements[0].pills_per_dose},
      when_to_take = ${supplementData.whenToTake ?? existingSupplements[0].when_to_take},
      benefits = ${supplementData.benefits ?? existingSupplements[0].benefits},
      dosage = ${supplementData.dosage !== undefined ? supplementData.dosage : existingSupplements[0].dosage},
      note = ${supplementData.note !== undefined ? supplementData.note : existingSupplements[0].note},
      updated_at = NOW()
    WHERE id = ${supplementId} AND user_id = ${user.id}
    RETURNING *
  `;

  return transformSupplement(supplements[0]);
}

export async function deleteSupplement(supplementId: number): Promise<void> {
  const user = await getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const result = await client`
    DELETE FROM supplements WHERE id = ${supplementId} AND user_id = ${user.id}
  `;

  // Check if any rows were deleted
  if (result.count === 0) {
    throw new Error('Supplement not found or access denied');
  }
}
