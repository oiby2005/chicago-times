-- Times Chicago MySQL Database Dump
-- Exported on: 2026-10-09T18:28:05.011Z
-- Database: timeschicago_db

CREATE DATABASE IF NOT EXISTS `timeschicago_db`;
USE `timeschicago_db`;

-- --------------------------------------------------------
-- Table structure for table `billionaires`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `billionaires`;
CREATE TABLE `billionaires` (
  `id` varchar(64) NOT NULL,
  `rank` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `net_worth` varchar(64) NOT NULL,
  `change_status` varchar(32) DEFAULT 'UP',
  `age` varchar(32) DEFAULT '',
  `country` varchar(255) DEFAULT '',
  `source` varchar(255) DEFAULT '',
  `industry` varchar(255) DEFAULT '',
  `photo_url` text DEFAULT NULL,
  `highlight_text` text DEFAULT NULL,
  `end_year` int(11) DEFAULT 2026,
  `title_role` varchar(255) DEFAULT '',
  `real_time_net_worth` varchar(64) DEFAULT '',
  `real_time_change` varchar(128) DEFAULT '',
  `real_time_as_of` varchar(64) DEFAULT '',
  `list_net_worth_as_of` varchar(64) DEFAULT '',
  `photo_credit` varchar(255) DEFAULT '',
  `editor_last_updated` varchar(255) DEFAULT '',
  `editor_bullet_points` longtext DEFAULT NULL,
  `in_their_own_words_quote` text DEFAULT NULL,
  `self_made_score` varchar(32) DEFAULT '',
  `philanthropy_score` varchar(32) DEFAULT '',
  `residence` varchar(255) DEFAULT '',
  `citizenship` varchar(255) DEFAULT '',
  `marital_status` varchar(128) DEFAULT '',
  `children` varchar(32) DEFAULT '',
  `education` text DEFAULT NULL,
  `did_you_know_facts` longtext DEFAULT NULL,
  `wealth_history` longtext DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `billionaires`
INSERT INTO `billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('1', 1, 'Elon Musk', '$839 B', 'UP', '54', 'United States', 'Tesla, SpaceX', 'Technology', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg', 'Elon Musk became the world\'s first trillionaire on June 12 when SpaceX went public.', 2026, 'CEO, Tesla', '$1.037T', '▼ $14.2B (1.35%)', '10/7/26', '3/10/26', 'MARTIN SCHOELLER FOR FORBES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":21},{"year":2018,"value":20},{"year":2019,"value":22},{"year":2020,"value":25},{"year":2021,"value":190},{"year":2022,"value":219},{"year":2023,"value":180},{"year":2024,"value":210},{"year":2025,"value":340},{"year":2026,"value":839}]', '{"id":"1","rank":1,"name":"Elon Musk","netWorth":"$839 B","changeStatus":"UP","age":54,"country":"United States","source":"Tesla, SpaceX","industry":"Technology","photoUrl":"https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg","highlightText":"Elon Musk became the world\'s first trillionaire on June 12 when SpaceX went public.","endYear":2026,"titleRole":"CEO, Tesla","realTimeNetWorth":"$1.037T","realTimeChange":"▼ $14.2B (1.35%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"MARTIN SCHOELLER FOR FORBES","wealthHistory":[{"year":2017,"value":21},{"year":2018,"value":20},{"year":2019,"value":22},{"year":2020,"value":25},{"year":2021,"value":190},{"year":2022,"value":219},{"year":2023,"value":180},{"year":2024,"value":210},{"year":2025,"value":340},{"year":2026,"value":839}]}', '2026-10-09 18:11:40');
INSERT INTO `billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('2', 2, 'Bernard Arnault & family', '$233 B', 'UP', '75', 'France', 'LVMH', 'Fashion & Luxury', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', 'Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands.', 2026, 'Chairman and CEO, LVMH', '$233B', '▲ $1.2B (0.52%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":41},{"year":2018,"value":72},{"year":2019,"value":76},{"year":2020,"value":76},{"year":2021,"value":150},{"year":2022,"value":158},{"year":2023,"value":211},{"year":2024,"value":233},{"year":2025,"value":220},{"year":2026,"value":233}]', '{"id":"2","rank":2,"name":"Bernard Arnault & family","netWorth":"$233 B","changeStatus":"UP","age":75,"country":"France","source":"LVMH","industry":"Fashion & Luxury","photoUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80","highlightText":"Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands.","endYear":2026,"titleRole":"Chairman and CEO, LVMH","realTimeNetWorth":"$233B","realTimeChange":"▲ $1.2B (0.52%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":41},{"year":2018,"value":72},{"year":2019,"value":76},{"year":2020,"value":76},{"year":2021,"value":150},{"year":2022,"value":158},{"year":2023,"value":211},{"year":2024,"value":233},{"year":2025,"value":220},{"year":2026,"value":233}]}', '2026-10-09 18:11:40');
INSERT INTO `billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('3', 3, 'Jeff Bezos', '$194 B', 'UP', '60', 'United States', 'Amazon', 'Technology', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', 'Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage.', 2026, 'Executive Chair, Amazon', '$194B', '▼ $800M (0.41%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":72},{"year":2018,"value":112},{"year":2019,"value":131},{"year":2020,"value":113},{"year":2021,"value":177},{"year":2022,"value":171},{"year":2023,"value":114},{"year":2024,"value":194},{"year":2025,"value":190},{"year":2026,"value":194}]', '{"id":"3","rank":3,"name":"Jeff Bezos","netWorth":"$194 B","changeStatus":"UP","age":60,"country":"United States","source":"Amazon","industry":"Technology","photoUrl":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80","highlightText":"Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage.","endYear":2026,"titleRole":"Executive Chair, Amazon","realTimeNetWorth":"$194B","realTimeChange":"▼ $800M (0.41%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":72},{"year":2018,"value":112},{"year":2019,"value":131},{"year":2020,"value":113},{"year":2021,"value":177},{"year":2022,"value":171},{"year":2023,"value":114},{"year":2024,"value":194},{"year":2025,"value":190},{"year":2026,"value":194}]}', '2026-10-09 18:11:40');
INSERT INTO `billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('4', 4, 'Mark Zuckerberg', '$177 B', 'UP', '40', 'United States', 'Meta', 'Technology', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', 'Mark Zuckerberg started Facebook at Harvard in 2004 at age 19.', 2026, 'CEO, Meta', '$177B', '▲ $3.4B (1.95%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":56},{"year":2018,"value":71},{"year":2019,"value":62},{"year":2020,"value":54},{"year":2021,"value":97},{"year":2022,"value":67},{"year":2023,"value":64},{"year":2024,"value":177},{"year":2025,"value":170},{"year":2026,"value":177}]', '{"id":"4","rank":4,"name":"Mark Zuckerberg","netWorth":"$177 B","changeStatus":"UP","age":40,"country":"United States","source":"Meta","industry":"Technology","photoUrl":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80","highlightText":"Mark Zuckerberg started Facebook at Harvard in 2004 at age 19.","endYear":2026,"titleRole":"CEO, Meta","realTimeNetWorth":"$177B","realTimeChange":"▲ $3.4B (1.95%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":56},{"year":2018,"value":71},{"year":2019,"value":62},{"year":2020,"value":54},{"year":2021,"value":97},{"year":2022,"value":67},{"year":2023,"value":64},{"year":2024,"value":177},{"year":2025,"value":170},{"year":2026,"value":177}]}', '2026-10-09 18:11:40');

-- --------------------------------------------------------
-- Table structure for table `newsletter_subscriptions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscriptions`;
CREATE TABLE `newsletter_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `newsletters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newsletters`)),
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `imageSeoKeywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imageSeoKeywords`)),
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
  `audio_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `shorts`
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('podcast_slot_1', 'podcast', 1, 'https://podcasts.apple.com/us/podcast/what-safeguarding-nukes-can-teach-us-about-safeguarding-a-i/id1200361736?i=1000791438660', 'Apple Podcasts', 'What Safeguarding Nukes Can Teach Us About Safeguarding A.I.', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1790264649293_1790264650510.jpg', '36:35', 'Active', 'https://play.itunes.apple.com/WebObjects/MZPlay.woa/podcast/hls/playlist.m3u8?cc=US&a=1000791438660&id=1509632706&l=en-us', '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('podcast_slot_2', 'podcast', 2, 'https://podcasts.apple.com/us/podcast/aaron-sorkin-goes-off-script/id1200361736?i=1000790659273', 'Apple Podcasts', 'Aaron Sorkin Goes Off Script', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1790324389340_1790324389929.jpg', '1:00:45', 'Inactive', 'https://play.itunes.apple.com/WebObjects/MZPlay.woa/podcast/hls/playlist.m3u8?cc=US&a=1000790659273&id=1508439129&l=en-us', '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('podcast_slot_3', 'podcast', 3, '', 'Apple Podcasts', '[Empty Slot #3]', 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100%\' height=\'100%\' fill=\'%23000000\'/></svg>', '0:00', 'Inactive', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('recommended_slot_1', 'recommended', 1, 'https://youtu.be/AnKcmrKI08g?si=F5W-UbvA8i36BBMV', 'Youtube Video', 'The tiny islands causing a headache for Britain | BBC News', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1790249117042_1790249117289.jpg', '10:05', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('recommended_slot_2', 'recommended', 2, 'https://www.facebook.com/reel/1066883556319471/?s=fb_shorts_profile&stack_idx=0', 'Facebook Short', 'President Masoud Pezeshkian has said Iran will never "bend the knee" after almost seven months of war with the US and Israel, but is ready for a diplomatic solution to the conflict.\n\nRead more: https://bbc.in/4AvjaDo | BBC News', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1790249177718_1790249177827.jpg', '0:45', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('recommended_slot_3', 'recommended', 3, 'https://rumble.com/v7ey3um-bigfoot-burnt-ends-400k-movie-props-and-a-very-special-family-milestone.html?e9s=src_v1_pvr%2Csrc_v1_hp', 'Rumble Video', 'Bigfoot, Burnt Ends, $400K Movie Props & a Very Special Family Milestone', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1790249213637_1790249215481.jpg', '1:49:12', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('recommended_slot_4', 'recommended', 4, 'https://www.youtube.com/watch?v=fv42WhStqFY', 'Youtube Video', 'Ed Sheeran and Macklemore backlash: Who calls the shots on tour? | BBC News', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1789793698157_1789793698339.jpg', '8:59', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('recommended_slot_5', 'recommended', 5, '', 'Youtube Video', '[Empty Slot #5]', 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100%\' height=\'100%\' fill=\'%23000000\'/></svg>', '0:00', 'Inactive', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('video_slot_1', 'videos', 1, 'https://www.facebook.com/reel/2014531089247953', 'Facebook Short', 'A former Ohio music pastor who once appeared on the TV talent show American Idol has been found guilty of murdering his wife.\n\nRead more: https://bbc.in/4hkNE3t | BBC News', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1791003496827_1791003496894.jpg', '0:45', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('video_slot_2', 'videos', 2, 'https://www.instagram.com/bbcnews/reel/Dd9b63NFav7/', 'Instagram shorts', 'BBC News on Instagram: "A UK-Iranian dual national has been arrested on suspicion of preparation of terrorist acts in connection with the incident at RAF Fairford, counter-terror police have said.\n \nThe 27-year-old man was arrested in Westminster, London.\n \nA second man, a 26-year-old UK national, has also been questioned under caution, and two properties in the area have been searched.\n \nTap the link in @BBCNews’s bio for more on this breaking news story.\n \n#RAFFairford #Gloucestershire #BBCNews"', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1791003558278_1791003558505.jpg', '0:45', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('video_slot_3', 'videos', 3, 'https://www.youtube.com/watch?v=9gVgz394w9A', 'Youtube Video', 'Why UK Prime Minister Andy Burnham\'s about-turn on Manchester City matters | BBC Newscast', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1791003626934_1791003627132.jpg', '25:00', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');
INSERT INTO `shorts` (`id`, `sub_tab`, `slot_number`, `video_url`, `platform`, `title`, `thumbnail_url`, `duration`, `status`, `audio_url`, `created_at`, `updated_at`) VALUES ('video_slot_4', 'videos', 4, 'https://rumble.com/v7g9vka-bintangs-alright-alright.html?e9s=src_v1_rsr%2Csrc_v1_music%2Csrc_v2_hp&pri=3KAcGkYIx3IVkNrjNRivssG22RU', 'Rumble Video', 'Bintangs - Alright Alright', 'https://f005.backblazeb2.com/file/timeschicago/cover_images/cover_1791003744829_1791003745580.jpg', '4:04', 'Active', NULL, '2026-10-09 18:12:31', '2026-10-09 18:12:31');

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
  `bio` text DEFAULT NULL,
  `avatar_url` longtext DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `is_default_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (1, 'Akram Yanoos', 'akramyoonos006@gmail.com', '$2a$10$X2KMCNBbrMW2vhA1IvRDjewL621gavwFnbpQYi7VL6rcivsZE6dwS', 'admin', 'Default System Administrator', NULL, '', 1, '2026-10-09 18:11:16', '2026-10-09 18:11:16');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (2, 'Geeth Liyanage', 'geethliyanage979@gmail.com', '$2a$10$ZoeEHxEdsIGnz.B6TsMFUe3rkAT/MQI9pKncbg5x0xeTpwaQLDRTq', 'admin', 'Default System Administrator', NULL, '', 1, '2026-10-09 18:11:16', '2026-10-09 18:11:16');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (3, 'Times Chicago', 'timeschicago17@gmail.com', '$2a$10$9GJIWAQXHgTPqYh13bhIM.bYGXvNevxUoH7GZoHSJTqqzk7cxukxe', 'admin', 'Default System Administrator', NULL, '', 1, '2026-10-09 18:11:16', '2026-10-09 18:11:16');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (4, 'Admin User', 'admin@gmail.com', '$2a$10$4o74h9caVfRTpkWsgAGiO.ekFtPe2NaSlspC/HfoPyhk6RIM0Hcyi', 'admin', 'System Administrator', NULL, '', 0, '2026-10-09 18:11:17', '2026-10-09 18:11:17');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (5, 'Writer User', 'writer@gmail.com', '$2a$10$.3gs5IyMqSocfoN4eCN68ur8mG3Q2DiPcV.7PbGfo8HFqnHSP3.q.', 'writer', 'Journalist & Columnist covering business, economic policy, and global markets.', NULL, 'https://www.linkedin.com/in/your-profile', 0, '2026-10-09 18:11:17', '2026-10-09 18:11:17');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (6, 'writer1', 'writer1@gmail.com', '$2a$10$mUpPKJcRQZZxqDcUjm1PDuVK6798X/4GxuwUG.Avq1Lb9XA6roZpy', 'writer', 'Journalist & Writer covering technology, innovation, and global developments.', NULL, 'https://www.linkedin.com/in/your-profile', 0, '2026-10-09 18:11:17', '2026-10-09 18:11:17');
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `bio`, `avatar_url`, `linkedin`, `is_default_admin`, `created_at`, `updated_at`) VALUES (7, 'Reader User', 'reader@gmail.com', '$2a$10$6B6Nl5LREZitkvZXqD/EPOhx07vDjrQoXq1hmozJuL46Deygl9knG', 'reader', 'Avid Reader and Community Subscriber', NULL, '', 0, '2026-10-09 18:11:17', '2026-10-09 18:11:17');

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
-- Table structure for table `wsj_billionaires`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wsj_billionaires`;
CREATE TABLE `wsj_billionaires` (
  `id` varchar(64) NOT NULL,
  `rank` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `net_worth` varchar(64) NOT NULL,
  `change_status` varchar(32) DEFAULT 'UP',
  `age` varchar(32) DEFAULT '',
  `country` varchar(255) DEFAULT '',
  `source` varchar(255) DEFAULT '',
  `industry` varchar(255) DEFAULT '',
  `photo_url` text DEFAULT NULL,
  `highlight_text` text DEFAULT NULL,
  `end_year` int(11) DEFAULT 2026,
  `title_role` varchar(255) DEFAULT '',
  `real_time_net_worth` varchar(64) DEFAULT '',
  `real_time_change` varchar(128) DEFAULT '',
  `real_time_as_of` varchar(64) DEFAULT '',
  `list_net_worth_as_of` varchar(64) DEFAULT '',
  `photo_credit` varchar(255) DEFAULT '',
  `editor_last_updated` varchar(255) DEFAULT '',
  `editor_bullet_points` longtext DEFAULT NULL,
  `in_their_own_words_quote` text DEFAULT NULL,
  `self_made_score` varchar(32) DEFAULT '',
  `philanthropy_score` varchar(32) DEFAULT '',
  `residence` varchar(255) DEFAULT '',
  `citizenship` varchar(255) DEFAULT '',
  `marital_status` varchar(128) DEFAULT '',
  `children` varchar(32) DEFAULT '',
  `education` text DEFAULT NULL,
  `did_you_know_facts` longtext DEFAULT NULL,
  `wealth_history` longtext DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `wsj_billionaires`
INSERT INTO `wsj_billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('1', 1, 'Elon Musk', '$839 B', 'UP', '54', 'United States', 'Tesla, SpaceX', 'Technology', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg', 'Elon Musk became the world\'s first trillionaire on June 12 when SpaceX went public.', 2026, 'CEO, Tesla', '$1.037T', '▼ $14.2B (1.35%)', '10/7/26', '3/10/26', 'MARTIN SCHOELLER FOR FORBES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":21},{"year":2018,"value":20},{"year":2019,"value":22},{"year":2020,"value":25},{"year":2021,"value":190},{"year":2022,"value":219},{"year":2023,"value":180},{"year":2024,"value":210},{"year":2025,"value":340},{"year":2026,"value":839}]', '{"id":"1","rank":1,"name":"Elon Musk","netWorth":"$839 B","changeStatus":"UP","age":54,"country":"United States","source":"Tesla, SpaceX","industry":"Technology","photoUrl":"https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg","highlightText":"Elon Musk became the world\'s first trillionaire on June 12 when SpaceX went public.","endYear":2026,"titleRole":"CEO, Tesla","realTimeNetWorth":"$1.037T","realTimeChange":"▼ $14.2B (1.35%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"MARTIN SCHOELLER FOR FORBES","wealthHistory":[{"year":2017,"value":21},{"year":2018,"value":20},{"year":2019,"value":22},{"year":2020,"value":25},{"year":2021,"value":190},{"year":2022,"value":219},{"year":2023,"value":180},{"year":2024,"value":210},{"year":2025,"value":340},{"year":2026,"value":839}]}', '2026-10-09 18:11:40');
INSERT INTO `wsj_billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('2', 2, 'Bernard Arnault & family', '$233 B', 'UP', '75', 'France', 'LVMH', 'Fashion & Luxury', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', 'Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands.', 2026, 'Chairman and CEO, LVMH', '$233B', '▲ $1.2B (0.52%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":41},{"year":2018,"value":72},{"year":2019,"value":76},{"year":2020,"value":76},{"year":2021,"value":150},{"year":2022,"value":158},{"year":2023,"value":211},{"year":2024,"value":233},{"year":2025,"value":220},{"year":2026,"value":233}]', '{"id":"2","rank":2,"name":"Bernard Arnault & family","netWorth":"$233 B","changeStatus":"UP","age":75,"country":"France","source":"LVMH","industry":"Fashion & Luxury","photoUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80","highlightText":"Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands.","endYear":2026,"titleRole":"Chairman and CEO, LVMH","realTimeNetWorth":"$233B","realTimeChange":"▲ $1.2B (0.52%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":41},{"year":2018,"value":72},{"year":2019,"value":76},{"year":2020,"value":76},{"year":2021,"value":150},{"year":2022,"value":158},{"year":2023,"value":211},{"year":2024,"value":233},{"year":2025,"value":220},{"year":2026,"value":233}]}', '2026-10-09 18:11:40');
INSERT INTO `wsj_billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('3', 3, 'Jeff Bezos', '$194 B', 'UP', '60', 'United States', 'Amazon', 'Technology', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', 'Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage.', 2026, 'Executive Chair, Amazon', '$194B', '▼ $800M (0.41%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":72},{"year":2018,"value":112},{"year":2019,"value":131},{"year":2020,"value":113},{"year":2021,"value":177},{"year":2022,"value":171},{"year":2023,"value":114},{"year":2024,"value":194},{"year":2025,"value":190},{"year":2026,"value":194}]', '{"id":"3","rank":3,"name":"Jeff Bezos","netWorth":"$194 B","changeStatus":"UP","age":60,"country":"United States","source":"Amazon","industry":"Technology","photoUrl":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80","highlightText":"Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage.","endYear":2026,"titleRole":"Executive Chair, Amazon","realTimeNetWorth":"$194B","realTimeChange":"▼ $800M (0.41%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":72},{"year":2018,"value":112},{"year":2019,"value":131},{"year":2020,"value":113},{"year":2021,"value":177},{"year":2022,"value":171},{"year":2023,"value":114},{"year":2024,"value":194},{"year":2025,"value":190},{"year":2026,"value":194}]}', '2026-10-09 18:11:40');
INSERT INTO `wsj_billionaires` (`id`, `rank`, `name`, `net_worth`, `change_status`, `age`, `country`, `source`, `industry`, `photo_url`, `highlight_text`, `end_year`, `title_role`, `real_time_net_worth`, `real_time_change`, `real_time_as_of`, `list_net_worth_as_of`, `photo_credit`, `editor_last_updated`, `editor_bullet_points`, `in_their_own_words_quote`, `self_made_score`, `philanthropy_score`, `residence`, `citizenship`, `marital_status`, `children`, `education`, `did_you_know_facts`, `wealth_history`, `data`, `updated_at`) VALUES ('4', 4, 'Mark Zuckerberg', '$177 B', 'UP', '40', 'United States', 'Meta', 'Technology', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', 'Mark Zuckerberg started Facebook at Harvard in 2004 at age 19.', 2026, 'CEO, Meta', '$177B', '▲ $3.4B (1.95%)', '10/7/26', '3/10/26', 'TIMES CHICAGO FOR BILLIONAIRES', '', '[]', '', '', '', '', '', '', '', '', '[]', '[{"year":2017,"value":56},{"year":2018,"value":71},{"year":2019,"value":62},{"year":2020,"value":54},{"year":2021,"value":97},{"year":2022,"value":67},{"year":2023,"value":64},{"year":2024,"value":177},{"year":2025,"value":170},{"year":2026,"value":177}]', '{"id":"4","rank":4,"name":"Mark Zuckerberg","netWorth":"$177 B","changeStatus":"UP","age":40,"country":"United States","source":"Meta","industry":"Technology","photoUrl":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80","highlightText":"Mark Zuckerberg started Facebook at Harvard in 2004 at age 19.","endYear":2026,"titleRole":"CEO, Meta","realTimeNetWorth":"$177B","realTimeChange":"▲ $3.4B (1.95%)","realTimeAsOf":"10/7/26","listNetWorthAsOf":"3/10/26","photoCredit":"TIMES CHICAGO FOR BILLIONAIRES","wealthHistory":[{"year":2017,"value":56},{"year":2018,"value":71},{"year":2019,"value":62},{"year":2020,"value":54},{"year":2021,"value":97},{"year":2022,"value":67},{"year":2023,"value":64},{"year":2024,"value":177},{"year":2025,"value":170},{"year":2026,"value":177}]}', '2026-10-09 18:11:41');

