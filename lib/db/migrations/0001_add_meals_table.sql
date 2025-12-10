CREATE TABLE IF NOT EXISTS "meals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"calories" integer NOT NULL,
	"protein_g" numeric(10, 2) NOT NULL,
	"carbs_g" numeric(10, 2) NOT NULL,
	"fats_g" numeric(10, 2) NOT NULL,
	"portion_size" varchar(100) NOT NULL,
	"category" varchar(20) NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "meals_category_check" CHECK ("category" IN ('breakfast', 'snack', 'lunch', 'dinner'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meals_user_id_idx" ON "meals" ("user_id");


