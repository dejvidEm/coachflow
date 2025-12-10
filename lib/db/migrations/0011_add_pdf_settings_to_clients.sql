ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "pdf_logo_url" text;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "pdf_logo_position" varchar(20) DEFAULT 'top-left';
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "pdf_accent_color" varchar(7) DEFAULT '#44B080';

