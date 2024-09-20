-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: sus.com:3306
-- Generation Time: May 16, 2023 at 09:16 PM
-- Server version: 8.0.33-0ubuntu0.20.04.2
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sus`
--

-- --------------------------------------------------------

--
-- Table structure for table `banned_users`
--

CREATE TABLE `banned_users` (
  `table_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `reason` text,
  `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_ts` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` bigint NOT NULL,
  `story_id` varchar(4) DEFAULT NULL,
  `comment` varchar(4096) DEFAULT NULL,
  `replied_to` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `created_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_ts` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_ts` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `email_domains`
--

CREATE TABLE `email_domains` (
  `table_id` int NOT NULL,
  `domain` text,
  `status` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'allow or deny'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_domains`
--

INSERT INTO `email_domains` (`table_id`, `domain`, `status`) VALUES
(1, 'lenfly.com', 'blocked'),
(2, 'jollyfree.com', 'blocked'),
(3, 'chimpad.com', 'blocked'),
(4, 'anlubi.com', 'blocked'),
(5, 'aregods.com', 'blocked'),
(6, 'jeoce.com', 'blocked'),
(7, 'nedoz.com', 'blocked'),
(8, 'yubua.com', 'blocked'),
(9, 'offsala.com', 'blocked'),
(10, 'altpano.com', 'blocked'),
(11, 'otodir.com', 'blocked'),
(12, 'lurenwu.com', 'blocked'),
(13, 'rxcay.com', 'blocked'),
(14, 'test.com', 'blocked'),
(15, 'vasqa.com', 'blocked'),
(16, 'example.com', 'blocked'),
(17, 'xitudy.com', 'blocked'),
(18, 'ulforex.com', 'blocked'),
(19, 'cdfaq.com', 'blocked'),
(20, 'nicoimg.com', 'blocked'),
(21, 'nezid.com', 'blocked'),
(22, 'emergentvillage.org', 'blocked'),
(23, 'esmoud.com', 'blocked'),
(24, 'pelung.com', 'blocked'),
(25, 'mrmemorial.com', 'blocked'),
(26, 'keyido.com', 'blocked'),
(27, 'mailfirst.icu', 'blocked'),
(28, 'vusra.com', 'blocked'),
(29, 'edxplus.com', 'blocked'),
(30, 'vansth.com', 'blocked'),
(31, 'geekjun.com', 'blocked'),
(32, 'dineroa.com', 'blocked'),
(33, 'pahed.com', 'blocked'),
(34, 'getnada.com', 'blocked'),
(35, 'yopmail.com', 'blocked'),
(36, 'bongcs.com', 'blocked'),
(37, 'tormails.com', 'blocked'),
(38, 'orlydns.com', 'blocked'),
(39, 'mailinator.com', 'blocked'),
(40, 'migonom.com', 'blocked'),
(41, 'tmmcv.net', 'blocked'),
(42, 'deitada.com', 'blocked'),
(43, 'matra.site', 'blocked'),
(44, 'tmmbt.net', 'blocked'),
(45, 'mailinater.com', 'blocked'),
(46, 'civikli.com', 'blocked'),
(47, 'charav.com', 'blocked'),
(48, 'haboty.com', 'blocked'),
(49, 'sdvft.com', 'blocked'),
(50, 'imdutex.com', 'blocked'),
(51, 'tmmbt.com', 'blocked'),
(52, 'dmtubes.com', 'blocked'),
(53, 'hoxds.com', 'blocked'),
(54, 'ktasy.com', 'blocked'),
(55, 'harcity.com', 'blocked'),
(56, 'xcoxc.com', 'blocked'),
(57, 'coooooool.com', 'blocked'),
(58, 'hostovz.com', 'blocked'),
(59, 'gmaol.com', 'blocked'),
(60, 'sharklasers.com', 'blocked'),
(61, 'fgvod.com', 'blocked'),
(62, 'pamaweb.com', 'blocked'),
(63, 'lidely.com', 'blocked'),
(64, 'kixotic.com', 'blocked'),
(65, 'msn.com', 'blocked'),
(66, 'gmail.co', 'blocked'),
(67, 'pp.com', 'blocked'),
(68, 'gotgel.org', 'blocked'),
(69, 'lance7.com', 'blocked'),
(70, 'sopulit.com', 'blocked'),
(71, 'klblogs.com', 'blocked'),
(72, 'kuvasin.com', 'blocked'),
(73, 'probdd.com', 'blocked'),
(74, 'exdonuts.com', 'blocked'),
(75, 'nubotel.com', 'blocked'),
(76, 'tmmcv.com', 'blocked'),
(77, 'teknowa.com', 'blocked'),
(78, 'turuma.com', 'blocked'),
(79, 'deaikon.com', 'blocked'),
(80, 'decabg.eu', 'blocked'),
(81, 'britishpreschool.net', 'blocked'),
(82, 'covbase.com', 'blocked'),
(83, 'edinel.com', 'blocked'),
(84, 'ceoshub.com', 'blocked'),
(85, 'cnogs.com', 'blocked'),
(86, 'cosaxu.com', 'blocked'),
(87, 'disposeamail.com', 'blocked'),
(88, 'randrai.com', 'blocked'),
(89, 'bitvoo.com', 'blocked'),
(90, 'dni8.com', 'blocked'),
(91, 'areosur.com', 'blocked'),
(92, 'tmmwj.com', 'blocked'),
(93, 'razuz.com', 'blocked'),
(94, 'emailkom.live', 'blocked'),
(95, 'irebah.com', 'blocked'),
(96, 'kaftee.com', 'blocked'),
(97, 'cmeinbox.com', 'blocked'),
(98, 'trash-mail.com', 'blocked'),
(99, 'lambsauce.de', 'blocked'),
(100, 'dewareff.com', 'blocked'),
(101, 'cnxcoin.com', 'blocked'),
(102, 'usharer.com', 'blocked'),
(103, 'ibansko.com', 'blocked'),
(104, 'fom8.com', 'blocked'),
(105, 'fandua.com', 'blocked'),
(106, 'ekcsoft.com', 'blocked'),
(107, 'omeie.com', 'blocked'),
(108, 'brandoza.com', 'blocked'),
(109, 'vingood.com', 'blocked'),
(110, 'guerrillamail.com', 'blocked'),
(111, 'zslsz.com', 'blocked'),
(112, 'gufum.com', 'blocked'),
(113, 'lenfly.com', 'blocked'),
(114, 'gmail.com', 'allowed'),
(115, 'protonmail.com', 'allowed'),
(116, 'outlook.com', 'allowed'),
(117, 'yahoo.com', 'allowed'),
(118, 'icloud.com', 'allowed'),
(119, 'rocketmail.com', 'allowed'),
(120, 'hotmail.com', 'allowed'),
(121, 'me.com', 'allowed'),
(122, 'oscarlone.no', 'allowed'),
(123, 'maaster.de', 'allowed'),
(124, 'seznam.cz', 'allowed'),
(125, 'hotmail.co.uk', 'allowed'),
(126, 'aol.com', 'allowed'),
(127, 'mail.com', 'allowed'),
(128, 'web.de', 'allowed'),
(129, 'proton.me', 'allowed'),
(130, 'fhacademics.org', 'allowed'),
(131, 'tutanota.com', 'allowed'),
(132, 'sky.com', 'allowed'),
(133, 'kvhrw.com', 'allowed'),
(134, 'gmx.de', 'allowed'),
(135, 'louisville.edu', 'allowed'),
(136, 'hitmail.com', 'allowed'),
(137, 'virginmedia.com', 'allowed'),
(138, 'gmail.con', 'allowed'),
(139, 'bvhrk.com', 'allowed'),
(140, 'google.com', 'allowed'),
(141, 'abv.bg', 'allowed'),
(142, 'gmx.net', 'allowed'),
(143, 'bvhrs.com', 'allowed'),
(144, 'gmx.com', 'allowed'),
(145, 'ualberta.ca', 'allowed'),
(146, 'mail.ru', 'allowed'),
(147, 'live.com', 'allowed'),
(148, 'live.com.mx', 'allowed'),
(149, 'btcmod.com', 'allowed'),
(150, 'outlook.fr', 'allowed'),
(151, 'yahoo.de', 'allowed'),
(152, 'gamail.com', 'allowed'),
(153, 'yahoo.ca', 'allowed'),
(154, 'ecolelesommet.com', 'allowed'),
(155, 'kvhrs.com', 'allowed'),
(156, 'kvhrr.com', 'allowed'),
(157, 'live.fr', 'allowed'),
(158, 'live.com.pt', 'allowed'),
(159, 'live.at', 'allowed'),
(160, 'drop.com', 'allowed'),
(161, 'hmail.com', 'allowed'),
(162, 'yandex.ru', 'allowed'),
(163, 'triad.rr.com', 'allowed'),
(164, 'proton.net', 'allowed'),
(165, 'web3.net', 'allowed'),
(166, 'ymail.com', 'allowed'),
(167, 'msn.co.uk', 'allowed'),
(168, 'live.co.uk', 'allowed'),
(169, 'sckae.com', 'allowed'),
(170, 'jeff.com', 'allowed'),
(171, 'srmist.edu.in', 'allowed'),
(172, 'trashmail.live', 'allowed'),
(173, 'hotmail.com.tr', 'allowed'),
(174, 'outlook.de', 'allowed'),
(175, 'aim.com', 'allowed'),
(176, 'doitups.com', 'allowed'),
(177, 'me.con', 'allowed'),
(178, 'kobrandly.com', 'allowed'),
(179, 'yahoo.com.my', 'allowed'),
(180, 'hphasesw.com', 'allowed'),
(181, 'supermail.com', 'allowed'),
(182, 'hrfjc.com', 'allowed'),
(183, 'op.com', 'allowed'),
(184, 'duck.com', 'allowed'),
(185, 'naver.com', 'allowed'),
(186, 'monkeymail.com', 'allowed'),
(187, 'yandex.com', 'allowed'),
(188, 'email.com', 'allowed'),
(189, 'outlook.be', 'allowed'),
(190, 'hotmail.de', 'allowed'),
(191, 'hotmail.co', 'allowed'),
(192, 'grapes.cherry', 'allowed'),
(193, 'wp.pl', 'allowed'),
(194, 't-online.de', 'allowed'),
(195, 'away.net', 'allowed'),
(196, 'email.cz', 'allowed'),
(197, 'outlook.es', 'allowed'),
(198, 'tree.com', 'allowed'),
(199, 'balls.net', 'blocked'),
(200, 'chotunai.com', 'blocked'),
(201, 'bymercy.com', 'blocked'),
(202, 'tmmwj.net', 'blocked'),
(203, 'breazeim.com', 'blocked'),
(204, 'brand-app.biz', 'blocked'),
(205, 'finews.biz', 'blocked'),
(206, 'ezgiant.com', 'blocked'),
(207, 'lisovskayab@gmailvn.net', 'allowed'),
(208, 'checkadmin.me', 'blocked'),
(209, 'gmailvn.net', 'blocked'),
(210, 'fsouda.com', 'blocked'),
(211, 'dollstore.org', 'blocked'),
(212, 'guerrillamail.info', 'blocked'),
(213, 'bbitf.com', 'blocked'),
(214, 'bbitq.com', 'blocked'),
(215, 'otanhome.com', 'blocked'),
(216, 'tcwlm.com', 'blocked'),
(217, 'jaga.email', 'blocked'),
(218, 'mirtox.com', 'blocked'),
(219, 'ngopy.com', 'blocked'),
(220, 'waterisgone.com', 'blocked');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint NOT NULL,
  `story_id` varchar(4) DEFAULT NULL,
  `created_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `liked_by_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int NOT NULL,
  `reported_by` bigint DEFAULT NULL,
  `reported_on` text,
  `type` text,
  `message` varchar(4096) DEFAULT NULL,
  `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_comment` text,
  `admin_reviewed` tinyint(1) DEFAULT '0',
  `admin_reviewed_ts` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL COMMENT 'creator of this fragment',
  `story_id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_ts` timestamp NULL DEFAULT NULL,
  `item_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '(e.g., Title, Image, Message)',
  `meta_data` longtext,
  `item_order` int DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `payload_number` bigint DEFAULT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `NSFW` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint NOT NULL,
  `email` varchar(512) DEFAULT NULL,
  `user_name` varchar(512) DEFAULT NULL,
  `password_hash` varchar(1024) DEFAULT NULL,
  `password_reset_code` int DEFAULT NULL,
  `password_reset_code_created_ts` timestamp NULL DEFAULT NULL,
  `pfp` varchar(512) DEFAULT NULL,
  `created_ts` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_ts` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `verified` tinyint(1) DEFAULT '0' COMMENT '0 = not verified, 1 = verified',
  `deleted` tinyint(1) DEFAULT '0',
  `deleted_ts` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `user_name`, `password_hash`, `password_reset_code`, `password_reset_code_created_ts`, `pfp`, `created_ts`, `verified`, `deleted`, `deleted_ts`) VALUES
(88, 'test@test.com', 'very_sus', '$argon2id$v=19$m=65536,t=3,p=4$C/kL20xHl72Me25x/2sPDg$ux5jFL3RVovGj5nK2gy+8VZSuhCxpLCxCjSXbYwmboU', NULL, NULL, '02ddddb7a8629f1567ebf39a49a58b28.jpg', '2023-04-14 16:07:05', 0, 0, NULL),
(89, 'test2@test.com', 'the_second _one', '$argon2id$v=19$m=65536,t=3,p=4$Ar/kkpo8bmf0X6xkHwx9MQ$GXqQAjrNxfGH+jI5lpPE/IoyNXC+ZhBDrykYxw/gOMY', NULL, NULL, '0abc2fbea16cd63d65cff13db8658719.jpg', '2023-04-28 17:44:36', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_premium`
--

CREATE TABLE `user_premium` (
  `table_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `max_images_per_story` int DEFAULT NULL,
  `max_videos_per_story` int DEFAULT NULL,
  `max_messages_per_story` int DEFAULT NULL,
  `max_image_size` int DEFAULT NULL,
  `max_video_size` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banned_users`
--
ALTER TABLE `banned_users`
  ADD PRIMARY KEY (`table_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `email_domains`
--
ALTER TABLE `email_domains`
  ADD PRIMARY KEY (`table_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_premium`
--
ALTER TABLE `user_premium`
  ADD PRIMARY KEY (`table_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banned_users`
--
ALTER TABLE `banned_users`
  MODIFY `table_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `email_domains`
--
ALTER TABLE `email_domains`
  MODIFY `table_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1079;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `user_premium`
--
ALTER TABLE `user_premium`
  MODIFY `table_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banned_users`
--
ALTER TABLE `banned_users`
  ADD CONSTRAINT `banned_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `user_premium`
--
ALTER TABLE `user_premium`
  ADD CONSTRAINT `user_premium_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
