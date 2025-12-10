CREATE TABLE IF NOT EXISTS "supplements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"pills_per_dose" integer NOT NULL,
	"when_to_take" varchar(20) NOT NULL,
	"benefits" text NOT NULL,
	"dosage" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "supplements_when_to_take_check" CHECK ("when_to_take" IN ('morning', 'afternoon', 'evening', 'before_meal', 'after_meal', 'with_meal', 'before_bed', 'as_needed'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplements" ADD CONSTRAINT "supplements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplements_user_id_idx" ON "supplements" ("user_id");


