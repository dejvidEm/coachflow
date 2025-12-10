import { client } from './drizzle';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

async function migrate() {
  console.log('Running database migrations...');

  try {
    const migrationsDir = join(process.cwd(), 'lib/db/migrations');
    
    // Get all SQL migration files and sort them
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`\nProcessing migration: ${file}`);
      const migrationPath = join(migrationsDir, file);
      const migrationSQL = readFileSync(migrationPath, 'utf-8');

      // Split the SQL by statement breakpoints
      const statements = migrationSQL
        .split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (!statement || statement.startsWith('--')) continue;

        try {
          await client.unsafe(statement);
          console.log(`  ✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error: any) {
          // Ignore errors for "already exists" or "duplicate" errors
          if (
            error?.message?.includes('already exists') ||
            error?.message?.includes('duplicate') ||
            error?.code === '42P07' || // duplicate_table
            error?.code === '42710' || // duplicate_object
            error?.code === '42P16'    // duplicate_object
          ) {
            console.log(`  ⚠ Skipped statement ${i + 1} (already exists)`);
          } else {
            console.error(`  ✗ Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
