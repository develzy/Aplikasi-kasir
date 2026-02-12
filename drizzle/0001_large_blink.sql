CREATE TABLE `settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`store_name` text DEFAULT 'KasUMKM' NOT NULL,
	`address` text DEFAULT 'Jl. Digital No. 123, Indonesia' NOT NULL,
	`phone` text DEFAULT '0812-3456-7890' NOT NULL,
	`currency` text DEFAULT 'IDR' NOT NULL
);
