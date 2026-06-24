CREATE TABLE IF NOT EXISTS `us` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`worker` real DEFAULT 0 NOT NULL,
	`warrior` real DEFAULT 0 NOT NULL,
	`thinker` real DEFAULT 0 NOT NULL,
	`trader` real DEFAULT 0 NOT NULL,
	`article_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `ph` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`worker` real DEFAULT 0 NOT NULL,
	`warrior` real DEFAULT 0 NOT NULL,
	`thinker` real DEFAULT 0 NOT NULL,
	`trader` real DEFAULT 0 NOT NULL,
	`article_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `article_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country` text NOT NULL,
	`date` text NOT NULL,
	`headline` text NOT NULL,
	`category` text NOT NULL,
	`score` real NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `us_date_idx` ON `us` (`date`);
CREATE INDEX IF NOT EXISTS `ph_date_idx` ON `ph` (`date`);
CREATE INDEX IF NOT EXISTS `log_country_date_idx` ON `article_log` (`country`, `date`);
