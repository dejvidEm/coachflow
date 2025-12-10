CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"date_of_birth" date,
	"email" varchar(255),
	"gender" varchar(20),
	"note" text,
	"actual_weight" decimal(10,2),
	"actual_height" decimal(10,2),
	"fitness_goal" varchar(50) DEFAULT 'maintain' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_fitness_goal_check" CHECK ("fitness_goal" IN ('mass_gain', 'weight_loss', 'maintain'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clients_user_id_idx" ON "clients" ("user_id");

