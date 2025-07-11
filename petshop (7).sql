-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2025 at 08:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `petshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `browsing_history`
--

CREATE TABLE `browsing_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `pet_id`, `product_id`, `quantity`, `created_at`) VALUES
(1, 3, 1, NULL, 4, '2025-05-14 00:36:18'),
(2, 3, 3, NULL, 1, '2025-05-14 09:31:20'),
(5, 4, 3, NULL, 1, '2025-05-26 04:59:42'),
(29, 4, 1, NULL, 1, '2025-06-14 02:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `is_reported` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `pet_id`, `parent_id`, `content`, `is_reported`, `created_at`) VALUES
(1, 5, 2, NULL, 'gút', 0, '2025-06-15 15:51:36'),
(2, 5, 2, NULL, 'gút', 0, '2025-06-15 15:54:05'),
(3, 5, 3, NULL, 'gút', 0, '2025-06-15 16:46:02'),
(16, 5, 90, NULL, ':((', 1, '2025-06-15 18:17:07'),
(17, 6, 90, 16, ':((((', 1, '2025-06-15 18:17:17'),
(18, 5, 90, NULL, ':)))', 0, '2025-06-15 18:26:47'),
(19, 5, 90, 18, ':))', 0, '2025-06-15 18:26:55');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','shipped','completed','cancelled') DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('paid','unpaid') DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `shipping_method_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_date`, `total_price`, `status`, `payment_method`, `payment_status`, `shipping_address`, `shipping_method_id`) VALUES
(1, 5, '2025-05-29 20:28:56', 1438360.00, 'completed', 'COD', 'paid', 'So 1 Nguyen Nghiem, Xã Trà Giang, Huyện Trà Bồng, Tỉnh Quảng Ngãi', 1),
(2, 5, '2025-05-30 06:07:09', 4630238.00, 'completed', 'COD', 'paid', 'So 1 Nguyen Nghiem, Xã Đức Hòa, Huyện Mộ Đức, Tỉnh Quảng Ngãi', 1),
(3, 5, '2025-05-30 06:13:58', 356636.00, 'completed', 'COD', 'paid', 'So 1 Nguyen Nghiem, Phường Lê Hồng Phong, Thành phố Phủ Lý, Tỉnh Hà Nam', 1),
(4, 5, '2025-05-30 06:27:15', 3026534.00, 'completed', 'COD', 'paid', 'So 1 Nguyen Nghiem, Xã Pá Hu, Huyện Trạm Tấu, Tỉnh Yên Bái', 3),
(5, 5, '2025-05-30 06:35:26', 470083.00, 'pending', 'COD', 'unpaid', 'So 1 Nguyen Nghiem, Xã Vân Sơn, Huyện Tân Lạc, Tỉnh Hoà Bình', 1),
(6, 5, '2025-05-30 06:45:02', 1029803.00, 'pending', 'COD', 'unpaid', 'So 1 Nguyen Nghiem, Xã Xuân Quang, Huyện Bảo Thắng, Tỉnh Lào Cai', 1),
(7, 5, '2025-06-13 20:15:19', 356636.00, 'completed', 'COD', 'unpaid', 'so1, Phường Đồng Xuân, Quận Hoàn Kiếm, Thành phố Hà Nội', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `pet_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 3, NULL, 1, 326636.00),
(2, 1, 1, NULL, 1, 844288.00),
(3, 1, 90, NULL, 1, 237436.00),
(4, 2, 1, NULL, 4, 844288.00),
(5, 2, 5, NULL, 1, 793005.00),
(6, 2, 109, NULL, 1, 430081.00),
(7, 3, 3, NULL, 1, 326636.00),
(8, 4, 163, NULL, 1, 982794.00),
(9, 4, 42, NULL, 1, 972430.00),
(10, 4, 20, NULL, 1, 971310.00),
(11, 5, 43, NULL, 1, 211271.00),
(12, 5, 79, NULL, 1, 228812.00),
(13, 6, 26, NULL, 1, 999803.00),
(14, 7, 3, NULL, 1, 326636.00);

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `species` varchar(50) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` enum('small','medium','large') DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('available','sold','pending') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `name`, `species`, `breed`, `price`, `quantity`, `gender`, `age`, `color`, `size`, `origin`, `description`, `status`, `created_at`) VALUES
(1, 'chim canari', 'bird', 'goldfinch', 844288, 5, 'female', 5, 'brown', 'large', 'Usa', 'STRONG', 'available', '2025-04-24 13:50:37'),
(2, 'hoang-yen', 'bird', 'goldfinch', 413832, 0, 'male', 10, 'black', 'medium', 'Vietnam', 'Perfect for apartment living.', 'sold', '2025-04-24 13:50:37'),
(3, 'anhdaidienchim', 'bird', 'robin', 326636, 1, 'female', 10, 'gold', 'medium', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(4, 'abyssinia', 'cat', 'egyptian_cat', 594849, 1, 'male', 15, 'black', 'small', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(5, 'bao-bengal', 'cat', 'egyptian_cat', 793005, 1, 'male', 14, 'black', 'small', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(6, 'coc-duoi-nhat-ban', 'cat', 'egyptian_cat', 271523, 1, 'male', 3, 'cream', 'small', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(7, 'korat', 'cat', 'egyptian_cat', 296082, 1, 'female', 6, 'black', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(8, 'maine-coon', 'cat', 'egyptian_cat', 605786, 1, 'female', 10, 'cream', 'large', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(9, 'meoanhlongngan', 'cat', 'egyptian_cat', 452639, 1, 'female', 5, 'brown', 'medium', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(10, 'mien-dien', 'cat', 'egyptian_cat', 353847, 1, 'male', 12, 'gray', 'small', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(11, 'moggie', 'cat', 'egyptian_cat', 682564, 1, 'male', 1, 'brown', 'medium', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(12, 'nga-xanh', 'cat', 'egyptian_cat', 684739, 1, 'male', 13, 'gold', 'large', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(13, 'ocicat', 'cat', 'egyptian_cat', 619992, 1, 'female', 7, 'white', 'large', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(14, 'rex-cornwall', 'cat', 'egyptian_cat', 723297, 1, 'male', 3, 'gold', 'small', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(15, 'rex-devon', 'cat', 'egyptian_cat', 851981, 1, 'female', 15, 'white', 'small', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(16, 'somali', 'cat', 'egyptian_cat', 829548, 1, 'female', 6, 'black', 'medium', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(17, 'tai-cup-scotland', 'cat', 'egyptian_cat', 229230, 1, 'female', 10, 'gold', 'medium', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(18, 'tiffanie', 'cat', 'egyptian_cat', 868634, 1, 'female', 9, 'brown', 'small', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(19, 'sphynx-khong-long', 'cat', 'hog', 662609, 1, 'female', 3, 'cream', 'large', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(20, 'anhdaidienmeo', 'cat', 'lynx', 971310, 1, 'female', 11, 'cream', 'medium', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(21, 'rung-na-uy', 'cat', 'lynx', 466017, 1, 'female', 15, 'white', 'medium', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(22, 'siberian', 'cat', 'lynx', 908268, 1, 'male', 9, 'black', 'large', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(23, 'anh-long-ngan', 'cat', 'persian_cat', 649458, 1, 'female', 1, 'gold', 'large', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(24, 'ba-tu', 'cat', 'persian_cat', 745375, 1, 'female', 14, 'white', 'medium', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(25, 'birman', 'cat', 'persian_cat', 298253, 1, 'male', 12, 'gray', 'small', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(26, 'chinchilla', 'cat', 'persian_cat', 999803, 1, 'female', 6, 'brown', 'small', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(27, 'ragdoll', 'cat', 'persian_cat', 500647, 1, 'female', 4, 'cream', 'medium', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(28, 'tat-trang', 'cat', 'persian_cat', 922911, 1, 'male', 14, 'gray', 'large', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(29, 'tonkin', 'cat', 'persian_cat', 720582, 1, 'male', 1, 'cream', 'large', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(30, 'scottish-deerhound', 'cat', 'scottish_deerhound', 326102, 1, 'male', 13, 'black', 'medium', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(31, 'bali', 'cat', 'siamese_cat', 259937, 1, 'male', 4, 'gold', 'medium', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(32, 'xiem', 'cat', 'siamese_cat', 478184, 1, 'female', 13, 'black', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(33, 'ba-tu-long-ngan', 'cat', 'tabby_cat', 708161, 1, 'male', 5, 'gray', 'medium', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(34, 'long-ngan-phuong-dong', 'cat', 'tabby_cat', 819044, 1, 'female', 6, 'gold', 'medium', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(35, 'manx', 'cat', 'tabby_cat', 300961, 1, 'male', 3, 'white', 'large', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(36, 'bulldog', 'cow', 'boxer', 593766, 1, 'male', 2, 'cream', 'small', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(37, 'beagle', 'cow', 'english_foxhound', 448602, 1, 'female', 2, 'white', 'medium', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(38, 'english-foxhound', 'cow', 'english_foxhound', 877065, 1, 'male', 7, 'white', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(39, 'pointer', 'cow', 'english_foxhound', 588432, 1, 'female', 12, 'gray', 'medium', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(40, 'smooth-fox-terrier', 'cow', 'english_foxhound', 572375, 1, 'female', 9, 'white', 'large', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(41, 'boxer', 'cow', 'rhodesian_ridgeback', 392565, 1, 'female', 3, 'cream', 'medium', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(42, 'anhdaidienalaska', 'dog', 'alaskan_malamute', 972430, 1, 'male', 4, 'cream', 'medium', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(43, 'siberian-huskys', 'dog', 'alaskan_malamute', 211271, 1, 'female', 4, 'cream', 'large', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(44, 'staffordshire-bull-terrier', 'dog', 'american_staffordshire_terrier', 501863, 1, 'male', 1, 'brown', 'large', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(45, 'silky-terrier', 'dog', 'australian_terrier', 613469, 1, 'female', 15, 'gold', 'large', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(46, 'basset-hound', 'dog', 'basset', 738622, 1, 'male', 15, 'white', 'large', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(47, 'manchester-terrier', 'dog', 'black-and-tan_coonhound', 265546, 1, 'female', 4, 'black', 'small', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(48, 'glen-of-imaal-terrier', 'dog', 'border_terrier', 761195, 1, 'male', 7, 'gray', 'medium', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(49, 'pyrenean-shepherd', 'dog', 'briard', 637333, 1, 'male', 5, 'gray', 'small', 'France', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(50, 'skye-terrier', 'dog', 'briard', 942957, 1, 'female', 3, 'cream', 'medium', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(51, 'nova-scotia-duck-tolling-retriever', 'dog', 'brittany_spaniel', 483001, 1, 'female', 11, 'cream', 'large', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(52, 'french-bulldog', 'dog', 'bull_mastiff', 305228, 1, 'female', 1, 'gold', 'large', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(53, 'cairn-terrier', 'dog', 'cairn', 451076, 1, 'male', 8, 'white', 'large', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(54, 'chihuahua', 'dog', 'chihuahua', 372947, 1, 'male', 11, 'cream', 'small', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(55, 'singapura', 'dog', 'chihuahua', 318925, 1, 'female', 15, 'black', 'large', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(56, 'shiba-inu', 'dog', 'chow', 804945, 1, 'male', 6, 'white', 'large', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(57, 'shetland-sheepdog', 'dog', 'collie', 626795, 1, 'female', 2, 'cream', 'small', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(58, 'dalmatian', 'dog', 'dalmatian', 240634, 1, 'male', 1, 'white', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(59, 'dandie-dinmont-terrier', 'dog', 'dandie_dinmont', 668092, 1, 'female', 13, 'brown', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(60, 'akita', 'dog', 'dingo', 840036, 1, 'female', 4, 'gray', 'large', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(61, 'australian-shepherd', 'dog', 'english_setter', 357197, 1, 'female', 9, 'brown', 'small', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(62, 'burmilla', 'dog', 'eskimo_dog', 821357, 1, 'female', 11, 'white', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(63, 'siberian-husky', 'dog', 'eskimo_dog', 273959, 1, 'female', 1, 'brown', 'medium', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(64, 'flat-coated-retriever', 'dog', 'flat-coated_retriever', 764368, 1, 'male', 15, 'white', 'small', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(65, 'german-shepherd', 'dog', 'german_shepherd', 375480, 1, 'female', 2, 'white', 'large', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(66, 'golden-retriever', 'dog', 'golden_retriever', 867096, 1, 'male', 7, 'brown', 'medium', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(67, 'kerry-blue-terrier', 'dog', 'kerry_blue_terrier', 304643, 1, 'male', 3, 'cream', 'large', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(68, 'labrador-retriever', 'dog', 'labrador_retriever', 544104, 1, 'female', 3, 'cream', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(69, 'lakeland-terrier', 'dog', 'lakeland_terrier', 418766, 1, 'male', 9, 'white', 'medium', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(70, 'welsh-terrier', 'dog', 'lakeland_terrier', 252999, 1, 'female', 14, 'white', 'large', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(71, 'maltese', 'dog', 'maltese_dog', 361672, 1, 'female', 1, 'cream', 'large', 'France', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(72, 'norfolk-terrier', 'dog', 'norfolk_terrier', 852551, 1, 'female', 9, 'black', 'small', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(73, 'norwich-terrier', 'dog', 'norwich_terrier', 526609, 1, 'male', 12, 'cream', 'medium', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(74, 'old-english-sheepdog', 'dog', 'old_english_sheepdog', 388284, 1, 'male', 15, 'white', 'small', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(75, 'pug', 'dog', 'pug', 368266, 1, 'female', 2, 'white', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(76, 'sealyham-terrier', 'dog', 'sealyham_terrier', 814773, 1, 'female', 1, 'brown', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(77, 'tho-californian', 'dog', 'sealyham_terrier', 203458, 1, 'female', 2, 'gold', 'large', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(78, 'soft-coated-wheaten-terrier', 'dog', 'soft-coated_wheaten_terrier', 833748, 1, 'female', 5, 'white', 'small', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(79, 'spanish-water-dog', 'dog', 'standard_poodle', 228812, 1, 'male', 13, 'gray', 'large', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(80, 'lhasa-apso', 'dog', 'tibetan_terrier', 406448, 1, 'female', 9, 'black', 'small', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(81, 'lowchen', 'dog', 'tibetan_terrier', 595079, 1, 'female', 1, 'gray', 'large', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(82, 'tibetan-terrier', 'dog', 'tibetan_terrier', 275645, 1, 'male', 5, 'cream', 'medium', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(83, 'boston-terrier', 'dog', 'toy_terrier', 503037, 1, 'female', 1, 'black', 'large', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(84, 'miniature-bull-terrier', 'dog', 'toy_terrier', 802984, 1, 'female', 4, 'gold', 'large', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(85, 'toy-fox-terrier', 'dog', 'toy_terrier', 369164, 1, 'male', 4, 'cream', 'medium', 'Germany', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(86, 'west-highland-white-terrier', 'dog', 'west_highland_white_terrier', 268428, 1, 'female', 9, 'brown', 'large', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(87, 'wire-fox-terrier', 'dog', 'wire-haired_fox_terrier', 907716, 1, 'male', 14, 'gold', 'medium', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(88, 'yorkshire-terrier', 'dog', 'yorkshire_terrier', 613181, 1, 'male', 3, 'white', 'medium', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(89, 'ca-clown', 'fish', 'anemone_fish', 916716, 1, 'female', 11, 'black', 'large', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(90, 'ca-canh-ca-voi', 'fish', 'goldfish', 237436, 1, 'male', 8, 'white', 'large', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(91, 'ca-canh-guppy', 'fish', 'goldfish', 588678, 1, 'female', 13, 'gray', 'medium', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(92, 'ca-canh-guppy1', 'fish', 'goldfish', 358847, 1, 'male', 1, 'white', 'large', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(93, 'ca-canh-malawi', 'fish', 'goldfish', 777251, 1, 'male', 3, 'white', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(94, 'ca-canh-swordtail', 'fish', 'goldfish', 634403, 1, 'female', 3, 'brown', 'large', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(95, 'ca-hoi-nhat-ban', 'fish', 'goldfish', 317097, 1, 'male', 10, 'white', 'small', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(96, 'ca-koi', 'fish', 'goldfish', 709833, 1, 'female', 12, 'brown', 'large', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(97, 'ca-surgeon', 'fish', 'goldfish', 243706, 1, 'male', 2, 'cream', 'large', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(98, 'ca-betta', 'fish', 'macaw', 868552, 1, 'male', 10, 'gray', 'large', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(99, 'tho-nertherland-dwarf', 'hamster', 'hamster', 773592, 1, 'male', 4, 'brown', 'large', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(100, 'ran-boa-canh', 'lizard', 'green_lizard', 513821, 1, 'female', 6, 'white', 'large', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(101, 'tho-lionhead', 'other', 'angora', 328795, 1, 'female', 4, 'cream', 'medium', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(102, 'bernese-mountain', 'other', 'appenzeller', 260019, 1, 'male', 1, 'black', 'small', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(103, 'finnish-spitz', 'other', 'basenji', 258953, 1, 'female', 15, 'gray', 'small', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(104, 'cavalier-king-charles-spaniel', 'other', 'blenheim_spaniel', 358613, 1, 'male', 3, 'gray', 'small', 'Germany', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(105, 'king-charles-spaniel', 'other', 'blenheim_spaniel', 957787, 1, 'male', 13, 'gold', 'medium', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(106, 'border-collie', 'other', 'border_collie', 685018, 1, 'female', 9, 'cream', 'small', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(107, 'borzoi', 'other', 'borzoi', 506774, 1, 'male', 5, 'gray', 'small', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(108, 'english-setter', 'other', 'brittany_spaniel', 470265, 1, 'female', 3, 'brown', 'medium', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(109, 'chim-sao', 'other', 'bulbul', 430081, 1, 'female', 14, 'cream', 'medium', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(110, 'bullmastiff', 'other', 'bull_mastiff', 374898, 1, 'male', 11, 'black', 'small', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(111, 'mastiff', 'other', 'bull_mastiff', 586405, 1, 'male', 6, 'gold', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(112, 'neapolitan-mastiff', 'other', 'bull_mastiff', 544680, 1, 'male', 8, 'brown', 'large', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(113, 'pembroke-welsh-corgi', 'other', 'cardigan', 863064, 1, 'female', 11, 'cream', 'small', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(114, 'chow-chow', 'other', 'chow', 390786, 1, 'female', 15, 'gold', 'large', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(115, 'clumber-spaniel', 'other', 'clumber', 793149, 1, 'male', 5, 'white', 'medium', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(116, 'doberman-pinscher', 'other', 'doberman', 746814, 1, 'male', 10, 'brown', 'large', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(117, 'ca-rong', 'other', 'eel', 330385, 1, 'female', 8, 'gray', 'small', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(118, 'hong-hac', 'other', 'flamingo', 601411, 1, 'male', 3, 'cream', 'large', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(119, 'ca-bay-mau', 'other', 'gar', 720756, 1, 'male', 13, 'brown', 'large', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(120, 'small-munsterlander-pointer', 'other', 'german_short-haired_pointer', 477521, 1, 'female', 4, 'black', 'medium', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(121, 'giant-schnauzer', 'other', 'giant_schnauzer', 741256, 1, 'male', 11, 'brown', 'small', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(122, 'cane-corso', 'other', 'great_dane', 862877, 1, 'female', 14, 'white', 'large', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(123, 'great-dane', 'other', 'great_dane', 411040, 1, 'female', 2, 'brown', 'large', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(124, 'plott', 'other', 'great_dane', 717938, 1, 'male', 14, 'white', 'medium', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(125, 'cu-meo', 'other', 'great_grey_owl', 569536, 1, 'female', 3, 'black', 'small', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(126, 'cu-ngua', 'other', 'great_grey_owl', 628151, 1, 'male', 11, 'white', 'medium', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(127, 'pyrenean-mastiff', 'other', 'great_pyrenees', 601397, 1, 'male', 14, 'gray', 'large', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(128, 'ran-con-canh', 'other', 'green_mamba', 444760, 1, 'male', 8, 'cream', 'medium', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(129, 'italian-greyhound', 'other', 'ibizan_hound', 459630, 1, 'female', 11, 'gray', 'medium', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(130, 'pharaoh-hound', 'other', 'ibizan_hound', 635919, 1, 'female', 6, 'brown', 'medium', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(131, 'irish-setter', 'other', 'irish_setter', 290777, 1, 'female', 5, 'white', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(132, 'lrish-wolfhound', 'other', 'irish_wolfhound', 530777, 1, 'male', 7, 'gray', 'small', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(133, 'greyhound', 'other', 'italian_greyhound', 830420, 1, 'female', 4, 'cream', 'large', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(134, 'chich-choe-lua', 'other', 'jacamar', 826600, 1, 'male', 4, 'gold', 'medium', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(135, 'japanese-chin', 'other', 'japanese_spaniel', 936548, 1, 'female', 8, 'brown', 'medium', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(136, 'shih-tzu', 'other', 'japanese_spaniel', 752603, 1, 'male', 2, 'gold', 'large', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(137, 'keeshond', 'other', 'keeshond', 343791, 1, 'male', 6, 'black', 'large', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(138, 'chim-canh-cut-hoang-gia', 'other', 'king_penguin', 799263, 1, 'male', 15, 'cream', 'small', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(139, 'komondor', 'other', 'komondor', 482565, 1, 'male', 10, 'gray', 'large', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(140, 'kuvasz', 'other', 'kuvasz', 410205, 1, 'male', 9, 'cream', 'medium', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(141, 'ca-cang-co', 'other', 'lorikeet', 860372, 1, 'male', 2, 'gray', 'small', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(142, 'vet-noi', 'other', 'lorikeet', 662796, 1, 'male', 3, 'brown', 'large', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(143, 'phuong-hoang', 'other', 'macaw', 916131, 1, 'male', 11, 'black', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(144, 'chim-dau', 'other', 'magpie', 632514, 1, 'female', 14, 'cream', 'small', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(145, 'chinese-crested', 'other', 'mexican_hairless', 288245, 1, 'male', 10, 'cream', 'medium', 'France', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(146, 'dachshund', 'other', 'mexican_hairless', 300004, 1, 'male', 4, 'gray', 'small', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(147, 'miniature-pinscher', 'other', 'miniature_pinscher', 945595, 1, 'female', 4, 'brown', 'medium', 'Germany', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(148, 'poodle', 'other', 'miniature_poodle', 398104, 1, 'male', 11, 'gold', 'large', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(149, 'norwegian-buhund', 'other', 'norwegian_elkhound', 929072, 1, 'female', 6, 'cream', 'medium', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(150, 'norwegian-elkhound', 'other', 'norwegian_elkhound', 817738, 1, 'male', 3, 'gold', 'small', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(151, 'swedish-vallhund', 'other', 'norwegian_elkhound', 896115, 1, 'male', 13, 'brown', 'large', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(152, 'đa-đieu', 'other', 'ostrich', 874322, 1, 'female', 15, 'gold', 'medium', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(153, 'favicon', 'other', 'other', 416830, 1, 'female', 6, 'white', 'medium', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(154, 'logo', 'other', 'other', 718927, 1, 'female', 9, 'gray', 'large', 'France', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(155, 'logo2', 'other', 'other', 780219, 1, 'female', 4, 'brown', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(156, 'logopetshop', 'other', 'other', 472062, 1, 'female', 11, 'brown', 'large', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(157, 'map-marker', 'other', 'other', 625737, 1, 'female', 6, 'white', 'small', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(158, 'payment-method', 'other', 'other', 428431, 1, 'female', 12, 'black', 'small', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(159, 'payments', 'other', 'other', 272788, 1, 'female', 6, 'gray', 'medium', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(160, 'qrcode', 'other', 'other', 593690, 1, 'male', 8, 'gray', 'medium', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(161, 'search-icon', 'other', 'other', 779732, 1, 'male', 10, 'white', 'large', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(162, 'Unknown_person', 'other', 'other', 408044, 1, 'male', 8, 'gray', 'medium', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(163, 'otterhound', 'other', 'otterhound', 982794, 1, 'female', 13, 'brown', 'large', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(164, 'spinone-italiano', 'other', 'otterhound', 838798, 1, 'female', 7, 'black', 'small', 'France', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(165, 'papillon', 'other', 'papillon', 976992, 1, 'male', 4, 'black', 'large', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(166, 'chim-cong', 'other', 'peacock', 557839, 1, 'female', 14, 'gray', 'small', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(167, 'pekingese', 'other', 'pekinese', 763587, 1, 'male', 15, 'black', 'large', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(168, 'tibetan-spaniel', 'other', 'pekinese', 537340, 1, 'female', 11, 'white', 'medium', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(169, 'corgi', 'other', 'pembroke', 895638, 1, 'male', 6, 'white', 'medium', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(170, 'pomeranian', 'other', 'pomeranian', 301977, 1, 'female', 9, 'gray', 'large', 'Thailand', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(171, 'van-tho-nhi-ky', 'other', 'pomeranian', 926274, 1, 'male', 12, 'cream', 'large', 'Germany', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(172, 'redbone-coonhound', 'other', 'redbone', 354708, 1, 'male', 7, 'gold', 'small', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(173, 'rhodesian-ridgeback', 'other', 'rhodesian_ridgeback', 454513, 1, 'male', 9, 'black', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(174, 'vizsla', 'other', 'rhodesian_ridgeback', 249661, 1, 'female', 5, 'brown', 'medium', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(175, 'rottweiler', 'other', 'rottweiler', 975730, 1, 'female', 4, 'gold', 'large', 'France', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(176, 'saint-bernard', 'other', 'saint_bernard', 978604, 1, 'male', 10, 'black', 'small', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(177, 'saluki', 'other', 'saluki', 472712, 1, 'male', 3, 'gray', 'small', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(178, 'whippet', 'other', 'saluki', 387950, 1, 'male', 10, 'brown', 'large', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(179, 'Jjapanese-spitz', 'other', 'samoyed', 521534, 1, 'female', 14, 'black', 'medium', 'Thailand', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(180, 'samoyed', 'other', 'samoyed', 635845, 1, 'female', 13, 'white', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(181, 'schipperke', 'other', 'schipperke', 537976, 1, 'male', 2, 'gold', 'large', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(182, 'miniature-schnauzer', 'other', 'standard_schnauzer', 667483, 1, 'female', 14, 'white', 'large', 'Germany', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(183, 'standard-schnauzer', 'other', 'standard_schnauzer', 533780, 1, 'female', 7, 'gold', 'medium', 'France', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(184, 'wirehaired-pointing-griffon', 'other', 'standard_schnauzer', 716670, 1, 'female', 2, 'black', 'small', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(185, 'cocker-spaniel', 'other', 'sussex_spaniel', 363779, 1, 'female', 6, 'black', 'large', 'Vietnam', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(186, 'field-spaniel', 'other', 'sussex_spaniel', 320733, 1, 'female', 12, 'gray', 'medium', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(187, 'sussex-spaniel', 'other', 'sussex_spaniel', 853378, 1, 'male', 9, 'cream', 'small', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(188, 'newfoundland', 'other', 'tibetan_mastiff', 892732, 1, 'female', 10, 'black', 'large', 'Vietnam', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(189, 'tibetan-mastiff', 'other', 'tibetan_mastiff', 554786, 1, 'female', 15, 'gold', 'large', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(190, 'đai-bang-harpy', 'other', 'vulture', 866963, 1, 'male', 9, 'gray', 'large', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(191, 'treeing-walker-coonhound', 'other', 'walker_hound', 657030, 1, 'male', 7, 'black', 'medium', 'USA', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(192, 'weimaraner', 'other', 'weimaraner', 554446, 1, 'female', 13, 'black', 'large', 'France', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(193, 'english-springer-spaniel', 'other', 'welsh_springer_spaniel', 516540, 1, 'male', 3, 'black', 'medium', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(194, 'welsh-springer-spaniel', 'other', 'welsh_springer_spaniel', 679735, 1, 'female', 11, 'gray', 'medium', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(195, 'sloughi', 'other', 'whippet', 689670, 1, 'male', 10, 'cream', 'small', 'Germany', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(196, 'tho-dutch', 'rabbit', 'hare', 364086, 1, 'male', 10, 'gold', 'large', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(197, 'tho-flemish-giant', 'rabbit', 'hare', 393310, 1, 'male', 3, 'black', 'small', 'Vietnam', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(198, 'tho-himalayan', 'rabbit', 'hare', 918858, 1, 'female', 11, 'cream', 'medium', 'Germany', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(199, 'tho-holland-op', 'rabbit', 'hare', 322700, 1, 'female', 9, 'gold', 'medium', 'Vietnam', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(200, 'tho-mini-rex.', 'rabbit', 'hare', 897631, 1, 'male', 5, 'black', 'small', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(201, 'tho-angora', 'rabbit', 'wood_rabbit', 236967, 1, 'male', 14, 'gray', 'large', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(202, 'tho-chinchilla', 'rabbit', 'wood_rabbit', 379608, 1, 'male', 8, 'cream', 'medium', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(203, 'tho-jersey-wooly', 'rabbit', 'wood_rabbit', 450861, 1, 'female', 7, 'brown', 'large', 'USA', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(204, 'ran-garter-snake', 'snake', 'garter_snake', 369840, 1, 'male', 6, 'gray', 'large', 'Thailand', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(205, 'ran-green-tree-python', 'snake', 'green_snake', 878479, 1, 'female', 12, 'white', 'small', 'USA', 'Calm and suitable for families.', 'available', '2025-04-24 13:50:37'),
(206, 'ran-king-snake', 'snake', 'green_snake', 602566, 1, 'male', 1, 'gold', 'medium', 'Germany', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(207, 'ran-hognose', 'snake', 'hognose_snake', 458430, 1, 'female', 5, 'cream', 'medium', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(208, 'ran-trai-dau-đo', 'snake', 'indian_cobra', 307527, 1, 'male', 8, 'cream', 'large', 'Thailand', 'A friendly and playful companion.', 'available', '2025-04-24 13:50:37'),
(209, 'ran-ball-python1', 'snake', 'king_snake', 923094, 1, 'male', 14, 'cream', 'large', 'France', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(210, 'ran-milk-snake', 'snake', 'king_snake', 324260, 1, 'male', 8, 'cream', 'large', 'Thailand', 'Well-trained and affectionate pet.', 'available', '2025-04-24 13:50:37'),
(211, 'ran-corn-snake', 'snake', 'night_snake', 501516, 1, 'male', 9, 'gray', 'medium', 'Vietnam', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(212, 'ran-cornsnake', 'snake', 'night_snake', 237139, 1, 'male', 5, 'brown', 'large', 'USA', 'Perfect for apartment living.', 'available', '2025-04-24 13:50:37'),
(213, 'ran-ball-python', 'snake', 'rock_python', 606207, 1, 'female', 4, 'brown', 'small', 'USA', 'Energetic and loves to play outdoors.', 'available', '2025-04-24 13:50:37'),
(214, 'meo ba tu', 'cat', 'snow', 654321, 2, 'male', 2, 'white', 'small', 'ba tu', '1001', 'available', '2025-06-10 20:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `pet_images`
--

CREATE TABLE `pet_images` (
  `id` int(11) NOT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pet_images`
--

INSERT INTO `pet_images` (`id`, `pet_id`, `image_url`, `is_main`) VALUES
(1, 1, 'uploads/pets/bird/goldfinch/chim-canari.jpg', 1),
(2, 2, 'uploads/pets/bird/goldfinch/hoang-yen.jpg', 1),
(3, 3, 'uploads/pets/bird/robin/anhdaidienchim.jpg', 1),
(4, 4, 'uploads/pets/cat/egyptian_cat/abyssinia.jpg', 1),
(5, 5, 'uploads/pets/cat/egyptian_cat/bao-bengal.jpg', 1),
(6, 6, 'uploads/pets/cat/egyptian_cat/coc-duoi-nhat-ban.jpg', 1),
(7, 7, 'uploads/pets/cat/egyptian_cat/korat.jpg', 1),
(8, 8, 'uploads/pets/cat/egyptian_cat/maine-coon.jpg', 1),
(9, 9, 'uploads/pets/cat/egyptian_cat/meoanhlongngan.jpg', 1),
(10, 10, 'uploads/pets/cat/egyptian_cat/mien-dien.jpg', 1),
(11, 11, 'uploads/pets/cat/egyptian_cat/moggie.jpg', 1),
(12, 12, 'uploads/pets/cat/egyptian_cat/nga-xanh.jpg', 1),
(13, 13, 'uploads/pets/cat/egyptian_cat/ocicat.jpg', 1),
(14, 14, 'uploads/pets/cat/egyptian_cat/rex-cornwall.jpg', 1),
(15, 15, 'uploads/pets/cat/egyptian_cat/rex-devon.jpg', 1),
(16, 16, 'uploads/pets/cat/egyptian_cat/somali.jpg', 1),
(17, 17, 'uploads/pets/cat/egyptian_cat/tai-cup-scotland.jpg', 1),
(18, 18, 'uploads/pets/cat/egyptian_cat/tiffanie.jpg', 1),
(19, 19, 'uploads/pets/cat/hog/sphynx-khong-long.jpg', 1),
(20, 20, 'uploads/pets/cat/lynx/anhdaidienmeo.jpg', 1),
(21, 21, 'uploads/pets/cat/lynx/rung-na-uy.jpg', 1),
(22, 22, 'uploads/pets/cat/lynx/siberian.jpg', 1),
(23, 23, 'uploads/pets/cat/persian_cat/anh-long-ngan.jpg', 1),
(24, 24, 'uploads/pets/cat/persian_cat/ba-tu.jpg', 1),
(25, 25, 'uploads/pets/cat/persian_cat/birman.jpg', 1),
(26, 26, 'uploads/pets/cat/persian_cat/chinchilla.jpg', 1),
(27, 27, 'uploads/pets/cat/persian_cat/ragdoll.jpg', 1),
(28, 28, 'uploads/pets/cat/persian_cat/tat-trang.jpg', 1),
(29, 29, 'uploads/pets/cat/persian_cat/tonkin.jpg', 1),
(30, 30, 'uploads/pets/cat/scottish_deerhound/scottish-deerhound.jpg', 1),
(31, 31, 'uploads/pets/cat/siamese_cat/bali.jpg', 1),
(32, 32, 'uploads/pets/cat/siamese_cat/xiem.jpg', 1),
(33, 33, 'uploads/pets/cat/tabby_cat/ba-tu-long-ngan.jpg', 1),
(34, 34, 'uploads/pets/cat/tabby_cat/long-ngan-phuong-dong.jpg', 1),
(35, 35, 'uploads/pets/cat/tabby_cat/manx.jpg', 1),
(36, 36, 'uploads/pets/cow/boxer/bulldog.jpg', 1),
(37, 37, 'uploads/pets/cow/english_foxhound/beagle.jpg', 1),
(38, 38, 'uploads/pets/cow/english_foxhound/english-foxhound.jpg', 1),
(39, 39, 'uploads/pets/cow/english_foxhound/pointer.jpg', 1),
(40, 40, 'uploads/pets/cow/english_foxhound/smooth-fox-terrier.jpg', 1),
(41, 41, 'uploads/pets/cow/rhodesian_ridgeback/boxer.jpg', 1),
(42, 42, 'uploads/pets/dog/alaskan_malamute/anhdaidienalaska.jpg', 1),
(43, 43, 'uploads/pets/dog/alaskan_malamute/siberian-huskys.jpg', 1),
(44, 44, 'uploads/pets/dog/american_staffordshire_terrier/staffordshire-bull-terrier.jpg', 1),
(45, 45, 'uploads/pets/dog/australian_terrier/silky-terrier.jpg', 1),
(46, 46, 'uploads/pets/dog/basset/basset-hound.jpg', 1),
(47, 47, 'uploads/pets/dog/black-and-tan_coonhound/manchester-terrier.jpg', 1),
(48, 48, 'uploads/pets/dog/border_terrier/glen-of-imaal-terrier.jpg', 1),
(49, 49, 'uploads/pets/dog/briard/pyrenean-shepherd.jpg', 1),
(50, 50, 'uploads/pets/dog/briard/skye-terrier.jpg', 1),
(51, 51, 'uploads/pets/dog/brittany_spaniel/nova-scotia-duck-tolling-retriever.jpg', 1),
(52, 52, 'uploads/pets/dog/bull_mastiff/french-bulldog.jpg', 1),
(53, 53, 'uploads/pets/dog/cairn/cairn-terrier.jpg', 1),
(54, 54, 'uploads/pets/dog/chihuahua/chihuahua.jpg', 1),
(55, 55, 'uploads/pets/dog/chihuahua/singapura.jpg', 1),
(56, 56, 'uploads/pets/dog/chow/shiba-inu.jpg', 1),
(57, 57, 'uploads/pets/dog/collie/shetland-sheepdog.jpg', 1),
(58, 58, 'uploads/pets/dog/dalmatian/dalmatian.jpg', 1),
(59, 59, 'uploads/pets/dog/dandie_dinmont/dandie-dinmont-terrier.jpg', 1),
(60, 60, 'uploads/pets/dog/dingo/akita.jpg', 1),
(61, 61, 'uploads/pets/dog/english_setter/australian-shepherd.jpg', 1),
(62, 62, 'uploads/pets/dog/eskimo_dog/burmilla.jpg', 1),
(63, 63, 'uploads/pets/dog/eskimo_dog/siberian-husky.jpg', 1),
(64, 64, 'uploads/pets/dog/flat-coated_retriever/flat-coated-retriever.jpg', 1),
(65, 65, 'uploads/pets/dog/german_shepherd/german-shepherd.jpg', 1),
(66, 66, 'uploads/pets/dog/golden_retriever/golden-retriever.jpg', 1),
(67, 67, 'uploads/pets/dog/kerry_blue_terrier/kerry-blue-terrier.jpg', 1),
(68, 68, 'uploads/pets/dog/labrador_retriever/labrador-retriever.jpg', 1),
(69, 69, 'uploads/pets/dog/lakeland_terrier/lakeland-terrier.jpg', 1),
(70, 70, 'uploads/pets/dog/lakeland_terrier/welsh-terrier.jpg', 1),
(71, 71, 'uploads/pets/dog/maltese_dog/maltese.jpg', 1),
(72, 72, 'uploads/pets/dog/norfolk_terrier/norfolk-terrier.jpg', 1),
(73, 73, 'uploads/pets/dog/norwich_terrier/norwich-terrier.jpg', 1),
(74, 74, 'uploads/pets/dog/old_english_sheepdog/old-english-sheepdog.jpg', 1),
(75, 75, 'uploads/pets/dog/pug/pug.jpg', 1),
(76, 76, 'uploads/pets/dog/sealyham_terrier/sealyham-terrier.jpg', 1),
(77, 77, 'uploads/pets/dog/sealyham_terrier/tho-californian.jpg', 1),
(78, 78, 'uploads/pets/dog/soft-coated_wheaten_terrier/soft-coated-wheaten-terrier.jpg', 1),
(79, 79, 'uploads/pets/dog/standard_poodle/spanish-water-dog.jpg', 1),
(80, 80, 'uploads/pets/dog/tibetan_terrier/lhasa-apso.jpg', 1),
(81, 81, 'uploads/pets/dog/tibetan_terrier/lowchen.jpg', 1),
(82, 82, 'uploads/pets/dog/tibetan_terrier/tibetan-terrier.jpg', 1),
(83, 83, 'uploads/pets/dog/toy_terrier/boston-terrier.jpg', 1),
(84, 84, 'uploads/pets/dog/toy_terrier/miniature-bull-terrier.jpg', 1),
(85, 85, 'uploads/pets/dog/toy_terrier/toy-fox-terrier.jpg', 1),
(86, 86, 'uploads/pets/dog/west_highland_white_terrier/west-highland-white-terrier.jpg', 1),
(87, 87, 'uploads/pets/dog/wire-haired_fox_terrier/wire-fox-terrier.jpg', 1),
(88, 88, 'uploads/pets/dog/yorkshire_terrier/yorkshire-terrier.jpg', 1),
(89, 89, 'uploads/pets/fish/anemone_fish/ca-clown.jpg', 1),
(90, 90, 'uploads/pets/fish/goldfish/ca-canh-ca-voi.jpg', 1),
(91, 91, 'uploads/pets/fish/goldfish/ca-canh-guppy.jpg', 1),
(92, 92, 'uploads/pets/fish/goldfish/ca-canh-guppy1.jpg', 1),
(93, 93, 'uploads/pets/fish/goldfish/ca-canh-malawi.jpg', 1),
(94, 94, 'uploads/pets/fish/goldfish/ca-canh-swordtail.jpg', 1),
(95, 95, 'uploads/pets/fish/goldfish/ca-hoi-nhat-ban.jpg', 1),
(96, 96, 'uploads/pets/fish/goldfish/ca-koi.jpg', 1),
(97, 97, 'uploads/pets/fish/goldfish/ca-surgeon.jpg', 1),
(98, 98, 'uploads/pets/fish/macaw/ca-betta.jpg', 1),
(99, 99, 'uploads/pets/hamster/hamster/tho-nertherland-dwarf.jpg', 1),
(100, 100, 'uploads/pets/lizard/green_lizard/ran-boa-canh.jpg', 1),
(101, 101, 'uploads/pets/other/angora/tho-lionhead.jpg', 1),
(102, 102, 'uploads/pets/other/appenzeller/bernese-mountain.jpg', 1),
(103, 103, 'uploads/pets/other/basenji/finnish-spitz.jpg', 1),
(104, 104, 'uploads/pets/other/blenheim_spaniel/cavalier-king-charles-spaniel.jpg', 1),
(105, 105, 'uploads/pets/other/blenheim_spaniel/king-charles-spaniel.jpg', 1),
(106, 106, 'uploads/pets/other/border_collie/border-collie.jpg', 1),
(107, 107, 'uploads/pets/other/borzoi/borzoi.jpg', 1),
(108, 108, 'uploads/pets/other/brittany_spaniel/english-setter.jpg', 1),
(109, 109, 'uploads/pets/other/bulbul/chim-sao.jpg', 1),
(110, 110, 'uploads/pets/other/bull_mastiff/bullmastiff.jpg', 1),
(111, 111, 'uploads/pets/other/bull_mastiff/mastiff.jpg', 1),
(112, 112, 'uploads/pets/other/bull_mastiff/neapolitan-mastiff.jpg', 1),
(113, 113, 'uploads/pets/other/cardigan/pembroke-welsh-corgi.jpg', 1),
(114, 114, 'uploads/pets/other/chow/chow-chow.jpg', 1),
(115, 115, 'uploads/pets/other/clumber/clumber-spaniel.jpg', 1),
(116, 116, 'uploads/pets/other/doberman/doberman-pinscher.jpg', 1),
(117, 117, 'uploads/pets/other/eel/ca-rong.jpg', 1),
(118, 118, 'uploads/pets/other/flamingo/hong-hac.jpg', 1),
(119, 119, 'uploads/pets/other/gar/ca-bay-mau.jpg', 1),
(120, 120, 'uploads/pets/other/german_short-haired_pointer/small-munsterlander-pointer.jpg', 1),
(121, 121, 'uploads/pets/other/giant_schnauzer/giant-schnauzer.jpg', 1),
(122, 122, 'uploads/pets/other/great_dane/cane-corso.jpg', 1),
(123, 123, 'uploads/pets/other/great_dane/great-dane.jpg', 1),
(124, 124, 'uploads/pets/other/great_dane/plott.jpg', 1),
(125, 125, 'uploads/pets/other/great_grey_owl/cu-meo.jpg', 1),
(126, 126, 'uploads/pets/other/great_grey_owl/cu-ngua.jpg', 1),
(127, 127, 'uploads/pets/other/great_pyrenees/pyrenean-mastiff.jpg', 1),
(128, 128, 'uploads/pets/other/green_mamba/ran-con-canh.jpg', 1),
(129, 129, 'uploads/pets/other/ibizan_hound/italian-greyhound.jpg', 1),
(130, 130, 'uploads/pets/other/ibizan_hound/pharaoh-hound.jpg', 1),
(131, 131, 'uploads/pets/other/irish_setter/irish-setter.jpg', 1),
(132, 132, 'uploads/pets/other/irish_wolfhound/lrish-wolfhound.jpg', 1),
(133, 133, 'uploads/pets/other/italian_greyhound/greyhound.jpg', 1),
(134, 134, 'uploads/pets/other/jacamar/chich-choe-lua.jpg', 1),
(135, 135, 'uploads/pets/other/japanese_spaniel/japanese-chin.jpg', 1),
(136, 136, 'uploads/pets/other/japanese_spaniel/shih-tzu.jpg', 1),
(137, 137, 'uploads/pets/other/keeshond/keeshond.jpg', 1),
(138, 138, 'uploads/pets/other/king_penguin/chim-canh-cut-hoang-gia.jpg', 1),
(139, 139, 'uploads/pets/other/komondor/komondor.jpg', 1),
(140, 140, 'uploads/pets/other/kuvasz/kuvasz.jpg', 1),
(141, 141, 'uploads/pets/other/lorikeet/ca-cang-co.jpg', 1),
(142, 142, 'uploads/pets/other/lorikeet/vet-noi.jpg', 1),
(143, 143, 'uploads/pets/other/macaw/phuong-hoang.jpg', 1),
(144, 144, 'uploads/pets/other/magpie/chim-dau.jpg', 1),
(145, 145, 'uploads/pets/other/mexican_hairless/chinese-crested.jpg', 1),
(146, 146, 'uploads/pets/other/mexican_hairless/dachshund.jpg', 1),
(147, 147, 'uploads/pets/other/miniature_pinscher/miniature-pinscher.jpg', 1),
(148, 148, 'uploads/pets/other/miniature_poodle/poodle.jpg', 1),
(149, 149, 'uploads/pets/other/norwegian_elkhound/norwegian-buhund.jpg', 1),
(150, 150, 'uploads/pets/other/norwegian_elkhound/norwegian-elkhound.jpg', 1),
(151, 151, 'uploads/pets/other/norwegian_elkhound/swedish-vallhund.jpg', 1),
(152, 152, 'uploads/pets/other/ostrich/đa-đieu.jpg', 1),
(153, 153, 'uploads/pets/other/other/favicon.png', 1),
(154, 154, 'uploads/pets/other/other/logo.png', 1),
(155, 155, 'uploads/pets/other/other/logo2.png', 1),
(156, 156, 'uploads/pets/other/other/logopetshop.jpg', 1),
(157, 157, 'uploads/pets/other/other/map-marker.png', 1),
(158, 158, 'uploads/pets/other/other/payment-method.png', 1),
(159, 159, 'uploads/pets/other/other/payments.png', 1),
(160, 160, 'uploads/pets/other/other/qrcode.jpg', 1),
(161, 161, 'uploads/pets/other/other/search-icon.png', 1),
(162, 162, 'uploads/pets/other/other/Unknown_person.jpg', 1),
(163, 163, 'uploads/pets/other/otterhound/otterhound.jpg', 1),
(164, 164, 'uploads/pets/other/otterhound/spinone-italiano.jpg', 1),
(165, 165, 'uploads/pets/other/papillon/papillon.jpg', 1),
(166, 166, 'uploads/pets/other/peacock/chim-cong.jpg', 1),
(167, 167, 'uploads/pets/other/pekinese/pekingese.jpg', 1),
(168, 168, 'uploads/pets/other/pekinese/tibetan-spaniel.jpg', 1),
(169, 169, 'uploads/pets/other/pembroke/corgi.jpg', 1),
(170, 170, 'uploads/pets/other/pomeranian/pomeranian.jpg', 1),
(171, 171, 'uploads/pets/other/pomeranian/van-tho-nhi-ky.jpg', 1),
(172, 172, 'uploads/pets/other/redbone/redbone-coonhound.jpg', 1),
(173, 173, 'uploads/pets/other/rhodesian_ridgeback/rhodesian-ridgeback.jpg', 1),
(174, 174, 'uploads/pets/other/rhodesian_ridgeback/vizsla.jpg', 1),
(175, 175, 'uploads/pets/other/rottweiler/rottweiler.jpg', 1),
(176, 176, 'uploads/pets/other/saint_bernard/saint-bernard.jpg', 1),
(177, 177, 'uploads/pets/other/saluki/saluki.jpg', 1),
(178, 178, 'uploads/pets/other/saluki/whippet.jpg', 1),
(179, 179, 'uploads/pets/other/samoyed/Jjapanese-spitz.jpg', 1),
(180, 180, 'uploads/pets/other/samoyed/samoyed.jpg', 1),
(181, 181, 'uploads/pets/other/schipperke/schipperke.jpg', 1),
(182, 182, 'uploads/pets/other/standard_schnauzer/miniature-schnauzer.jpg', 1),
(183, 183, 'uploads/pets/other/standard_schnauzer/standard-schnauzer.jpg', 1),
(184, 184, 'uploads/pets/other/standard_schnauzer/wirehaired-pointing-griffon.jpg', 1),
(185, 185, 'uploads/pets/other/sussex_spaniel/cocker-spaniel.jpg', 1),
(186, 186, 'uploads/pets/other/sussex_spaniel/field-spaniel.jpg', 1),
(187, 187, 'uploads/pets/other/sussex_spaniel/sussex-spaniel.jpg', 1),
(188, 188, 'uploads/pets/other/tibetan_mastiff/newfoundland.jpg', 1),
(189, 189, 'uploads/pets/other/tibetan_mastiff/tibetan-mastiff.jpg', 1),
(190, 190, 'uploads/pets/other/vulture/đai-bang-harpy.jpg', 1),
(191, 191, 'uploads/pets/other/walker_hound/treeing-walker-coonhound.jpg', 1),
(192, 192, 'uploads/pets/other/weimaraner/weimaraner.jpg', 1),
(193, 193, 'uploads/pets/other/welsh_springer_spaniel/english-springer-spaniel.jpg', 1),
(194, 194, 'uploads/pets/other/welsh_springer_spaniel/welsh-springer-spaniel.jpg', 1),
(195, 195, 'uploads/pets/other/whippet/sloughi.jpg', 1),
(196, 196, 'uploads/pets/rabbit/hare/tho-dutch.jpg', 1),
(197, 197, 'uploads/pets/rabbit/hare/tho-flemish-giant.jpg', 1),
(198, 198, 'uploads/pets/rabbit/hare/tho-himalayan.jpg', 1),
(199, 199, 'uploads/pets/rabbit/hare/tho-holland-op.jpg', 1),
(200, 200, 'uploads/pets/rabbit/hare/tho-mini-rex..jpg', 1),
(201, 201, 'uploads/pets/rabbit/wood_rabbit/tho-angora.jpg', 1),
(202, 202, 'uploads/pets/rabbit/wood_rabbit/tho-chinchilla.jpg', 1),
(203, 203, 'uploads/pets/rabbit/wood_rabbit/tho-jersey-wooly.jpg', 1),
(204, 204, 'uploads/pets/snake/garter_snake/ran-garter-snake.jpg', 1),
(205, 205, 'uploads/pets/snake/green_snake/ran-green-tree-python.jpg', 1),
(206, 206, 'uploads/pets/snake/green_snake/ran-king-snake.jpg', 1),
(207, 207, 'uploads/pets/snake/hognose_snake/ran-hognose.jpg', 1),
(208, 208, 'uploads/pets/snake/indian_cobra/ran-trai-dau-đo.jpg', 1),
(209, 209, 'uploads/pets/snake/king_snake/ran-ball-python1.jpg', 1),
(210, 210, 'uploads/pets/snake/king_snake/ran-milk-snake.jpg', 1),
(211, 211, 'uploads/pets/snake/night_snake/ran-corn-snake.jpg', 1),
(212, 212, 'uploads/pets/snake/night_snake/ran-cornsnake.jpg', 1),
(213, 213, 'uploads/pets/snake/rock_python/ran-ball-python.jpg', 1),
(215, 1, 'uploads/pets/bird/513c9e24-b357-4994-9a81-12efa3a816fb_screenshot_4.png', 0),
(217, 214, 'uploads/pets/cat/c341cf46-2c77-4307-8b82-981787e6a90e_anhmeobatu.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recommended_product_ids` text DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_token`
--

CREATE TABLE `refresh_token` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `expiry_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_token`
--

INSERT INTO `refresh_token` (`id`, `user_id`, `token`, `expiry_date`) VALUES
(8, 3, 'a606272a-6051-466b-9c01-25ac50db002f', '2025-04-27 19:16:09'),
(9, 3, '4fba8e96-7590-447f-83d0-cc146bf84ef9', '2025-04-27 19:28:55'),
(10, 3, 'b6d8f6e9-a46b-44ca-90e2-9dd2e3ae7834', '2025-04-27 19:32:42'),
(11, 3, 'fc0ed9b9-d25d-4daa-8f9a-7a51eed4fde8', '2025-04-27 19:51:05'),
(12, 3, '9256ca5a-d4a2-4619-88fb-e680469e566d', '2025-04-30 10:06:23'),
(13, 3, '54175e50-d97f-4ffd-91e6-f9773e605330', '2025-04-30 10:41:36'),
(14, 3, '36496173-5ed9-431c-b231-0d0f56ba615b', '2025-05-01 05:48:07'),
(15, 3, '2dbcfbeb-2975-4158-a67a-ad903416394a', '2025-05-01 10:44:07'),
(16, 3, '63a07d8b-b109-4570-b30c-f29c5f6d66d0', '2025-05-01 20:03:40'),
(17, 3, '936ecaf9-7b6f-4a2d-81bf-4e7bd86be704', '2025-05-01 20:36:03'),
(18, 3, '6824b2f6-b01f-4a6e-a967-19a79670d52c', '2025-05-01 21:38:13'),
(19, 3, '46315faf-4f5a-4526-a868-5d8507b6c591', '2025-05-01 21:51:32'),
(20, 3, 'c67c46eb-0666-472e-a841-71bc750897bb', '2025-05-01 23:35:51'),
(21, 3, '19063b4c-5003-4e00-ab71-5a716ddb3a65', '2025-05-01 23:58:24'),
(22, 3, 'ba79f789-7e56-4b40-8f96-1f552e1c86dc', '2025-05-02 00:17:51'),
(23, 3, '630e206b-159d-4c97-83f9-4f574bed8c35', '2025-05-02 00:20:26'),
(24, 3, '4a54ed7e-6b93-4126-bdd0-ffc32083d96c', '2025-05-17 06:38:29'),
(25, 3, '1037a368-3e1f-4a90-b197-b663ed3bd5e0', '2025-05-17 06:49:32'),
(26, 3, '75b2ce7d-772a-41c4-be8d-30a6a328e10a', '2025-05-17 11:51:45'),
(27, 3, '14b71403-27cc-48a9-b32d-4789e5c83538', '2025-05-17 12:35:02'),
(28, 3, '99de32f5-0e27-486c-b916-80291521925a', '2025-05-20 05:26:39'),
(29, 3, 'd75906b1-9603-406b-8785-bcd96c425bcc', '2025-05-20 06:47:26'),
(30, 3, 'd6646dc8-feb6-4fec-8cd9-362bcc1cc7ac', '2025-05-21 10:51:56'),
(31, 4, '28228077-436a-4538-aef6-0ea37745b961', '2025-06-02 04:52:26'),
(32, 4, '88ec5fcb-e2ec-4272-9209-3e2502a048b7', '2025-06-02 04:59:19'),
(33, 4, '98a53ba1-0504-4cb2-a397-fa1c56f35621', '2025-06-02 05:36:13'),
(34, 4, 'cf77f1ae-f744-44d6-a9ee-eb5b67bcfce9', '2025-06-02 06:50:11'),
(35, 4, '35b1573d-7b61-4527-bc48-37f54a117a46', '2025-06-02 09:42:01'),
(36, 4, '4600b803-0494-4ac2-8daa-fa40a2e1d2c1', '2025-06-02 10:19:48'),
(37, 4, '61a6d836-49d8-4449-82b0-c853ad8702bb', '2025-06-02 21:21:21'),
(38, 4, '17990f01-982a-4708-96eb-cd2209121c11', '2025-06-02 21:43:08'),
(39, 4, '9a0e29b0-21e0-4466-8261-b34c75565ea7', '2025-06-02 21:45:28'),
(40, 5, 'c68f6145-8544-44e1-9ec6-3d7543afe5e3', '2025-06-02 22:02:22'),
(41, 4, '4199ad8d-ac55-403a-b9ee-a47e9e5ce9c5', '2025-06-02 22:15:53'),
(42, 4, 'd85eca23-9ea3-415b-a9a0-deee6083b248', '2025-06-02 22:17:13'),
(43, 4, '08bbab40-9342-4c6d-9633-d3843daa913f', '2025-06-02 22:18:48'),
(44, 4, 'cfa87326-6d11-4b3e-b9a6-0bb71683aa97', '2025-06-02 22:20:39'),
(45, 4, '77840a54-7a9e-4e89-936f-0deb91a40b1e', '2025-06-02 22:23:17'),
(46, 4, '52a5fa49-9c68-40aa-bcee-1482ba46cf18', '2025-06-03 04:32:16'),
(47, 4, '26ba2b7e-5c94-4f85-b88c-27e8d751baa5', '2025-06-03 08:39:40'),
(48, 4, '085bf944-fc91-46a5-9426-cd7cba5364bb', '2025-06-03 08:55:58'),
(49, 5, '2d009209-465b-4170-b6b2-30ccd4e4d723', '2025-06-05 08:12:16'),
(50, 5, 'b3d96125-b61d-477e-9a31-51e1d27af651', '2025-06-05 23:01:07'),
(51, 5, 'f59fd09c-af8f-4aa6-80a4-1855a12488d2', '2025-06-05 23:32:51'),
(52, 4, 'cb18d510-71ad-4852-815f-3b250217c47b', '2025-06-05 23:32:59'),
(53, 4, '7216e397-8d20-4bd8-8758-9b2cc872771b', '2025-06-06 05:56:55'),
(54, 5, 'a5ccc433-5059-428d-8246-e19a20faff7c', '2025-06-06 05:57:10'),
(55, 5, 'df439c1e-69e6-41d8-929f-7ff744807b64', '2025-06-06 05:59:18'),
(56, 5, 'd63aabc3-249c-4948-a02b-5ae61219cf08', '2025-06-06 06:01:14'),
(57, 5, '467b9cd1-a25c-4308-b88d-ef5d82972abf', '2025-06-06 06:04:28'),
(58, 4, '60b291ea-702d-4bc6-8ae4-6cdc824a270e', '2025-06-06 06:07:56'),
(59, 4, '8ace0a3a-a6f0-48b3-928f-46df41d19d61', '2025-06-06 06:10:37'),
(60, 5, '6371e20a-a60e-49b2-819a-5df6682d2aba', '2025-06-06 06:11:38'),
(61, 4, '557994fa-690c-4eea-9343-cc6ca6b1ead9', '2025-06-06 06:14:48'),
(62, 5, '6acc9916-8434-4d24-ad1d-c4bf1337d875', '2025-06-06 06:19:21'),
(63, 5, '3720717b-de45-46de-86c6-aa0c65c07f2c', '2025-06-06 06:24:18'),
(64, 5, 'ee4b5990-3898-4480-aff1-85a917be848a', '2025-06-06 06:28:09'),
(65, 4, '5b79069d-05ab-4c27-a7e9-aeaf12448ac1', '2025-06-06 06:28:15'),
(66, 5, '265ee035-fb0b-4492-9e2a-a141d78ee129', '2025-06-06 06:32:57'),
(67, 4, '8a410ea8-4623-496a-a708-43f08117b904', '2025-06-06 06:36:32'),
(68, 5, '833fb8d8-5292-4b82-977d-69b29294ee2a', '2025-06-06 06:42:28'),
(69, 4, 'd34d7023-2a3e-4d32-b876-edd795c9c490', '2025-06-06 06:46:00'),
(70, 4, '7d75c419-6662-4403-a000-8a66771a51a6', '2025-06-06 08:45:20'),
(71, 5, '475c6f21-aa82-48db-be39-d3f5271f9525', '2025-06-06 08:45:27'),
(72, 4, '29774fa5-af48-4e0e-84fe-db8b69e7c400', '2025-06-12 22:55:52'),
(73, 4, '6df3d28a-3e77-4623-b9b5-f5cc7672213b', '2025-06-16 08:59:23'),
(74, 4, '99f9ccca-8daf-4a80-95d2-da1bd1582746', '2025-06-16 10:33:27'),
(75, 4, '3c4327a6-3409-4bc9-a0c7-93b265d5a61f', '2025-06-16 22:39:59'),
(76, 4, '2aeea92e-d742-4fe8-961f-0354519fdf17', '2025-06-16 23:43:44'),
(77, 4, '657a6824-cdd2-4211-969e-c3d5f6970327', '2025-06-17 03:53:05'),
(78, 4, 'cda7984e-29b7-4148-9f7f-1fec1bc751e9', '2025-06-17 04:33:45'),
(79, 4, 'b132f61a-e0f9-4dbf-8524-2c88fd2bd703', '2025-06-17 04:41:52'),
(80, 4, '40ed3fe8-7930-4f52-94ad-1a34bf2d9fa1', '2025-06-17 05:41:13'),
(81, 4, '684b4a5d-9d70-41d2-999b-5e1a058e2680', '2025-06-17 20:30:01'),
(82, 4, '71cd9f81-9792-44c1-ab6f-8d839d28afb6', '2025-06-20 07:15:57'),
(83, 4, 'd833a785-2934-4d93-acf5-09c935e2face', '2025-06-20 20:14:33'),
(84, 5, '14d74f47-1209-4850-874a-bf7033babb99', '2025-06-20 20:14:50'),
(85, 4, '960df551-2f73-493f-80c2-37c2aa462425', '2025-06-20 21:12:25'),
(86, 4, '787f5606-f608-48dd-8511-33cbdd6122ba', '2025-06-20 22:40:55'),
(87, 4, 'f3173fbf-2e70-4608-8a39-02d923e14c60', '2025-06-20 22:44:05'),
(88, 4, 'ca7eb97f-9bb2-4d40-901c-25fde976d917', '2025-06-20 22:56:29'),
(89, 4, 'b0f27b6e-8120-40f6-bab4-3229946b471c', '2025-06-20 22:59:03'),
(90, 4, 'b53737a6-b38e-459f-9fd7-fe9855bba3e4', '2025-06-21 01:33:18'),
(91, 4, 'b887446b-adbe-4b23-862d-7e843fdd0034', '2025-06-21 02:40:22'),
(92, 4, '3a4ef060-ec91-412e-88c8-234183c3d0ed', '2025-06-21 02:40:33'),
(93, 4, 'f72352f3-0a83-4dd1-b011-0ab8810eccc4', '2025-06-21 05:45:24'),
(94, 4, 'bce6bfff-54f8-413c-bbcf-ae42a372726a', '2025-06-21 10:10:52'),
(95, 4, '49086153-0929-4f95-8b4b-27d520b128b4', '2025-06-21 10:59:08'),
(96, 5, 'a7e3ad13-9174-4a1e-ad16-ae79346b1e62', '2025-06-21 10:59:32'),
(97, 4, 'a338543c-9bd5-4948-af9d-be5d61a9bc32', '2025-06-21 20:37:18'),
(98, 5, 'b139516f-4c0b-4770-8a74-1f9320bb663e', '2025-06-21 20:37:26'),
(99, 5, '89a1e055-cad5-4003-812c-5c3d9680fcf9', '2025-06-21 20:38:49'),
(100, 5, '93c9cae2-3ab0-4656-b6cf-c854fabef02c', '2025-06-21 20:39:28'),
(101, 4, '1fc9e46e-1d4f-47ed-8105-4e0b15dcd4b6', '2025-06-21 20:41:08'),
(102, 5, '13fa3f3f-8a25-405b-bf5c-3aed1155a690', '2025-06-21 20:45:24'),
(103, 4, '8e6eb74e-1efd-42b2-92e6-35bb1048a62a', '2025-06-21 21:18:30'),
(104, 5, '25d24480-013c-46fa-994a-bd5ca10e258d', '2025-06-21 22:37:12'),
(105, 4, '26f27e12-1b2f-4bb8-91bd-a6eae6306e68', '2025-06-22 09:00:16');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `pet_id`, `order_id`, `rating`, `created_at`) VALUES
(3, 5, 163, 4, 4, '2025-06-14 22:34:57'),
(4, 5, 42, 4, 4, '2025-06-14 22:35:00'),
(5, 5, 20, 4, 5, '2025-06-14 22:35:01'),
(6, 5, 3, 7, 5, '2025-06-14 23:14:59'),
(7, 5, 90, 1, 5, '2025-06-15 09:46:56');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `estimated_time` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `description`, `price`, `estimated_time`) VALUES
(1, 'Giao hàng tiêu chuẩn', 'Giao hàng trong 3-5 ngày làm việc', 30000.00, '3-5 ngày'),
(2, 'Giao hàng nhanh', 'Giao trong 1-2 ngày làm việc', 50000.00, '1-2 ngày'),
(3, 'Giao hàng hỏa tốc', 'Giao trong ngày cho đơn trước 10h sáng', 100000.00, 'Trong ngày'),
(4, 'Hỏa tốc Grab', 'Grab giao hỏa tốc', 200000.00, '2 - 12giờ');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `role` enum('user','admin','staff','vet') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(11) NOT NULL,
  `security_code` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `gender`, `birthday`, `phone`, `address`, `avatar`, `role`, `created_at`, `updated_at`, `status`, `security_code`) VALUES
(3, 'binhandsome', '21130591@st.hcmuaf.edu.vn', '$2a$10$z.iss2P5yUyOc9oui3meo.vl.pK5vxfnhN134dPO4N6KUMZbIRXg.', 'Lê Chí Trường', 'Nam', '2025-04-02', '0123445676', 'So 1, Xã Ngũ Kiên, Huyện Vĩnh Tường, Tỉnh Vĩnh Phúc', '9035bb06-c9b7-4495-9017-769c226d37c7_Screenshot 2025-03-30 223039.png', 'user', '2025-04-20 19:15:50', '2025-04-24 05:49:31', 1, NULL),
(4, 'vuvuvu', 'vutran08012k3@gmail.com', '$2a$10$iR1NpJA.0BMP4Hkx1E/VeO6sNjupFbk0ClDCmknW2dHAnLVCWDXsO', NULL, NULL, NULL, NULL, NULL, 'Unknown_person.jpg', 'admin', '2025-05-26 04:51:39', '2025-05-26 04:52:19', 1, NULL),
(5, 'vuvuvu2', '21130615@st.hcmuaf.edu.vn', '$2a$10$lsRs/85k4VtU4gbnidFHfua1z2OClQvJlrIQ0a2QCicOaoR2CBZWa', 'Lê Chí ', 'Nam', '2025-04-02', '0123445679', 'So 1 Nguyen Nghiem, Xã Đào Mỹ, Huyện Lạng Giang, Tỉnh Bắc Giang', '3058f301-223f-4a07-b021-beef1c787d19_screenshot_4.png', 'user', '2025-05-26 22:01:18', '2025-05-30 06:43:07', 1, NULL),
(6, '21130615', '211306015@st.hcmuaf.edu.vn', '$2a$10$CuyYEottkztkY9bbeG8kGunemEooc42jGkVwclzi3JlJuoVrYdLSa', NULL, NULL, NULL, NULL, NULL, 'Unknown_person.jpg', 'user', '2025-05-27 03:31:57', '2025-05-27 03:31:57', 0, '500347'),
(7, 'sdsadsd', '2113061xzx5@st.hcmuaf.edu.vn', '$2a$10$1wdiLPfqSK/UGIQsQgPlD.gU4MqPvuLGbcFmSvqdpDfASxyXbi3Jm', NULL, NULL, NULL, NULL, NULL, 'Unknown_person.jpg', 'user', '2025-05-27 03:47:57', '2025-05-27 03:47:57', 0, '953056');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `max_uses` int(11) DEFAULT NULL,
  `used` int(11) DEFAULT 0,
  `expiry_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `pet_id`, `product_id`, `created_at`) VALUES
(9, 3, 3, NULL, '2025-05-14 00:23:53'),
(10, 3, 4, NULL, '2025-05-14 00:34:03'),
(11, 5, 3, NULL, '2025-06-14 22:53:00');

--
-- Triggers `wishlist`
--
DELIMITER $$
CREATE TRIGGER `wishlist_check_insert` BEFORE INSERT ON `wishlist` FOR EACH ROW BEGIN
  IF (NEW.pet_id IS NOT NULL AND NEW.product_id IS NOT NULL)
     OR (NEW.pet_id IS NULL AND NEW.product_id IS NULL) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Chỉ được có pet_id hoặc product_id, không được cả hai hoặc cả hai NULL';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `wishlist_check_update` BEFORE UPDATE ON `wishlist` FOR EACH ROW BEGIN
  IF (NEW.pet_id IS NOT NULL AND NEW.product_id IS NOT NULL)
     OR (NEW.pet_id IS NULL AND NEW.product_id IS NULL) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Chỉ được có pet_id hoặc product_id, không được cả hai hoặc cả hai NULL';
  END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `browsing_history`
--
ALTER TABLE `browsing_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `shipping_method_id` (`shipping_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pet_images`
--
ALTER TABLE `pet_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_refresh` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `browsing_history`
--
ALTER TABLE `browsing_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- AUTO_INCREMENT for table `pet_images`
--
ALTER TABLE `pet_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_token`
--
ALTER TABLE `refresh_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `browsing_history`
--
ALTER TABLE `browsing_history`
  ADD CONSTRAINT `browsing_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `browsing_history_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `browsing_history_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `pet_images`
--
ALTER TABLE `pet_images`
  ADD CONSTRAINT `pet_images_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD CONSTRAINT `fk_user_refresh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `wishlist_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
