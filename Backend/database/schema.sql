-- Wall Street Journal MySQL Database Schema
CREATE DATABASE IF NOT EXISTS `wsj_db`;
USE `wsj_db`;

-- --------------------------------------------------------
-- Table structure for table `newsletter_subscriptions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscriptions`;
CREATE TABLE `newsletter_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `newsletters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newsletters`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `posts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `slug` varchar(255) NOT NULL,
  `subheadline` text DEFAULT NULL,
  `cardSummary` text DEFAULT NULL,
  `bodyContent` longtext DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subCategories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`subCategories`)),
  `homepagePlacement` varchar(100) DEFAULT NULL,
  `author` varchar(150) DEFAULT NULL,
  `authorEmail` varchar(150) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Drafts',
  `thumbnail` longtext DEFAULT NULL,
  `photoCaption` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `readDuration` varchar(50) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `publishedAt` bigint(20) DEFAULT 0,
  `date` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `saved_articles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `saved_articles`;
CREATE TABLE `saved_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(150) NOT NULL,
  `article_id` varchar(100) NOT NULL,
  `article_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`article_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_article` (`user_email`,`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','writer','reader') NOT NULL DEFAULT 'reader',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` text DEFAULT NULL,
  `avatar_url` longtext DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `is_default_admin` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `wsj_ad_slots`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wsj_ad_slots`;
CREATE TABLE `wsj_ad_slots` (
  `id` varchar(64) NOT NULL,
  `slot_name` varchar(255) NOT NULL,
  `dimension` varchar(64) NOT NULL,
  `placement_group` varchar(64) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `action_type` varchar(128) DEFAULT 'External Link (URL)',
  `target_url` text DEFAULT NULL,
  `selected_article_slug` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `shorts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `shorts`;
CREATE TABLE `shorts` (
  `id` varchar(100) NOT NULL,
  `sub_tab` varchar(50) NOT NULL DEFAULT 'recommended',
  `slot_number` int(11) NOT NULL DEFAULT 1,
  `video_url` text NOT NULL,
  `platform` varchar(100) NOT NULL DEFAULT 'Youtube Video',
  `title` text NOT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `duration` varchar(50) DEFAULT '0:45',
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


