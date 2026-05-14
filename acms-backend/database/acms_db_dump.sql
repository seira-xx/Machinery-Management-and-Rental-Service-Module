-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: acms_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `machine_rates`
--

DROP TABLE IF EXISTS `machine_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machine_rates` (
  `rate_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int DEFAULT NULL,
  `rate_amount` decimal(10,2) DEFAULT NULL,
  `rate_type` enum('hour','bag') NOT NULL,
  PRIMARY KEY (`rate_id`),
  KEY `fk_rate_machine` (`machine_id`),
  CONSTRAINT `fk_rate_machine` FOREIGN KEY (`machine_id`) REFERENCES `machine_registry` (`machine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine_rates`
--

LOCK TABLES `machine_rates` WRITE;
/*!40000 ALTER TABLE `machine_rates` DISABLE KEYS */;
INSERT INTO `machine_rates` VALUES (1,1,12.00,'hour'),(2,1,12.00,'bag');
/*!40000 ALTER TABLE `machine_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machine_registry`
--

DROP TABLE IF EXISTS `machine_registry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machine_registry` (
  `machine_id` int NOT NULL AUTO_INCREMENT,
  `machine_type_id` int DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `machine_condition` enum('Good','Bad') NOT NULL,
  `machine_status` enum('Available','Under Maintenance','In Use','Decommissioned') DEFAULT 'Available',
  PRIMARY KEY (`machine_id`),
  KEY `fk_machine_type` (`machine_type_id`),
  CONSTRAINT `fk_machine_type` FOREIGN KEY (`machine_type_id`) REFERENCES `machine_types` (`machine_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine_registry`
--

LOCK TABLES `machine_registry` WRITE;
/*!40000 ALTER TABLE `machine_registry` DISABLE KEYS */;
INSERT INTO `machine_registry` VALUES (1,1,'2024-05-11','Good','Available'),(3,2,'2026-05-07','Bad','In Use');
/*!40000 ALTER TABLE `machine_registry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machine_types`
--

DROP TABLE IF EXISTS `machine_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machine_types` (
  `machine_type_id` int NOT NULL AUTO_INCREMENT,
  `machine_type_name` varchar(100) DEFAULT NULL,
  `machine_brand` varchar(100) DEFAULT NULL,
  `fuel_type` enum('Gasoline','Diesel') NOT NULL,
  PRIMARY KEY (`machine_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine_types`
--

LOCK TABLES `machine_types` WRITE;
/*!40000 ALTER TABLE `machine_types` DISABLE KEYS */;
INSERT INTO `machine_types` VALUES (1,'4-Wheel Tractor','Kubota','Diesel'),(2,'Wheel Barrow','Mitsubishi','Gasoline');
/*!40000 ALTER TABLE `machine_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_records`
--

DROP TABLE IF EXISTS `maintenance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_records` (
  `maintenance_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int DEFAULT NULL,
  `maintenance_type_id` int DEFAULT NULL,
  `part_replaced` varchar(255) DEFAULT NULL,
  `maintenance_cost` decimal(10,2) DEFAULT NULL,
  `maintenance_date` date DEFAULT NULL,
  `maintenance_status` enum('Scheduled','Pending','In Progress','Completed','Cancelled') DEFAULT 'Scheduled',
  PRIMARY KEY (`maintenance_id`),
  KEY `fk_maint_machine` (`machine_id`),
  KEY `fk_maint_type` (`maintenance_type_id`),
  CONSTRAINT `fk_maint_machine` FOREIGN KEY (`machine_id`) REFERENCES `machine_registry` (`machine_id`),
  CONSTRAINT `fk_maint_type` FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_types` (`maintenance_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_records`
--

LOCK TABLES `maintenance_records` WRITE;
/*!40000 ALTER TABLE `maintenance_records` DISABLE KEYS */;
INSERT INTO `maintenance_records` VALUES (1,3,1,'n/a',12.00,'2026-05-04','Scheduled');
/*!40000 ALTER TABLE `maintenance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_types`
--

DROP TABLE IF EXISTS `maintenance_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_types` (
  `maintenance_type_id` int NOT NULL AUTO_INCREMENT,
  `maintenance_type` varchar(50) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT NULL,
  PRIMARY KEY (`maintenance_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_types`
--

LOCK TABLES `maintenance_types` WRITE;
/*!40000 ALTER TABLE `maintenance_types` DISABLE KEYS */;
INSERT INTO `maintenance_types` VALUES (1,'Inspection','Active');
/*!40000 ALTER TABLE `maintenance_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `member_id` varchar(50) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `member_fname` varchar(100) DEFAULT NULL,
  `member_mname` varchar(100) DEFAULT NULL,
  `member_lname` varchar(100) DEFAULT NULL,
  `member_birthdate` date DEFAULT NULL,
  `member_civil_status` enum('single','married','widowed') DEFAULT NULL,
  `member_contact` varchar(20) DEFAULT NULL,
  `member_address` text,
  `member_status` enum('active','inactive','probation') DEFAULT 'active',
  `join_date` date DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  KEY `fk_member_user` (`user_id`),
  CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES ('MEM-002','U-002','Juan','Dela','Cruz','1990-05-15','married','09123456789','123 Farm Street, Laguna','active','2024-01-01'),('MEM-003','U-003','Joselito','Montoya','Sabella','1989-03-01','married','09123456321','123 Farm Street, Laguna','active','2026-01-01');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_payments`
--

DROP TABLE IF EXISTS `rental_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_payments` (
  `rental_payment_id` int NOT NULL AUTO_INCREMENT,
  `rental_id` int DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `rental_usage` decimal(8,2) DEFAULT NULL,
  `payment_status` enum('Pending','Paid') DEFAULT 'Pending',
  PRIMARY KEY (`rental_payment_id`),
  KEY `fk_payment_rental` (`rental_id`),
  CONSTRAINT `fk_payment_rental` FOREIGN KEY (`rental_id`) REFERENCES `rental_requests` (`rental_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_payments`
--

LOCK TABLES `rental_payments` WRITE;
/*!40000 ALTER TABLE `rental_payments` DISABLE KEYS */;
INSERT INTO `rental_payments` VALUES (1,8,'2026-05-16',2.00,'Paid'),(2,10,NULL,NULL,'Pending');
/*!40000 ALTER TABLE `rental_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_requests`
--

DROP TABLE IF EXISTS `rental_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_requests` (
  `rental_id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(50) DEFAULT NULL,
  `machine_id` int DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `rental_purpose` text,
  `date_rented` date DEFAULT NULL,
  `rental_status` enum('Pending','Approved','Disapproved') DEFAULT 'Pending',
  PRIMARY KEY (`rental_id`),
  KEY `fk_rental_member` (`member_id`),
  KEY `fk_rental_machine` (`machine_id`),
  KEY `fk_rental_staff` (`user_id`),
  CONSTRAINT `fk_rental_machine` FOREIGN KEY (`machine_id`) REFERENCES `machine_registry` (`machine_id`),
  CONSTRAINT `fk_rental_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_rental_staff` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_requests`
--

LOCK TABLES `rental_requests` WRITE;
/*!40000 ALTER TABLE `rental_requests` DISABLE KEYS */;
INSERT INTO `rental_requests` VALUES (8,'MEM-003',1,'U-002','For Land Preparation','2026-05-03','Approved'),(10,'MEM-003',1,'U-002','For Harvesting','2026-05-23','Approved');
/*!40000 ALTER TABLE `rental_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('General Manager','Operation Manager','Cashier','Treasurer','Clerk','Member','Mechanic Head') NOT NULL,
  `account_status` enum('active','locked','suspended') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('U-002','ope','$2b$10$/A3Wz.dC5mK8vE2TPy3B5.o1HFEenApXgTe7F5/FL6nOF0OJyEgk.','Operation Manager','active','2026-05-15 04:32:56'),('U-003','mem','$2b$10$OoIYw0eymIgWxr.TkK0JSOoqW8u.iV2jkDtiCvrRwnwjXE3n2qyfe','Member','active','2026-05-15 03:28:09'),('U-004','cas','$2b$10$hAZoMavl8JPZH6y30l1faeUcRFK1VkHcEcymRhH6bzo0esC3zLYyK','Cashier','active','2026-05-15 03:54:21'),('U-005','mec','$2b$10$atChdRzTCMBZD3oftTnl4eZuMVgaI3lcjC.7TEVBYGyEdqSn5yekC','Mechanic Head','active','2026-05-15 04:34:45');
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

-- Dump completed on 2026-05-15  5:05:30
