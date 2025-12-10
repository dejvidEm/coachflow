-- Remove PDF settings from clients table
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "pdf_logo_url";
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "pdf_logo_position";
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "pdf_accent_color";
--> statement-breakpoint
-- Add PDF settings to users table
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_logo_url" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_logo_position" varchar(20) DEFAULT 'top-left';
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_accent_color" varchar(7) DEFAULT '#44B080';

