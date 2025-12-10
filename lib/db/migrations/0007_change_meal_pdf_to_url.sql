-- Change meal_pdf from bytea to text (URL)
ALTER TABLE "clients" DROP COLUMN IF EXISTS "meal_pdf";
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "meal_pdf" text;



