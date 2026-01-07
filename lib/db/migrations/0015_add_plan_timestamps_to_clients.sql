-- Add meal_plan_updated_at and training_plan_updated_at columns to clients table
-- These track when meal plans and training plans were last generated/updated
--> statement-breakpoint
ALTER TABLE "clients" 
ADD COLUMN IF NOT EXISTS "meal_plan_updated_at" timestamp;
--> statement-breakpoint
ALTER TABLE "clients" 
ADD COLUMN IF NOT EXISTS "training_plan_updated_at" timestamp;




