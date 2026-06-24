CREATE TABLE `article_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country` text NOT NULL,
	`date` text NOT NULL,
	`headline` text NOT NULL,
	`category` text NOT NULL,
	`score` real NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ph` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`worker` real DEFAULT 0 NOT NULL,
	`warrior` real DEFAULT 0 NOT NULL,
	`thinker` real DEFAULT 0 NOT NULL,
	`trader` real DEFAULT 0 NOT NULL,
	`article_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `us` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`worker` real DEFAULT 0 NOT NULL,
	`warrior` real DEFAULT 0 NOT NULL,
	`thinker` real DEFAULT 0 NOT NULL,
	`trader` real DEFAULT 0 NOT NULL,
	`article_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
