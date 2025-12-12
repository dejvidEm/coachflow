-- Add PDF logo visibility toggles for first and last pages
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_first_page_show_logo" boolean DEFAULT false;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pdf_last_page_show_logo" boolean DEFAULT false;
