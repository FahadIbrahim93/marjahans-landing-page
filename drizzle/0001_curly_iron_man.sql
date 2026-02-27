CREATE TABLE `chatAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`messageCount` int NOT NULL DEFAULT 0,
	`responseTime` int,
	`resolutionTime` int,
	`rating` int,
	`feedback` text,
	`cartValueAtStart` int,
	`cartValueAtEnd` int,
	`orderPlaced` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`widgetTitle` text DEFAULT ('Chat with us'),
	`widgetSubtitle` text DEFAULT ('We''re here to help'),
	`widgetColor` varchar(7) DEFAULT '#F59E0B',
	`widgetPosition` enum('bottom-right','bottom-left') NOT NULL DEFAULT 'bottom-right',
	`showWhenOffline` boolean NOT NULL DEFAULT true,
	`offlineMessage` text DEFAULT ('We''re currently offline. Leave a message and we''ll get back to you soon!'),
	`enableAbandonmentDetection` boolean NOT NULL DEFAULT true,
	`abandonmentDelay` int DEFAULT 120000,
	`abandonmentMessage` text DEFAULT ('Need help with your order? We''re here to assist!'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` varchar(64) NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`visitorName` text,
	`visitorEmail` varchar(320),
	`assignedAgentId` int,
	`cartValue` int DEFAULT 0,
	`cartItems` json,
	`status` enum('active','waiting','closed','archived') NOT NULL DEFAULT 'active',
	`source` varchar(50) NOT NULL DEFAULT 'widget',
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`closedAt` timestamp,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`senderId` int,
	`senderType` enum('visitor','agent','system') NOT NULL,
	`senderName` text,
	`content` text NOT NULL,
	`type` enum('text','image','file','system') NOT NULL DEFAULT 'text',
	`isRead` boolean NOT NULL DEFAULT false,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
