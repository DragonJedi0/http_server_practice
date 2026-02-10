ALTER TABLE "posts" RENAME TO "chirps";--> statement-breakpoint
ALTER TABLE "chirps" DROP CONSTRAINT "posts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chirps" ADD CONSTRAINT "chirps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;