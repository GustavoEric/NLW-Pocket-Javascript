ALTER TABLE "goalCompletions" DROP CONSTRAINT "goalCompletions_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "goalCompletions" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "goalCompletions" ADD COLUMN "goal_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goalCompletions" ADD CONSTRAINT "goalCompletions_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
