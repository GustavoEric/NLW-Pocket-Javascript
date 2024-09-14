CREATE TABLE IF NOT EXISTS "goalCompletions" (
	"id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goalCompletions" ADD CONSTRAINT "goalCompletions_id_goals_id_fk" FOREIGN KEY ("id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
