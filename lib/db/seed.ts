import { stripe } from '../payments/stripe';
import { client } from './drizzle';
import { User, Team, TeamMember } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const users = await client<any[]>`
    INSERT INTO users (email, password_hash, role, created_at, updated_at)
    VALUES (${email}, ${passwordHash}, ${'owner'}, NOW(), NOW())
    RETURNING *
  `;

  if (users.length === 0) {
    throw new Error('Failed to create user');
  }

  const user = users[0];
  console.log('Initial user created.');

  const teams = await client<any[]>`
    INSERT INTO teams (name, created_at, updated_at)
    VALUES (${'Test Team'}, NOW(), NOW())
    RETURNING *
  `;

  if (teams.length === 0) {
    throw new Error('Failed to create team');
  }

  const team = teams[0];

  await client`
    INSERT INTO team_members (user_id, team_id, role, joined_at)
    VALUES (${user.id}, ${team.id}, ${'owner'}, NOW())
  `;

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
