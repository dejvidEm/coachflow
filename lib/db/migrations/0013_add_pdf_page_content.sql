-- Add PDF first and last page content fields to users table
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_first_page_heading" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_first_page_text" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_first_page_footer" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_last_page_heading" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_last_page_text" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_last_page_footer" text;
