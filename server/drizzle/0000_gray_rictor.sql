CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`rarity` text NOT NULL,
	`archetype` text NOT NULL,
	`faction` text NOT NULL,
	`gold_multiplier` real DEFAULT 1,
	`pull_rate_boost` real,
	`conversion_ratio` real,
	`buff_value` real,
	`buff_direction` text DEFAULT 'NONE',
	`prestige_points` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `user_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`card_id` integer NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`exp` integer DEFAULT 0 NOT NULL,
	`eidolon_level` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_decks` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`slot_1_id` integer,
	`slot_2_id` integer,
	`slot_3_id` integer,
	`slot_4_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_1_id`) REFERENCES `user_cards`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_2_id`) REFERENCES `user_cards`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_3_id`) REFERENCES `user_cards`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_4_id`) REFERENCES `user_cards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`gold` text DEFAULT '0' NOT NULL,
	`celestial_wishes` integer DEFAULT 0 NOT NULL,
	`star_gems` integer DEFAULT 0 NOT NULL,
	`last_login_at` integer DEFAULT CURRENT_TIMESTAMP,
	`is_challenge_mode` integer DEFAULT false,
	`deck_locked_until` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);