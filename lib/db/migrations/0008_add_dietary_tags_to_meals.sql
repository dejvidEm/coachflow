-- Add dietary tags to meals table
--> statement-breakpoint
ALTER TABLE "meals" 
ADD COLUMN IF NOT EXISTS "lactofree" boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "glutenfree" boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "nutfree" boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "vegan" boolean DEFAULT false NOT NULL;

