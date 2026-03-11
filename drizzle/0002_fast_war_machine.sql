CREATE TABLE `amocrm_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subdomain` varchar(100) NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `amocrm_tokens_id` PRIMARY KEY(`id`)
);
