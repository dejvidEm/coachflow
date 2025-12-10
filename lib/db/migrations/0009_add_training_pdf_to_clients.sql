-- Add training_pdf column to clients table
--> statement-breakpoint
ALTER TABLE "clients" 
ADD COLUMN IF NOT EXISTS "training_pdf" text;



