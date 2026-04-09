ALTER TABLE "clients" DROP COLUMN IF EXISTS "meal_pdf";
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "meal_pdf" text;
COMMENT ON COLUMN public.clients.meal_pdf IS 'URL to meal plan PDF (was bytea; migration 0007).';



