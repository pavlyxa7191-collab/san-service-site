CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(320),
	`service` varchar(100),
	`propertyType` varchar(100),
	`area` varchar(50),
	`method` varchar(100),
	`source` varchar(100) DEFAULT 'website',
	`priceMin` int,
	`priceMax` int,
	`message` text,
	`status` enum('new','contacted','completed','cancelled') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
