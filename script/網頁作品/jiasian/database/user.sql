-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-04-24 08:55:34
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `user`
--

-- --------------------------------------------------------

--
-- 資料表結構 `user_account`
--

CREATE TABLE `user_account` (
  `id` int(6) UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_account`
--

INSERT INTO `user_account` (`id`, `email`, `username`, `password`, `reg_date`) VALUES
(13, 'tiger2@abc.com', 'tiger2', '81dc9bdb52d04dc20036dbd8313ed055', '2024-04-23 01:37:13'),
(17, 'tiger3@qqq.com', 'tiger3', '827ccb0eea8a706c4c34a16891f84e7b', '2024-04-24 06:20:07');

-- --------------------------------------------------------

--
-- 資料表結構 `user_article`
--

CREATE TABLE `user_article` (
  `id` int(6) UNSIGNED NOT NULL,
  `user_id` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(500) NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  `reg_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_article`
--

INSERT INTO `user_article` (`id`, `user_id`, `username`, `title`, `content`, `img`, `reg_date`) VALUES
(11, '10', 'bill', 'test', '1111111111111111111111111111111111111111\n222222222222222222222222222222222222222\n333333333333333333333333333333333333\n4444444444444444444', '/php_project_demo/src/img/1713773798_bill.jpg', '2024-04-22 08:16:38'),
(12, '10', 'bill', '123', '123123123', '/enzo/src/img/1713777446_bill.jpg', '2024-04-22 09:17:26'),
(13, '10', 'bill', 'Hello ', 'halo halo', '/enzo/src/img/1713777984_bill.jpg', '2024-04-22 09:26:24'),
(14, '11', 'jobs', 'test', 'Halo ', '/php_project_demo/src/img/1713778136_jobs.jpg', '2024-04-22 09:28:56'),
(15, '13', 'tiger2', 'Happy', 'Happy Boy', '/enzo/src/img/1713841229_tiger2.jpg', '2024-04-23 03:00:29'),
(16, '13', 'tiger2', 'Happy', 'Happy happy', '/enzo/src/img/1713843101_tiger2.jpg', '2024-04-23 03:31:41'),
(17, '17', 'tiger3', 'Hello 2024/4/24', 'Hello !\n 2024/4/24', '/enzo/src/img/1713934640_tiger3.jpg', '2024-04-24 04:57:20'),
(18, '17', 'tiger3', 'Happy 123', 'Happy 123', '/enzo/src/img/1713938560_tiger3.jpg', '2024-04-24 06:02:40');

-- --------------------------------------------------------

--
-- 資料表結構 `user_message`
--

CREATE TABLE `user_message` (
  `id` int(6) UNSIGNED NOT NULL,
  `article_id` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `content` varchar(100) NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_message`
--

INSERT INTO `user_message` (`id`, `article_id`, `username`, `content`, `reg_date`) VALUES
(1, '6', ' ✊✊✊ ', ' 🤯 ', '2020-04-07 07:44:25'),
(12, '15', 'tiger2', 'very good', '2024-04-23 03:00:44'),
(13, '16', 'tiger5', 'tiger5 !!', '2024-04-23 03:32:43'),
(14, '17', 'tiger2', 'fff', '2024-04-24 06:28:06');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user_article`
--
ALTER TABLE `user_article`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user_message`
--
ALTER TABLE `user_message`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_article`
--
ALTER TABLE `user_article`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_message`
--
ALTER TABLE `user_message`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
