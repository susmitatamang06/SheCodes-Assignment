-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: quick_bites
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_line` text NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'Nayabasti, Boudha','Kathmandu','97XXXXXXXX'),(2,5,'Boudha','Kathmandu','9800000000'),(3,3,'Not provided','','9800000003'),(4,11,'Baneshwor','Kathmandu','9812345678'),(5,10,'Not provided','','97XXXXXXXX');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `food_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `cart_id` (`cart_id`,`food_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cart_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (2,1),(1,5),(3,11);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Burgers'),(3,'Chicken'),(7,'Desserts'),(5,'Pasta'),(2,'Pizza');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `delivery_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `rider_id` int NOT NULL,
  `delivery_status` enum('ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED') DEFAULT 'ASSIGNED',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivered_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `rider_id` (`rider_id`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`rider_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (1,2,3,'DELIVERED',NULL,'2026-09-30 05:28:39'),(2,1,4,'DELIVERED','2026-09-30 22:26:20','2026-09-30 17:25:54'),(3,4,3,'DELIVERED','2026-09-30 23:18:44','2026-10-03 19:47:17'),(9,5,3,'DELIVERED','2026-10-03 02:23:42','2026-10-03 19:50:49'),(10,7,10,'DELIVERED','2026-10-05 12:09:01','2026-10-05 06:24:58'),(11,8,10,'DELIVERED','2026-10-07 07:47:20','2026-10-07 02:04:36');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_items` (
  `food_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `food_name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `is_popular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`food_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `food_items_chk_1` CHECK ((`price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_items`
--

LOCK TABLES `food_items` WRITE;
/*!40000 ALTER TABLE `food_items` DISABLE KEYS */;
INSERT INTO `food_items` VALUES (2,2,'Chicken Cheese Pizza','',550.00,'images/pizza.png',1,0),(3,1,'Double Beef Burger','',300.00,'images/burger.png',1,0),(4,3,'Fried Chicken','',150.00,'images/fried-chicken.png',1,0),(5,7,'Spring Roll','',190.00,'images/spring-roll.png',1,0),(7,3,'Chicken Sandwich','',250.00,'images/sandwich.png',1,1),(8,7,'Lasagna','',400.00,'images/lasagna.png',1,1),(9,5,'Spaghetti','',450.00,'images/spaghetti.png',1,0),(10,5,'Spaghetti','',450.00,'images/spaghetti.png',1,0),(11,3,'Chicken Sandwich','',300.00,'images/chicken-sandwich.png',1,1);
/*!40000 ALTER TABLE `food_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `food_id` int NOT NULL,
  `food_name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_items_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_items_chk_2` CHECK ((`price` >= 0)),
  CONSTRAINT `order_items_chk_3` CHECK ((`subtotal` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,2,2,'Chicken Cheese Pizza',550.00,1,550.00),(4,4,4,'Fried Chicken',150.00,3,450.00),(5,5,5,'Spring Roll',190.00,1,190.00),(6,5,7,'Chicken Sandwich',250.00,1,250.00),(10,7,3,'Double Beef Burger',300.00,2,600.00),(11,7,9,'Spaghetti',450.00,1,450.00),(12,8,3,'Double Beef Burger',300.00,1,300.00),(13,8,4,'Fried Chicken',150.00,2,300.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `order_status` enum('PLACED','CONFIRMED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') DEFAULT 'PLACED',
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_chk_1` CHECK ((`subtotal` >= 0)),
  CONSTRAINT `orders_chk_2` CHECK ((`delivery_fee` >= 0)),
  CONSTRAINT `orders_chk_3` CHECK ((`total_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,'PREPARING',300.00,50.00,350.00,'2026-09-30 04:34:53'),(2,5,2,'OUT_FOR_DELIVERY',550.00,50.00,600.00,'2026-09-30 04:34:53'),(4,5,2,'DELIVERED',450.00,50.00,500.00,'2026-09-30 17:35:45'),(5,1,1,'DELIVERED',440.00,50.00,490.00,'2026-09-30 23:12:05'),(7,11,4,'DELIVERED',1050.00,50.00,1100.00,'2026-10-05 11:56:47'),(8,5,2,'DELIVERED',600.00,50.00,650.00,'2026-10-07 07:43:23');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` enum('CASH','ONLINE') NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED') DEFAULT 'PENDING',
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payments_chk_1` CHECK ((`amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,4,'CASH','PENDING',500.00,'2026-09-30 17:35:45'),(2,5,'ONLINE','PENDING',490.00,'2026-09-30 23:12:05'),(4,7,'CASH','PENDING',1100.00,'2026-10-05 11:56:47'),(5,8,'CASH','PENDING',650.00,'2026-10-07 07:43:24');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','RIDER','ADMIN') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hello','hello@gmail.com','$2a$10$fwmerpc6t9ToKAfhw4/DKuPiBQ0u0z3XB/Ll9FX3dcC/UFsPhjQn2','CUSTOMER'),(3,'Sita Magar','sitaa@gmail.com','$2a$10$mwgs8EN2FGMcApdEQH/XeupGkhNKoXiA4Xkv7kWyKokeswtvHtF4.','RIDER'),(4,'Rita Magar','rita@gmail.com','$2a$10$7nB2GIZ5FTVdcqIe8F3XPeUdtd9Sfxwpp95P0FKG5Tj5ZGRgO/Mi6','RIDER'),(5,'Susmita Tamang','susmitaa@gmail.com','$2a$10$lqVPrTVAKmzG9T/XjYKmzeB0IfLEacs4ao3yH.OFjAff.ghgSUQ4m','CUSTOMER'),(9,'Admin User','admin@gmail.com','$2a$12$mtTAuVFxTYrBn9HmHz7lO.8c75DRa.05jHPMe2ocsB70zrKbTcCZy','ADMIN'),(10,'Rider Name','rider@gmail.com','$2a$10$7tTvsrQlggiGr43p78.JPug3pwTVi4Lu0v5NsdchcEnTrhnjxsqVK','RIDER'),(11,'Customer1','customer@gmail.com','$2a$10$IUwMG4kdJ5nTwa7e5lltieQS3DJLPUJhadrfofp9rpCG3jcVAkfBS','CUSTOMER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 14:58:29
