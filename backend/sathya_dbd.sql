-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sathya_dbd
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `actual_budget`
--

DROP TABLE IF EXISTS `actual_budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actual_budget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `overhead_id` int NOT NULL,
  `po_budget_id` int NOT NULL,
  `actual_value` decimal(15,2) DEFAULT NULL,
  `difference_value` decimal(15,2) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `splitted_budget` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `overhead_id` (`overhead_id`),
  KEY `po_budget_id` (`po_budget_id`),
  CONSTRAINT `actual_budget_ibfk_1` FOREIGN KEY (`overhead_id`) REFERENCES `overhead` (`id`),
  CONSTRAINT `actual_budget_ibfk_2` FOREIGN KEY (`po_budget_id`) REFERENCES `po_budget` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actual_budget`
--

LOCK TABLES `actual_budget` WRITE;
/*!40000 ALTER TABLE `actual_budget` DISABLE KEYS */;
INSERT INTO `actual_budget` VALUES (1,1,1,NULL,NULL,'','2025-09-09 09:27:21',119498.00),(2,2,1,4500.00,114998.00,'','2025-09-09 09:27:21',119498.00),(3,3,1,10000.00,109498.00,NULL,'2025-09-09 10:42:06',119498.00),(4,4,1,12000.00,107498.00,NULL,'2025-09-09 10:42:15',119498.00),(5,5,1,13000.00,106497.75,NULL,'2025-09-09 10:42:24',119497.75),(6,2,2,0.00,0.00,NULL,'2025-09-10 04:38:30',0.00);
/*!40000 ALTER TABLE `actual_budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actual_budget_history`
--

DROP TABLE IF EXISTS `actual_budget_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actual_budget_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actual_budget_id` int NOT NULL,
  `entry_date` date NOT NULL,
  `actual_value` decimal(15,2) DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `actual_budget_id` (`actual_budget_id`),
  CONSTRAINT `actual_budget_history_ibfk_1` FOREIGN KEY (`actual_budget_id`) REFERENCES `actual_budget` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actual_budget_history`
--

LOCK TABLES `actual_budget_history` WRITE;
/*!40000 ALTER TABLE `actual_budget_history` DISABLE KEYS */;
INSERT INTO `actual_budget_history` VALUES (1,3,'2025-09-08',10000.00,NULL,'2025-09-09 16:12:06'),(2,4,'2025-09-08',12000.00,NULL,'2025-09-09 16:12:15'),(3,5,'2025-09-08',13000.00,NULL,'2025-09-09 16:12:24');
/*!40000 ALTER TABLE `actual_budget_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Coimbatore'),(2,'Perundurai');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_id` varchar(30) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `spoc_name` varchar(100) DEFAULT NULL,
  `spoc_contact_no` varchar(20) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `vendor_code` varchar(50) DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`company_id`),
  KEY `fk_city` (`city_id`),
  KEY `fk_state` (`state_id`),
  CONSTRAINT `fk_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
  CONSTRAINT `fk_state` FOREIGN KEY (`state_id`) REFERENCES `state` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('CO001','Jay Jay Mills (India) Private Ltd.,','Sipcot Industrial Growth centre, K-32, Perundurai, Tamil Nadu 638052','Gunasekar','914294234015','33AAACJ7915N1ZB','998717',2,1,'638052','2025-08-25 05:02:52','2025-08-25 05:02:52'),('CO002','KGISL','Saravanampatti','Suresh','9484904147','ABC2109345STC23','3456',NULL,1,'641035','2025-09-03 04:41:57','2025-09-03 04:41:57'),('CO003','Test','Test','Anand','8456679112','4984894983TEST','409872',1,1,'641 035','2025-09-10 05:45:53','2025-09-10 05:45:53'),('CO004','KPR Mills','Saravanampatti','test','126035774','ABC2109345STC23','547855',1,1,'641035','2025-09-19 05:32:02','2025-09-19 05:32:02'),('CO005','Test Clinet 05','Saravanampatti','Tester','7412589630','ABC2109345ST435','4545810',1,1,'641035','2025-09-19 05:34:08','2025-09-19 05:34:08'),('CO006','Test Client 06','Saravanampatti','Tester','7896541230','ABC2109345STC10','3234443',1,1,'641035','2025-09-19 05:35:02','2025-09-19 05:35:02'),('CO007','Test Client 07','Saravanampatti','Tester','7896541230','ABC2109345STC41','7456321',1,1,'641035','2025-09-19 05:36:50','2025-09-19 05:36:50'),('CO008','Test Client 08','Saravanampatti','Tester','7896541230','ABC2109645STC23','344532',1,1,'641035','2025-09-19 05:37:28','2025-09-19 05:37:28'),('CO009','Test Client 09','Saravanampatti','Tester','7896541230','ABC2109345STC53','5478534',1,1,'641035','2025-09-19 05:38:24','2025-09-19 05:38:24'),('CO010','Test Client 10','Saravanampatti','Tester','7896541230','ABC210934STC476','45458107',1,1,'641035','2025-09-19 05:39:40','2025-09-19 05:39:40'),('CO011','Test Client 11','Saravanampatti','Tester','7896541230','ABC21095STC657','543671234',1,NULL,'641035','2025-09-19 05:40:53','2025-09-19 05:40:53'),('CO012','Test Client 12','Saravanampatti','Tester','7896541230','ABC29345STC523','4710256',1,1,'641035','2025-09-19 05:52:05','2025-09-19 05:52:05'),('CO013','Test Client 13',' Kgisl Campus, 365, near Thudiyalur Road, Saravanampatti, Coimbatore, Tamil Nadu 641035','Tester','7896541230','KGISL09542435','323432',1,2,'641035','2025-09-19 05:53:12','2025-09-19 05:53:12');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completion_entries_history`
--

DROP TABLE IF EXISTS `completion_entries_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `completion_entries_history` (
  `entry_id` bigint NOT NULL AUTO_INCREMENT,
  `rec_id` int NOT NULL,
  `entry_date` date NOT NULL,
  `area_added` decimal(10,2) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `value_added` decimal(10,2) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_rec_id_entry_date` (`rec_id`,`entry_date`),
  CONSTRAINT `completion_entries_history_ibfk_1` FOREIGN KEY (`rec_id`) REFERENCES `po_reckoner` (`rec_id`),
  CONSTRAINT `completion_entries_history_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completion_entries_history`
--

LOCK TABLES `completion_entries_history` WRITE;
/*!40000 ALTER TABLE `completion_entries_history` DISABLE KEYS */;
INSERT INTO `completion_entries_history` VALUES (1,1,'2025-05-28',85.00,120.00,10200.00,3,'2025-08-25 11:46:51'),(2,3,'2025-05-29',20.00,100.00,2000.00,3,'2025-08-25 11:48:20'),(3,2,'2025-05-29',45.00,140.00,6300.00,3,'2025-08-25 11:48:23'),(4,1,'2025-05-29',75.00,120.00,9000.00,3,'2025-08-25 11:48:24'),(5,1,'2025-05-30',40.00,120.00,4800.00,3,'2025-08-25 11:49:19'),(6,2,'2025-05-30',40.00,140.00,5600.00,3,'2025-08-25 11:49:21'),(7,3,'2025-05-30',61.00,100.00,6100.00,3,'2025-08-25 11:49:23'),(8,2,'2025-05-31',50.00,140.00,7000.00,3,'2025-08-25 11:49:33'),(9,3,'2025-05-31',40.00,100.00,4000.00,3,'2025-08-25 11:49:38'),(10,4,'2025-06-02',36.00,135.00,4860.00,3,'2025-08-25 11:49:51'),(11,1,'2025-06-02',15.00,120.00,1800.00,3,'2025-08-25 11:49:58'),(12,1,'2025-06-03',86.00,120.00,10320.00,3,'2025-08-25 11:50:08'),(13,1,'2025-06-04',36.00,120.00,4320.00,3,'2025-08-25 11:50:23'),(14,2,'2025-06-04',30.00,140.00,4200.00,3,'2025-08-25 11:50:26'),(15,2,'2025-06-05',60.00,140.00,8400.00,3,'2025-08-25 11:50:42'),(16,4,'2025-06-05',30.00,135.00,4050.00,3,'2025-08-25 11:50:44'),(17,1,'2025-06-06',40.00,120.00,4800.00,3,'2025-08-25 11:51:05'),(18,2,'2025-06-06',30.00,140.00,4200.00,3,'2025-08-25 11:51:06'),(19,4,'2025-06-06',20.00,135.00,2700.00,3,'2025-08-25 11:51:08'),(20,4,'2025-06-07',26.00,135.00,3510.00,3,'2025-08-25 11:51:26'),(21,2,'2025-06-07',40.00,140.00,5600.00,3,'2025-08-25 11:51:34'),(22,1,'2025-06-07',20.00,120.00,2400.00,3,'2025-08-25 11:51:39'),(23,1,'2025-06-08',60.00,120.00,7200.00,3,'2025-08-25 11:52:07'),(24,1,'2025-06-09',40.00,120.00,4800.00,3,'2025-08-25 11:52:16'),(25,2,'2025-06-09',40.00,140.00,5600.00,3,'2025-08-25 11:52:21'),(26,1,'2025-06-10',65.00,120.00,7800.00,3,'2025-08-25 11:52:31'),(27,2,'2025-06-10',40.00,140.00,5600.00,3,'2025-08-25 11:52:33'),(28,1,'2025-06-11',105.00,120.00,12600.00,3,'2025-08-25 11:52:41'),(29,2,'2025-06-11',65.00,140.00,9100.00,3,'2025-08-25 11:52:44'),(30,4,'2025-06-11',30.00,135.00,4050.00,3,'2025-08-25 11:52:55'),(31,4,'2025-06-12',30.00,135.00,4050.00,3,'2025-08-25 11:53:17'),(32,3,'2025-06-12',18.00,100.00,1800.00,3,'2025-08-25 11:53:18'),(33,2,'2025-06-12',50.00,140.00,7000.00,3,'2025-08-25 11:53:20'),(34,4,'2025-06-13',65.00,135.00,8775.00,3,'2025-08-25 11:53:38'),(35,3,'2025-06-13',65.00,100.00,6500.00,3,'2025-08-25 11:53:41'),(36,2,'2025-06-13',35.00,140.00,4900.00,3,'2025-08-25 11:53:44'),(37,1,'2025-06-13',20.00,120.00,2400.00,3,'2025-08-25 11:53:48'),(38,4,'2025-06-14',40.00,135.00,5400.00,3,'2025-08-25 11:53:56'),(39,2,'2025-06-14',40.00,140.00,5600.00,3,'2025-08-25 11:54:01'),(40,4,'2025-06-16',50.00,135.00,6750.00,3,'2025-08-25 11:54:24'),(41,4,'2025-06-17',65.00,135.00,8775.00,3,'2025-08-25 11:54:32'),(42,4,'2025-06-18',45.00,135.00,6075.00,3,'2025-08-25 11:54:38'),(43,3,'2025-06-18',60.00,100.00,6000.00,3,'2025-08-25 11:54:45'),(44,2,'2025-06-18',60.00,140.00,8400.00,3,'2025-08-25 11:54:49'),(45,1,'2025-06-18',30.00,120.00,3600.00,3,'2025-08-25 11:54:53'),(46,4,'2025-06-19',40.00,135.00,5400.00,3,'2025-08-25 11:55:03'),(47,2,'2025-06-19',55.00,140.00,7700.00,3,'2025-08-25 11:55:08'),(48,1,'2025-06-19',55.00,120.00,6600.00,3,'2025-08-25 11:55:12'),(49,4,'2025-06-20',50.00,135.00,6750.00,3,'2025-08-25 11:55:20'),(50,3,'2025-06-20',25.00,100.00,2500.00,3,'2025-08-25 11:55:24'),(51,2,'2025-06-20',30.00,140.00,4200.00,3,'2025-08-25 11:55:28'),(52,1,'2025-06-20',30.00,120.00,3600.00,3,'2025-08-25 11:55:31'),(53,4,'2025-06-21',35.00,135.00,4725.00,3,'2025-08-25 11:55:40'),(54,3,'2025-06-21',40.00,100.00,4000.00,3,'2025-08-25 11:55:44'),(55,1,'2025-06-21',40.00,120.00,4800.00,3,'2025-08-25 11:55:49'),(56,4,'2025-06-23',30.00,135.00,4050.00,3,'2025-08-25 11:56:00'),(57,2,'2025-06-23',30.00,140.00,4200.00,3,'2025-08-25 11:56:06'),(58,1,'2025-06-23',30.00,120.00,3600.00,3,'2025-08-25 11:56:09'),(59,4,'2025-06-25',45.00,135.00,6075.00,3,'2025-08-25 11:56:17'),(60,3,'2025-06-25',45.00,100.00,4500.00,3,'2025-08-25 11:56:20'),(61,1,'2025-06-25',20.00,120.00,2400.00,3,'2025-08-25 11:56:25'),(62,3,'2025-06-26',36.00,100.00,3600.00,3,'2025-08-25 11:56:36'),(64,2,'2025-06-26',40.00,140.00,5600.00,3,'2025-08-25 11:57:36'),(65,1,'2025-06-26',40.00,120.00,4800.00,3,'2025-08-25 11:57:42'),(66,4,'2025-06-27',40.00,135.00,5400.00,3,'2025-08-25 11:57:56'),(67,2,'2025-06-27',45.00,140.00,6300.00,3,'2025-08-25 11:57:59'),(68,1,'2025-06-27',45.00,120.00,5400.00,3,'2025-08-25 11:58:02'),(69,4,'2025-06-28',45.00,135.00,6075.00,3,'2025-08-25 11:58:11'),(70,2,'2025-06-28',45.00,140.00,6300.00,3,'2025-08-25 11:58:16'),(71,4,'2025-06-29',20.00,135.00,2700.00,3,'2025-08-25 11:58:28'),(72,3,'2025-06-29',20.00,100.00,2000.00,3,'2025-08-25 11:58:34'),(73,2,'2025-06-29',30.00,140.00,4200.00,3,'2025-08-25 11:58:37'),(74,1,'2025-06-29',30.00,120.00,3600.00,3,'2025-08-25 11:58:42'),(75,1,'2025-06-30',30.00,120.00,3600.00,3,'2025-08-25 11:58:57'),(76,2,'2025-06-30',30.00,140.00,4200.00,3,'2025-08-25 11:58:58'),(77,4,'2025-06-30',30.00,135.00,4050.00,3,'2025-08-25 11:59:00'),(78,4,'2025-07-01',30.00,135.00,4050.00,3,'2025-08-25 11:59:08'),(79,2,'2025-07-01',30.00,140.00,4200.00,3,'2025-08-25 11:59:13'),(80,4,'2025-07-02',25.00,135.00,3375.00,3,'2025-08-25 11:59:38'),(81,3,'2025-07-02',25.00,100.00,2500.00,3,'2025-08-25 11:59:39'),(82,2,'2025-07-02',25.00,140.00,3500.00,3,'2025-08-25 11:59:41'),(83,1,'2025-07-02',40.00,120.00,4800.00,3,'2025-08-25 11:59:42'),(84,4,'2025-07-03',26.00,135.00,3510.00,3,'2025-08-25 11:59:51'),(85,2,'2025-07-03',35.00,140.00,4900.00,3,'2025-08-25 11:59:59'),(86,1,'2025-07-03',35.00,120.00,4200.00,3,'2025-08-25 12:00:03'),(87,3,'2025-07-04',45.00,100.00,4500.00,3,'2025-08-25 12:00:13'),(88,2,'2025-07-04',45.00,140.00,6300.00,3,'2025-08-25 12:00:17'),(89,1,'2025-07-04',60.00,120.00,7200.00,3,'2025-08-25 12:00:21'),(90,4,'2025-07-05',20.00,135.00,2700.00,3,'2025-08-25 12:00:30'),(91,1,'2025-07-21',72.00,120.00,8640.00,3,'2025-08-25 12:00:52'),(92,2,'2025-07-21',53.00,140.00,7420.00,3,'2025-08-25 12:00:54'),(93,4,'2025-07-22',64.00,135.00,8640.00,3,'2025-08-25 12:01:26'),(94,2,'2025-07-22',20.00,140.00,2800.00,3,'2025-08-25 12:01:31'),(95,1,'2025-07-22',5.00,120.00,600.00,3,'2025-08-25 12:01:35'),(96,4,'2025-07-23',18.00,135.00,2430.00,3,'2025-08-25 12:01:46'),(97,2,'2025-07-23',61.00,140.00,8540.00,3,'2025-08-25 12:01:52'),(98,1,'2025-07-23',86.00,120.00,10320.00,3,'2025-08-25 12:01:55'),(99,4,'2025-07-24',68.00,135.00,9180.00,3,'2025-08-25 12:02:04'),(100,2,'2025-07-24',25.00,140.00,3500.00,3,'2025-08-25 12:02:09'),(101,2,'2025-07-25',68.00,140.00,9520.00,3,'2025-08-25 12:02:25'),(102,4,'2025-07-25',30.00,135.00,4050.00,3,'2025-08-25 12:02:27'),(103,4,'2025-07-26',85.00,135.00,11475.00,3,'2025-08-25 12:02:38'),(104,2,'2025-07-26',30.00,140.00,4200.00,3,'2025-08-25 12:02:44'),(105,1,'2025-07-26',85.00,120.00,10200.00,3,'2025-08-25 12:02:49'),(106,2,'2025-07-27',40.00,140.00,5600.00,3,'2025-08-25 12:03:04'),(107,1,'2025-07-27',25.00,120.00,3000.00,3,'2025-08-25 12:03:07'),(108,4,'2025-07-28',60.00,135.00,8100.00,3,'2025-08-25 12:03:20'),(109,1,'2025-07-28',20.00,120.00,2400.00,3,'2025-08-25 12:03:24'),(110,1,'2025-07-29',20.00,120.00,2400.00,3,'2025-08-25 12:03:35'),(111,2,'2025-07-29',20.00,140.00,2800.00,3,'2025-08-25 12:03:36'),(112,4,'2025-07-30',57.00,135.00,7695.00,3,'2025-08-25 12:03:48'),(113,2,'2025-07-30',37.00,140.00,5180.00,3,'2025-08-25 12:03:55'),(114,1,'2025-07-30',25.00,120.00,3000.00,3,'2025-08-25 12:03:59'),(115,1,'2025-07-31',50.00,120.00,6000.00,3,'2025-08-25 12:04:12'),(116,2,'2025-07-31',50.00,140.00,7000.00,3,'2025-08-25 12:04:13'),(117,4,'2025-08-01',50.00,135.00,6750.00,3,'2025-08-25 12:04:21'),(118,1,'2025-08-01',18.00,120.00,2160.00,3,'2025-08-25 12:04:26'),(119,4,'2025-08-02',30.00,135.00,4050.00,3,'2025-08-25 12:04:33'),(120,1,'2025-08-02',20.00,120.00,2400.00,3,'2025-08-25 12:04:37'),(121,4,'2025-08-04',30.00,135.00,4050.00,3,'2025-08-25 12:04:49'),(122,2,'2025-08-04',30.00,140.00,4200.00,3,'2025-08-25 12:04:54'),(123,4,'2025-08-05',20.00,135.00,2700.00,3,'2025-08-25 12:05:15'),(124,2,'2025-08-05',20.00,140.00,2800.00,3,'2025-08-25 12:05:23'),(125,1,'2025-08-05',45.00,120.00,5400.00,3,'2025-08-25 12:05:28'),(126,4,'2025-08-06',20.00,135.00,2700.00,3,'2025-08-25 12:05:37'),(127,2,'2025-08-06',45.00,140.00,6300.00,3,'2025-08-25 12:05:41'),(128,1,'2025-08-06',30.00,120.00,3600.00,3,'2025-08-25 12:05:45'),(129,4,'2025-08-07',60.00,135.00,8100.00,3,'2025-08-25 12:05:56'),(130,2,'2025-08-07',60.00,140.00,8400.00,3,'2025-08-25 12:06:01'),(131,1,'2025-08-07',60.00,120.00,7200.00,3,'2025-08-25 12:06:04'),(132,4,'2025-08-08',80.00,135.00,10800.00,3,'2025-08-25 12:06:16'),(133,2,'2025-08-08',80.00,140.00,11200.00,3,'2025-08-25 12:06:20'),(134,1,'2025-08-08',30.00,120.00,3600.00,3,'2025-08-25 12:06:23'),(135,4,'2025-08-09',15.00,135.00,2025.00,3,'2025-08-25 12:06:30'),(136,3,'2025-08-09',30.00,100.00,3000.00,3,'2025-08-25 12:06:34'),(137,2,'2025-08-09',30.00,140.00,4200.00,3,'2025-08-25 12:06:38'),(138,1,'2025-08-10',40.00,120.00,4800.00,3,'2025-08-25 12:06:47'),(139,4,'2025-08-10',15.00,135.00,2025.00,3,'2025-08-25 12:06:51'),(140,4,'2025-08-10',0.00,135.00,0.00,3,'2025-08-25 12:06:54'),(141,1,'2025-08-13',45.00,120.00,5400.00,3,'2025-08-25 12:08:10'),(142,4,'2025-08-13',35.00,135.00,4725.00,3,'2025-08-25 12:08:16'),(143,4,'2025-08-14',25.00,135.00,3375.00,3,'2025-08-25 12:08:22'),(144,2,'2025-08-14',65.00,140.00,9100.00,3,'2025-08-25 12:08:27'),(146,1,'2025-08-14',45.00,120.00,5400.00,3,'2025-08-25 12:12:59'),(147,4,'2025-08-15',25.00,135.00,3375.00,3,'2025-08-25 12:15:22'),(148,2,'2025-08-16',35.00,140.00,4900.00,3,'2025-08-25 12:15:35'),(149,1,'2025-08-16',35.00,120.00,4200.00,3,'2025-08-25 12:15:39'),(150,3,'2025-08-18',20.00,100.00,2000.00,3,'2025-08-25 12:16:20'),(151,1,'2025-08-19',40.00,120.00,4800.00,3,'2025-08-25 12:16:34'),(152,2,'2025-08-19',20.00,140.00,2800.00,3,'2025-08-25 12:16:39'),(153,4,'2025-08-20',20.00,135.00,2700.00,3,'2025-08-25 12:17:00'),(154,2,'2025-08-20',20.00,140.00,2800.00,3,'2025-08-25 12:17:04'),(155,4,'2025-08-21',30.00,135.00,4050.00,3,'2025-08-25 12:17:28'),(156,1,'2025-08-21',20.00,120.00,2400.00,3,'2025-08-25 12:17:34'),(157,1,'2025-08-11',30.00,120.00,3600.00,3,'2025-08-25 12:20:16'),(158,4,'2025-09-12',10.00,135.00,1350.00,3,'2025-09-12 11:13:18'),(159,4,'2025-09-12',100.00,135.00,13500.00,3,'2025-09-12 12:00:48');
/*!40000 ALTER TABLE `completion_entries_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completion_status`
--

DROP TABLE IF EXISTS `completion_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `completion_status` (
  `completion_id` int NOT NULL AUTO_INCREMENT,
  `rec_id` int DEFAULT NULL,
  `area_completed` float DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `value` float DEFAULT NULL,
  `billed_area` float DEFAULT NULL,
  `billed_value` float DEFAULT NULL,
  `balance_area` float DEFAULT NULL,
  `balance_value` float DEFAULT NULL,
  `work_status` varchar(50) DEFAULT NULL,
  `billing_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`completion_id`),
  KEY `rec_id` (`rec_id`),
  KEY `fk_created_by` (`created_by`),
  CONSTRAINT `completion_status_ibfk_1` FOREIGN KEY (`rec_id`) REFERENCES `po_reckoner` (`rec_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completion_status`
--

LOCK TABLES `completion_status` WRITE;
/*!40000 ALTER TABLE `completion_status` DISABLE KEYS */;
INSERT INTO `completion_status` VALUES (1,1,1848,120,221760,NULL,NULL,NULL,NULL,'In Progress','Not Billed','2025-08-25 05:29:50',3,'2025-08-25 06:38:10'),(2,2,1854,140,259560,NULL,NULL,NULL,NULL,'In Progress','Not Billed','2025-08-25 05:29:50',3,'2025-08-25 06:46:39'),(3,3,550,100,55000,NULL,NULL,NULL,NULL,'In Progress','Not Billed','2025-08-25 05:29:50',3,'2025-08-25 06:46:20'),(4,4,1820,135,245700,NULL,NULL,NULL,NULL,'In Progress','Not Billed','2025-08-25 05:29:50',3,'2025-09-12 06:30:48'),(5,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-04 10:26:49',NULL,'2025-09-04 10:26:49'),(6,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-04 10:26:49',NULL,'2025-09-04 10:26:49'),(7,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-10 04:34:19',NULL,'2025-09-10 04:34:19'),(8,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-10 04:34:19',NULL,'2025-09-10 04:34:19'),(9,9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-10 04:34:19',NULL,'2025-09-10 04:34:19'),(10,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-10 04:34:19',NULL,'2025-09-10 04:34:19');
/*!40000 ALTER TABLE `completion_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumables_master`
--

DROP TABLE IF EXISTS `consumables_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumables_master` (
  `consumable_id` int NOT NULL AUTO_INCREMENT,
  `consumable_name` varchar(50) NOT NULL,
  PRIMARY KEY (`consumable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumables_master`
--

LOCK TABLES `consumables_master` WRITE;
/*!40000 ALTER TABLE `consumables_master` DISABLE KEYS */;
INSERT INTO `consumables_master` VALUES (1,'Grinding Machine'),(2,'Paint mixing machine'),(3,'Paint Brush'),(4,'Spike Roller Paint'),(5,'Trowel');
/*!40000 ALTER TABLE `consumables_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contractor`
--

DROP TABLE IF EXISTS `contractor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contractor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contractor_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contractor`
--

LOCK TABLES `contractor` WRITE;
/*!40000 ALTER TABLE `contractor` DISABLE KEYS */;
/*!40000 ALTER TABLE `contractor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `description_of_work`
--

DROP TABLE IF EXISTS `description_of_work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `description_of_work` (
  `item_id` varchar(30) NOT NULL,
  `item_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description_of_work`
--

LOCK TABLES `description_of_work` WRITE;
/*!40000 ALTER TABLE `description_of_work` DISABLE KEYS */;
INSERT INTO `description_of_work` VALUES ('Item-1','Sticker for cooling water supply'),('Item-10','Sticker for Non Peso Tank'),('Item-11','Sticker for Holding Tank'),('Item-12','Structural Painting Work'),('Item-13','Nitrogen 2 coat redoxide + Canary Yellow'),('Item-14','Raw water 2 coat redoxide + sea green'),('Item-15','PSV quench 2 coat redoxide + black'),('Item-16','Vacuum White'),('Item-17','Plant Air 2 coat redoxide + sky blue'),('Item-18','Structural paint incl cleaner 2 coat paint'),('Item-19','Air line 1 coat blue'),('Item-2','Sticker for cooling water return'),('Item-20','Cooling water line 1 coat dark green'),('Item-21','Raw water line 1 coat sea green'),('Item-22','Structural line painting'),('Item-23','Primer coating with supply'),('Item-24','Cooling water line painting'),('Item-25','Chilled water line painting'),('Item-26','Chilled brine line painting'),('Item-27','Nitrogen line painting'),('Item-28','Process water line painting work'),('Item-29','PSV line painting'),('Item-3','Sticker for process water'),('Item-30','Eye wash shower line'),('Item-31','Raw water line'),('Item-32','Instrument air line'),('Item-33','Plant air line painting'),('Item-34','LP Steam line painting work'),('Item-35','MP Stam line painting'),('Item-36','HSD line painting work'),('Item-37','Cooling water band supply and pasting'),('Item-38','Chilled water band supply and pasting'),('Item-39','Chilled brine band supply and pasting'),('Item-4','Sticker for Eye wash'),('Item-40','Nitrogen bank supply and pasting'),('Item-41','Process water band supply and pasting'),('Item-42','PSV band supply and pasting'),('Item-43','Eye wash shower band supply and pasting'),('Item-44','Raw water band supply and pasting'),('Item-45','Instrument air band supply and pasting'),('Item-46','Plant air band supply and pasting'),('Item-47','LP Steam bank supply and pasting'),('Item-48','MP Steam band supply and pasting'),('Item-49','HSD Bank supply and pasting'),('Item-5','Sticker for High speed diesel'),('Item-50','1\" Line arrow supply and pasting'),('Item-51','1.5\" line arrow supply and pasting'),('Item-52','2\" line arrow supply and pasting'),('Item-53','3\" line arrow supply and pasting'),('Item-54','4\" line arrow supply and pasting'),('Item-55','6\" line arrow supply and pasting'),('Item-56','8\" line arrow supply and pasting'),('Item-57','10\" line arrow supply and pasting'),('Item-58','12\" line arrow supply and pasting'),('Item-59','1\" line font stickering work'),('Item-6','Sticker for Vaccum'),('Item-60','1.5\" line font stickering work'),('Item-61','2\" line font stickering work'),('Item-62','3\" line font stickering work'),('Item-63','4\" line font stickering work'),('Item-64','6\" line font stickering work'),('Item-65','8\" line font stickering work'),('Item-66','10\" line font stickering work'),('Item-67','12\" line font stickering work'),('Item-7','Sticker for scrubber'),('Item-8','Sticker for LEV Scrubber'),('Item-9','Sticker for Peso Tank');
/*!40000 ALTER TABLE `description_of_work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_master`
--

DROP TABLE IF EXISTS `driver_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driver_name` varchar(255) DEFAULT NULL,
  `driver_mobile` varchar(20) DEFAULT NULL,
  `driver_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_master`
--

LOCK TABLES `driver_master` WRITE;
/*!40000 ALTER TABLE `driver_master` DISABLE KEYS */;
INSERT INTO `driver_master` VALUES (1,'raj','9483948373','chennai'),(3,'tharun','958398394','gandhipuram'),(4,'prasanth','9483948384','example address'),(5,'hari','88849483423','example'),(6,'ram','9484939483','pn palayam');
/*!40000 ALTER TABLE `driver_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_department`
--

DROP TABLE IF EXISTS `emp_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_department`
--

LOCK TABLES `emp_department` WRITE;
/*!40000 ALTER TABLE `emp_department` DISABLE KEYS */;
INSERT INTO `emp_department` VALUES (1,'Engineering'),(2,'Management'),(3,'Accounts'),(4,'HR Management'),(5,'Marketing');
/*!40000 ALTER TABLE `emp_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_designation`
--

DROP TABLE IF EXISTS `emp_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `designation` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_designation`
--

LOCK TABLES `emp_designation` WRITE;
/*!40000 ALTER TABLE `emp_designation` DISABLE KEYS */;
INSERT INTO `emp_designation` VALUES (1,'Site Supervisor'),(2,'Accountant'),(3,'HR Manager'),(5,'Marketing Executive'),(6,'Site Engineer'),(7,'Labour');
/*!40000 ALTER TABLE `emp_designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_gender`
--

DROP TABLE IF EXISTS `emp_gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_gender` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_gender`
--

LOCK TABLES `emp_gender` WRITE;
/*!40000 ALTER TABLE `emp_gender` DISABLE KEYS */;
INSERT INTO `emp_gender` VALUES (1,'Male'),(2,'Female'),(3,'Other');
/*!40000 ALTER TABLE `emp_gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_status`
--

DROP TABLE IF EXISTS `emp_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_status`
--

LOCK TABLES `emp_status` WRITE;
/*!40000 ALTER TABLE `emp_status` DISABLE KEYS */;
INSERT INTO `emp_status` VALUES (1,'Active'),(2,'Inactive');
/*!40000 ALTER TABLE `emp_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_master`
--

DROP TABLE IF EXISTS `employee_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_master` (
  `emp_id` varchar(30) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `date_of_birth` date NOT NULL,
  `date_of_joining` date NOT NULL,
  `company` varchar(100) NOT NULL,
  `branch` varchar(50) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `company_email` varchar(100) NOT NULL,
  `current_address` varchar(255) NOT NULL,
  `permanent_address` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `gender_id` int NOT NULL,
  `dept_id` int NOT NULL,
  `emp_type_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `status_id` int NOT NULL,
  `esic_number` varchar(50) DEFAULT NULL,
  `pf_number` varchar(50) DEFAULT NULL,
  `approved_salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`emp_id`),
  KEY `fk_gender` (`gender_id`),
  KEY `fk_department` (`dept_id`),
  KEY `fk_employment_type` (`emp_type_id`),
  KEY `fk_designation` (`designation_id`),
  KEY `fk_employee_status` (`status_id`),
  CONSTRAINT `fk_department` FOREIGN KEY (`dept_id`) REFERENCES `emp_department` (`id`),
  CONSTRAINT `fk_designation` FOREIGN KEY (`designation_id`) REFERENCES `emp_designation` (`id`),
  CONSTRAINT `fk_employee_status` FOREIGN KEY (`status_id`) REFERENCES `emp_status` (`id`),
  CONSTRAINT `fk_employment_type` FOREIGN KEY (`emp_type_id`) REFERENCES `employment_type` (`id`),
  CONSTRAINT `fk_gender` FOREIGN KEY (`gender_id`) REFERENCES `emp_gender` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_master`
--

LOCK TABLES `employee_master` WRITE;
/*!40000 ALTER TABLE `employee_master` DISABLE KEYS */;
INSERT INTO `employee_master` VALUES ('EMP001','Ezhavahgan','1988-07-13','2024-06-19','SathyaCoating PVT LTD','Edayarpalayam','9856741246','ezhavahgan001@sathyacoating.com','221 Chinnammal Nagar, Edayarpalayam, Vadavalli Road, Coimbatore-641041','221 Chinnammal Nagar, Edayarpalayam, Vadavalli Road, Coimbatore-641041','2025-07-29 15:57:40',1,2,1,6,1,'2-1234567890-12-0997','N/AMB/0123456/0008483',0.00),('EMP002','ragul prakash','1992-07-09','2025-08-06','Student','peelamedu','+919942883595','sanjayravichandran006@gmail.com','25c, uniontank road, 1st street,periyanaicken palayam','25c, uniontank road, 1st street,periyanaicken palayam','2025-08-19 17:41:20',1,2,1,1,1,'12-1234567890-12-0001','TN/AMB/0123456/0001234',0.00),('EMP003','Suresh','1997-06-19','2025-03-20','Sathya Coatings','perundurai','9484938839','suresh@gmail.com','25c, uniontank road, 1st street,periyanaicken palayam','25c, uniontank road, 1st street,perundurai','2025-08-25 10:39:57',1,1,1,6,1,'4894883988943','489438389343',0.00),('EMP004','ram','1992-07-07','2025-08-06','sathyacoatings','peelamedu','9876789874','ram@gmail.com','25c, uniontank road, 1st street,periyanaicken palayam','25c, uniontank road, 1st street,periyanaicken palayam','2025-08-19 17:41:20',1,1,1,7,1,'12-1234567890-12-0001','TN/AMB/0123456/0001234',0.00),('emp0043','sanjay','2025-09-02','2025-09-18','mills','pm','8978767987','name@gmail.com','cbe','cbe','2025-09-08 15:13:53',1,1,1,1,1,'84484949494949494','4984983898989344',0.00),('EMP005','eric','1997-06-18','2025-08-06','sathyacoatings','edayarpalayam','8484949484','eric@gmail.com','123 RS Puram , Combatore','123 RS Puram , Combatore','2025-09-01 15:05:00',1,2,1,7,1,'8484847478484','848484849834983498',0.00),('EMP006','velraj','1987-10-13','2025-08-14','sathyacoatings','peelamedu','9847837263','peelamedu@gmail.com','123 , gandhipuram','123 , gandhipuram','2025-09-01 15:08:27',1,2,1,7,1,'398983298329832','8938989327832',0.00);
/*!40000 ALTER TABLE `employee_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employment_type`
--

DROP TABLE IF EXISTS `employment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employment_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employment_type`
--

LOCK TABLES `employment_type` WRITE;
/*!40000 ALTER TABLE `employment_type` DISABLE KEYS */;
INSERT INTO `employment_type` VALUES (1,'Full-Time'),(2,'Contract'),(3,'Part-Time');
/*!40000 ALTER TABLE `employment_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_category`
--

DROP TABLE IF EXISTS `expense_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exp_category` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_category`
--

LOCK TABLES `expense_category` WRITE;
/*!40000 ALTER TABLE `expense_category` DISABLE KEYS */;
INSERT INTO `expense_category` VALUES (1,'Room rent'),(2,'Labour food'),(3,'Freight'),(4,'Travelling/Auto'),(5,'Consumables'),(6,'Site er food'),(7,'others');
/*!40000 ALTER TABLE `expense_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_details`
--

DROP TABLE IF EXISTS `expense_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `details` varchar(300) NOT NULL,
  `exp_category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exp_category_id` (`exp_category_id`),
  CONSTRAINT `expense_details_ibfk_1` FOREIGN KEY (`exp_category_id`) REFERENCES `expense_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_details`
--

LOCK TABLES `expense_details` WRITE;
/*!40000 ALTER TABLE `expense_details` DISABLE KEYS */;
INSERT INTO `expense_details` VALUES (1,'Incharge room rent',1),(2,'Incharge team food',2),(3,'Site food',6),(4,'Oragadam to Hosur bus fare',4),(5,'Auto from Hosur bus stand to Motely Appliances up and down',4),(6,'Hosur to Sriperumbudur bus fare',4),(7,'Sriperumbudur to Oragadam Ola cab',4),(8,'Oragadam to AOAI site Ola cab up and down',4),(9,'AOAI to Sunguvarchattram bus for 5 persons',4),(10,'Sunguvarchattram to Sriperumbudur auto',4),(11,'Sriperumbudur to Oragadam bus fare',4),(12,'Oragadam to Chunsung site material unloading up and down',3),(13,'Auto with CPS material for Incharge team',4),(14,'Room to Chunsung site auto with material',4),(15,'Return auto and bus charge for 3 persons',4),(16,'Room to Chunsung site auto charge',4),(17,'Return auto charge',4),(18,'Sriperumbudur to Ranipet bus and auto for Incharge team',4),(19,'Oragadam to Perundurai bus fare for Incharge team',4),(20,'Oragadam to Tenkasi bus ticket',4),(21,'VPG site to Oragadam auto',4),(22,'4 inch roller set',5),(23,'1 inch masking tape',5),(24,'Sample material porter charge',3),(25,'HJ Engineering sample work auto fare',4),(26,'Enamel yellow paint',5),(27,'Paint brush',5),(28,'Material transport from SSMPL to AOAI',3),(29,'4 inch roller 3 sets',5),(30,'Masking tape 5 bundles',5),(31,'Tea',2),(32,'Bike petrol',4),(33,'Plywood',5),(34,'Incharge dress purchase',5),(35,'Mixing mug 2 units',5),(36,'9 inch roller',5),(37,'Bosch grinding machine',5),(38,'Grinding wheel',5),(39,'Exterior 9 inch roller',5),(40,'Trowel 1mm 2 units',5),(41,'Spike roller 2 units',5),(42,'Spike shoe 2 sets',5),(43,'Trowel 1.5mm 2 units',5),(44,'Trowel 2mm 2 units',5),(45,'VPG site mixing buckets 2 units',5),(46,'3-pin plug for mixing machine',5),(47,'others',7);
/*!40000 ALTER TABLE `expense_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incharge_details`
--

DROP TABLE IF EXISTS `incharge_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incharge_details` (
  `incharge_id` varchar(30) NOT NULL,
  `incharge_name` varchar(100) NOT NULL,
  `incharge_role_id` varchar(30) NOT NULL,
  PRIMARY KEY (`incharge_id`),
  KEY `incharge_role_id` (`incharge_role_id`),
  CONSTRAINT `incharge_details_ibfk_1` FOREIGN KEY (`incharge_role_id`) REFERENCES `site_incharge` (`incharge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incharge_details`
--

LOCK TABLES `incharge_details` WRITE;
/*!40000 ALTER TABLE `incharge_details` DISABLE KEYS */;
INSERT INTO `incharge_details` VALUES ('ID001','Aravind Kumar','SI001'),('ID002','Suresh Balaji','SI001'),('ID003','Priya Venkatesh','SI001'),('ID004','Karthik Rajan','SI001'),('ID005','Lakshmi Narayanan','SI001'),('ID006','Vigneshwaran Pillai','SI001'),('ID007','Anitha Subramanian','SI001'),('ID008','Manikandan Nair','SI001'),('ID009','Saravanan Gopi','SI001'),('ID010','Deepa Krishnan','SI001'),('ID011','Ramesh Srinivasan','SI002'),('ID012','Nandhini Murugan','SI002'),('ID013','Gokul Prasath','SI002'),('ID014','Vinoth Kannan','SI002'),('ID015','Meena Sathish','SI002'),('ID016','Balamurugan Ram','SI002'),('ID017','Kavitha Selvaraj','SI002'),('ID018','Praveen Chandran','SI002'),('ID019','Senthil Kumar','SI002'),('ID020','Divya Bharathi','SI002'),('ID021','subash','SI001');
/*!40000 ALTER TABLE `incharge_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_category`
--

DROP TABLE IF EXISTS `item_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_category` (
  `category_id` varchar(30) NOT NULL,
  `category_name` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_category`
--

LOCK TABLES `item_category` WRITE;
/*!40000 ALTER TABLE `item_category` DISABLE KEYS */;
INSERT INTO `item_category` VALUES ('CA101','Structural Painting'),('CA102','PipeLine'),('CA103','stickering'),('CA104','Cool Coating'),('CA105','Coolroof Coating');
/*!40000 ALTER TABLE `item_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_subcategory`
--

DROP TABLE IF EXISTS `item_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_subcategory` (
  `subcategory_id` varchar(30) NOT NULL,
  `subcategory_name` varchar(70) DEFAULT NULL,
  `billing` tinyint DEFAULT '0',
  PRIMARY KEY (`subcategory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_subcategory`
--

LOCK TABLES `item_subcategory` WRITE;
/*!40000 ALTER TABLE `item_subcategory` DISABLE KEYS */;
INSERT INTO `item_subcategory` VALUES ('SC101','Cleaning',0),('SC102','Primer',0),('SC103','1st Coat',0),('SC104','2nd Coat',0),('SC105','Top Coat',1),('SC106','Arrow',1),('SC107','Font Sticker',1),('SC108','Pasting',1);
/*!40000 ALTER TABLE `item_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labour`
--

DROP TABLE IF EXISTS `labour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `date_of_joining` date NOT NULL,
  `company` varchar(255) NOT NULL,
  `branch` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `company_email` varchar(255) NOT NULL,
  `current_address` text NOT NULL,
  `permanent_address` text NOT NULL,
  `gender_id` int NOT NULL,
  `dept_id` int NOT NULL,
  `emp_type_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `status_id` int NOT NULL,
  `esic_number` varchar(50) DEFAULT NULL,
  `pf_number` varchar(50) DEFAULT NULL,
  `contractor_id` int DEFAULT NULL,
  `approved_salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contractor_id` (`contractor_id`),
  KEY `emp_type_id` (`emp_type_id`),
  KEY `labour_ibfk_2` (`gender_id`),
  KEY `labour_ibfk_3` (`dept_id`),
  KEY `labour_ibfk_5` (`designation_id`),
  KEY `labour_ibfk_6` (`status_id`),
  CONSTRAINT `labour_ibfk_1` FOREIGN KEY (`contractor_id`) REFERENCES `contractor` (`id`) ON DELETE SET NULL,
  CONSTRAINT `labour_ibfk_2` FOREIGN KEY (`gender_id`) REFERENCES `emp_gender` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `labour_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `emp_department` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `labour_ibfk_4` FOREIGN KEY (`emp_type_id`) REFERENCES `employment_type` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `labour_ibfk_5` FOREIGN KEY (`designation_id`) REFERENCES `emp_designation` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `labour_ibfk_6` FOREIGN KEY (`status_id`) REFERENCES `emp_status` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labour`
--

LOCK TABLES `labour` WRITE;
/*!40000 ALTER TABLE `labour` DISABLE KEYS */;
INSERT INTO `labour` VALUES (6,'moorthi','2025-05-09','2025-09-12','mills','pm','8494937493','name@gmail.com','cbe','cbe',1,1,1,1,1,'12345678901234567','9885489898945',NULL,1000.00,'2025-09-08 09:54:13','2025-09-09 09:28:45'),(7,'gopal','2000-01-14','2025-08-20','lakshmi mills','peelamedu','9484948493','gopal@gmail.com','rs puram','rs puram',1,1,1,7,1,'12345678901234567','49889894389344389',NULL,1200.00,'2025-09-10 04:49:15','2025-09-10 04:49:15');
/*!40000 ALTER TABLE `labour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labour_assignment`
--

DROP TABLE IF EXISTS `labour_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labour_assignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` varchar(30) NOT NULL,
  `site_id` varchar(30) NOT NULL,
  `desc_id` int NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `labour_id` int DEFAULT NULL,
  `salary` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `site_id` (`site_id`),
  KEY `desc_id` (`desc_id`),
  KEY `created_by` (`created_by`),
  KEY `fk_labour_assignment_labour` (`labour_id`),
  CONSTRAINT `fk_labour_assignment_labour` FOREIGN KEY (`labour_id`) REFERENCES `labour` (`id`),
  CONSTRAINT `labour_assignment_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project_details` (`pd_id`),
  CONSTRAINT `labour_assignment_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`),
  CONSTRAINT `labour_assignment_ibfk_3` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`),
  CONSTRAINT `labour_assignment_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labour_assignment`
--

LOCK TABLES `labour_assignment` WRITE;
/*!40000 ALTER TABLE `labour_assignment` DISABLE KEYS */;
INSERT INTO `labour_assignment` VALUES (1,'PD001','ST001',69,'2025-09-08','2025-09-08',2,'2025-09-08 16:20:59',6,1000.00),(5,'PD002','ST002',17,'2025-09-10','2025-09-12',2,'2025-09-10 10:05:16',6,NULL),(6,'PD002','ST002',53,'2025-09-10','2025-09-12',2,'2025-09-10 10:05:23',6,NULL),(7,'PD001','ST001',69,'2025-09-12','2025-09-13',3,'2025-09-10 10:22:40',7,NULL),(8,'PD001','ST001',69,'2025-09-12','2025-09-15',3,'2025-09-12 12:04:54',6,NULL),(9,'PD001','ST001',69,'2025-09-16','2025-09-19',2,'2025-09-16 11:40:37',7,NULL),(10,'PD001','ST001',69,'2025-09-16','2025-09-19',2,'2025-09-16 11:40:37',6,NULL);
/*!40000 ALTER TABLE `labour_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labour_attendance`
--

DROP TABLE IF EXISTS `labour_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labour_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `labour_assignment_id` int NOT NULL,
  `shift` decimal(3,1) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `entry_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `labour_assignment_id` (`labour_assignment_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `labour_attendance_ibfk_1` FOREIGN KEY (`labour_assignment_id`) REFERENCES `labour_assignment` (`id`),
  CONSTRAINT `labour_attendance_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labour_attendance`
--

LOCK TABLES `labour_attendance` WRITE;
/*!40000 ALTER TABLE `labour_attendance` DISABLE KEYS */;
INSERT INTO `labour_attendance` VALUES (1,1,1.0,3,'2025-09-09 12:46:12','2025-09-09'),(2,1,2.0,3,'2025-09-09 14:00:48','2025-09-08'),(3,1,1.5,3,'2025-09-09 14:10:34','2025-09-07'),(4,5,0.5,3,'2025-09-10 10:06:10','2025-09-10'),(5,5,1.0,3,'2025-09-10 10:06:17','2025-09-11'),(6,5,1.5,3,'2025-09-10 10:06:29','2025-09-12'),(7,6,1.0,3,'2025-09-10 10:06:42','2025-09-10'),(8,6,0.5,3,'2025-09-10 10:06:49','2025-09-11'),(9,7,1.5,3,'2025-09-10 10:22:56','2025-09-11'),(10,7,0.5,3,'2025-09-10 10:23:07','2025-09-12');
/*!40000 ALTER TABLE `labour_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` varchar(30) NOT NULL,
  `location_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES ('LO001','Kanchipuram'),('LO002','Erode'),('LO003','Chennai'),('LO004','Chengalpattu'),('LO005','Dindigul'),('LO006','Coimbatore'),('LO007','Pollachi'),('LO008','Perundurai');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_dc_no`
--

DROP TABLE IF EXISTS `master_dc_no`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_dc_no` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dc_no` varchar(100) NOT NULL,
  `company_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `master_dc_no_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_dc_no`
--

LOCK TABLES `master_dc_no` WRITE;
/*!40000 ALTER TABLE `master_dc_no` DISABLE KEYS */;
INSERT INTO `master_dc_no` VALUES (1,'456','CO002');
/*!40000 ALTER TABLE `master_dc_no` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_acknowledgement`
--

DROP TABLE IF EXISTS `material_acknowledgement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_acknowledgement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_dispatch_id` int NOT NULL,
  `comp_a_qty` int DEFAULT NULL,
  `comp_b_qty` int DEFAULT NULL,
  `comp_c_qty` int DEFAULT NULL,
  `comp_a_remarks` varchar(255) DEFAULT NULL,
  `comp_b_remarks` varchar(255) DEFAULT NULL,
  `comp_c_remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `overall_quantity` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `material_dispatch_id` (`material_dispatch_id`),
  CONSTRAINT `material_acknowledgement_ibfk_1` FOREIGN KEY (`material_dispatch_id`) REFERENCES `material_dispatch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_acknowledgement`
--

LOCK TABLES `material_acknowledgement` WRITE;
/*!40000 ALTER TABLE `material_acknowledgement` DISABLE KEYS */;
INSERT INTO `material_acknowledgement` VALUES (1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-12 05:39:19','2025-09-12 05:39:19',300,'300 litre received');
/*!40000 ALTER TABLE `material_acknowledgement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_assign`
--

DROP TABLE IF EXISTS `material_assign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_assign` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pd_id` varchar(30) NOT NULL,
  `site_id` varchar(30) NOT NULL,
  `item_id` varchar(50) NOT NULL,
  `uom_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `comp_ratio_a` int DEFAULT NULL,
  `comp_ratio_b` int DEFAULT NULL,
  `comp_ratio_c` int DEFAULT NULL,
  `desc_id` int DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pd_id` (`pd_id`),
  KEY `site_id` (`site_id`),
  KEY `item_id` (`item_id`),
  KEY `uom_id` (`uom_id`),
  KEY `fk_material_assign_desc_id` (`desc_id`),
  CONSTRAINT `fk_material_assign_desc_id` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`),
  CONSTRAINT `material_assign_ibfk_1` FOREIGN KEY (`pd_id`) REFERENCES `project_details` (`pd_id`) ON DELETE RESTRICT,
  CONSTRAINT `material_assign_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`) ON DELETE RESTRICT,
  CONSTRAINT `material_assign_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `material_master` (`item_id`) ON DELETE RESTRICT,
  CONSTRAINT `material_assign_ibfk_4` FOREIGN KEY (`uom_id`) REFERENCES `uom_master` (`uom_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_assign`
--

LOCK TABLES `material_assign` WRITE;
/*!40000 ALTER TABLE `material_assign` DISABLE KEYS */;
INSERT INTO `material_assign` VALUES (1,'PD001','ST001','item_104',1,300,'2025-08-29 12:32:06',3,2,1,69,100.00),(2,'PD001','ST001','item_108',1,100,'2025-08-29 12:32:06',3,2,NULL,69,50.00),(3,'PD001','ST001','item_105',1,520,'2025-08-29 12:32:06',2,1,NULL,69,30.00),(4,'PD001','ST001','item_109',1,300,'2025-08-29 12:32:06',3,1,NULL,69,20.00),(6,'PD002','ST002','item_10',2,600,'2025-09-17 09:49:14',3,2,NULL,17,100.00),(7,'PD001','ST001','item_10',2,500,'2025-09-23 09:59:10',NULL,NULL,NULL,69,125.00);
/*!40000 ALTER TABLE `material_assign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_dispatch`
--

DROP TABLE IF EXISTS `material_dispatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_dispatch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_assign_id` int NOT NULL,
  `desc_id` int DEFAULT NULL,
  `dc_no` int NOT NULL,
  `dispatch_date` date NOT NULL,
  `dispatch_qty` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comp_a_qty` int DEFAULT NULL,
  `comp_b_qty` int DEFAULT NULL,
  `comp_c_qty` int DEFAULT NULL,
  `comp_a_remarks` varchar(255) DEFAULT NULL,
  `comp_b_remarks` varchar(255) DEFAULT NULL,
  `comp_c_remarks` varchar(255) DEFAULT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `vendor_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_material_assign_id` (`material_assign_id`),
  KEY `fk_material_dispatch_desc_id` (`desc_id`),
  CONSTRAINT `fk_material_assign_id` FOREIGN KEY (`material_assign_id`) REFERENCES `material_assign` (`id`),
  CONSTRAINT `fk_material_dispatch_desc_id` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_dispatch`
--

LOCK TABLES `material_dispatch` WRITE;
/*!40000 ALTER TABLE `material_dispatch` DISABLE KEYS */;
INSERT INTO `material_dispatch` VALUES (1,1,69,1,'2025-08-30',300.00,'2025-08-29 07:03:13','2025-08-29 07:03:13',150,100,50,'remarks 150','remarks 100','remarks 50','6789098483','998717'),(2,2,69,1,'2025-08-30',100.00,'2025-08-29 07:03:13','2025-08-29 07:03:13',60,40,NULL,'remarks 60','remarks 40',NULL,'6789098483','998717'),(3,3,69,1,'2025-08-30',520.00,'2025-08-29 07:03:13','2025-08-29 07:03:13',347,173,NULL,'remarks 347','remarks 173',NULL,'6789098483','998717'),(4,4,69,1,'2025-08-30',300.00,'2025-08-29 07:03:13','2025-08-29 07:03:13',225,75,NULL,'remarks 225','remarks 75',NULL,'6789098483','998717'),(5,6,17,2,'2025-09-17',300.00,'2025-09-17 04:21:05','2025-09-17 04:21:05',180,120,NULL,'2 pile','3pile',NULL,'NA0000000001','3456'),(6,6,17,3,'2025-09-20',300.00,'2025-09-19 04:17:25','2025-09-19 04:17:25',180,120,NULL,'76','56',NULL,'NA0000000001','3456');
/*!40000 ALTER TABLE `material_dispatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_master`
--

DROP TABLE IF EXISTS `material_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_master` (
  `item_id` varchar(50) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_master`
--

LOCK TABLES `material_master` WRITE;
/*!40000 ALTER TABLE `material_master` DISABLE KEYS */;
INSERT INTO `material_master` VALUES ('item_1','CPS '),('item_10','Sathya Omegakoat 6000 FR Grey'),('item_100','Sathya Fluorocoat 9000'),('item_101','DW CS BC'),('item_102','No.1 sand'),('item_103','DW CS TC Pastel Green '),('item_104','SLF - SG Pastel Green'),('item_105','Sathya SLF - G RAL 7040 Grey'),('item_106','Sathya ZPP Primer Grey'),('item_107','SCPU TCPU DA Grey'),('item_108','NONO KOAT 2000'),('item_109','OMEGAKOAT 6000'),('item_11','Sathya Omegakoat FR PU Grey'),('item_110','Sathya HB PA Pearl Grey'),('item_111','Reflectkoat white'),('item_112','Powder For Light Green'),('item_113','SCPL TCPU Light Green'),('item_12','Sathya Omegakoat EPM 6000'),('item_13','SCPL TCPU RAL 5017'),('item_14','SCPL TCPU RAL 1026 yellow'),('item_15','SCPL TCPU RAL 6037'),('item_16','Sathya Nanokoat 2000'),('item_17','TCPU Clear'),('item_18','TCPU Clear'),('item_19','SCPL TCPU Smoke Grey'),('item_2','CPS PU'),('item_20','DTM UHB 6000 Smoke Grey'),('item_21','DTM 6000 UHB - 3K'),('item_22','SCPL TCPU Golden yellow'),('item_23','DTM 1K PU Maroon'),('item_24','Sathya ROZP Brown'),('item_25','Sathya TCPU UVR 750 Dark Green'),('item_26','Sathya TCPU UVR 750 Smoke Grey'),('item_27','Sathya DTM 600 Grey'),('item_28','Sathya TCPU UVR 750 Golden yellow'),('item_29','Sathya TCPU UVR 750 Sea Green'),('item_3','Sathya Duramort EP'),('item_30','Sathya TCPU UVR 750 Sky Blue'),('item_31','Sathya TCPU PO Red'),('item_32','Sathya TCPU UVR 750 Black'),('item_33','Sathya TCPU UVR 750 Signal Red'),('item_34','Sathya TCPU UVR 750 Canary yellow'),('item_35','Sathya TCPU UVR 750 PO Red'),('item_36','Stickers'),('item_37','Sathya ZPP Primer'),('item_38','Acrylic Primer'),('item_39','Sathya HBE Epoxy Light Green'),('item_4','Solvent'),('item_40','Aliphatic TCPU UVR 500 Dark Green'),('item_41','Fluorokoat 9000 - Comp.B'),('item_42','Sathya Reflectkoat white'),('item_43','All Surface Roller'),('item_44','SCC'),('item_45','DW CS Primer'),('item_46','Sand'),('item_47','DW CS TC Smoke Grey'),('item_48','TCPU RAL 7043 Grey'),('item_49','HBPU Int. Silver Grey'),('item_5','Duracrete PU Pearl Grey'),('item_50','HBPU Ext. Silver Grey'),('item_51','AFC Topcot Crimson'),('item_52','Rainguard PRO - Morning Glory'),('item_53','Sathya Line Marking Golden yellow'),('item_54','SCPL TCPU UVR 500 Golden yellow'),('item_55','Sathya SF ZPP Grey'),('item_56','SCPL TCPU RAL 2003 Orange'),('item_57','SCPL TCPU UVR 500 Black'),('item_58','Sathya DTM 1K PU Dark Grey'),('item_59','Sathya DTM Red'),('item_6','Duracrete PU Pearl Grey'),('item_60','Sathya TCPU DA Grey'),('item_61','H.B.C.1000 White'),('item_62','Sathya DTM 2K PU Light Green'),('item_63','Sathya TCPU UVR 500 Grey'),('item_64','CLEANING SOLVENT'),('item_65','Sathya HBE Epoxy Line Marking Golden yellow'),('item_66','Sathya SF HBE Epoxy Pearl Grey'),('item_67','Sathya SF PU Prime'),('item_68','Sathya HYC PU LIGHT BLUE'),('item_69','Roller'),('item_7','SCPL TCPU Pink'),('item_70','Tray'),('item_71','Putty Blade 4'),('item_72','Sheet'),('item_73','Interior Royale Roller'),('item_74','Sathya HYC PU Beige'),('item_75','9\" Roller'),('item_76','2\" Brush'),('item_77','Empty Plastic pail'),('item_78','Sathya HB PU RAL 7002 Olive Grey'),('item_79','Sathya SLS Screed'),('item_8','SCPL TCPU Blue RAL 5015'),('item_80','Sathya HB PU RAL 7031 Grey'),('item_81','Sathya HB PU RAL 7035 Grey'),('item_82','SCPL TCPU Red'),('item_83','SCPL TCPU Sky Blue'),('item_84','Sathya SLF - SG Pearl Grey'),('item_85','Sathya SLF - SG Pearl Grey'),('item_86','Sathya SLF - G Pearl Grey'),('item_87','Sathya SLF PU 2K P.Green'),('item_88','Sathya SLF PU 2K French Blue'),('item_89','ESDEE Coat PU Paint'),('item_9','Sathya Omegakoat 6000 Grey'),('item_90','Vertical Fall Arrest Equipment'),('item_91','SCPL ZPP Grey'),('item_92','Durakoat TCPU Oxford Blue'),('item_93','SCPL TCPU Ivory'),('item_94','Durakoat TCPU Opaline Green'),('item_95','GREENSOL 9000'),('item_96','CRE FR - Nile Blue'),('item_97','Sathya Technobond FR EP Grey'),('item_98','Sathya Technobond FR PU'),('item_99','SCPL TCPU Silver Grey');
/*!40000 ALTER TABLE `material_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_usage`
--

DROP TABLE IF EXISTS `material_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_ack_id` int DEFAULT NULL,
  `comp_a_qty` int DEFAULT NULL,
  `comp_b_qty` int DEFAULT NULL,
  `comp_c_qty` int DEFAULT NULL,
  `comp_a_remarks` varchar(255) DEFAULT NULL,
  `comp_b_remarks` varchar(255) DEFAULT NULL,
  `comp_c_remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `overall_qty` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `material_ack_id` (`material_ack_id`),
  CONSTRAINT `material_usage_ibfk_1` FOREIGN KEY (`material_ack_id`) REFERENCES `material_acknowledgement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_usage`
--

LOCK TABLES `material_usage` WRITE;
/*!40000 ALTER TABLE `material_usage` DISABLE KEYS */;
INSERT INTO `material_usage` VALUES (1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-12 05:55:41','2025-09-12 05:55:41',260,'260 received');
/*!40000 ALTER TABLE `material_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_usage_history`
--

DROP TABLE IF EXISTS `material_usage_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_usage_history` (
  `entry_id` bigint NOT NULL AUTO_INCREMENT,
  `material_ack_id` int NOT NULL,
  `entry_date` date NOT NULL,
  `comp_a_qty` int DEFAULT NULL,
  `comp_b_qty` int DEFAULT NULL,
  `comp_c_qty` int DEFAULT NULL,
  `comp_a_remarks` varchar(255) DEFAULT NULL,
  `comp_b_remarks` varchar(255) DEFAULT NULL,
  `comp_c_remarks` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `overall_qty` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `material_ack_id` (`material_ack_id`),
  CONSTRAINT `material_usage_history_ibfk_1` FOREIGN KEY (`material_ack_id`) REFERENCES `material_acknowledgement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_usage_history`
--

LOCK TABLES `material_usage_history` WRITE;
/*!40000 ALTER TABLE `material_usage_history` DISABLE KEYS */;
INSERT INTO `material_usage_history` VALUES (1,3,'2025-09-01',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:05:03',20,'20 litres used'),(2,3,'2025-09-02',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:05:18',10,'10 litres used'),(3,4,'2025-09-02',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:05:55',20,'20 litres used'),(4,3,'2025-09-03',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:06:13',10,'10 litres used'),(5,4,'2025-09-03',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:06:23',10,'10 litres used'),(6,3,'2025-09-04',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-01 11:08:46',30,'30 completed'),(7,1,'2025-09-12',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-09-12 11:25:41',260,'260 received');
/*!40000 ALTER TABLE `material_usage_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `overhead`
--

DROP TABLE IF EXISTS `overhead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `overhead` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_name` varchar(100) NOT NULL,
  `is_default` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `overhead`
--

LOCK TABLES `overhead` WRITE;
/*!40000 ALTER TABLE `overhead` DISABLE KEYS */;
INSERT INTO `overhead` VALUES (1,'materials',1),(2,'labours',1),(3,'consumables',0),(4,'rent',0),(5,'Accomadation',0);
/*!40000 ALTER TABLE `overhead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `petty_cash`
--

DROP TABLE IF EXISTS `petty_cash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `petty_cash` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pd_id` varchar(30) NOT NULL,
  `site_id` varchar(30) NOT NULL,
  `assign_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `previous_remaining_amount` decimal(10,2) DEFAULT NULL,
  `desc_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pd_id` (`pd_id`),
  KEY `site_id` (`site_id`),
  KEY `fk_petty_cash_work_descriptions` (`desc_id`),
  CONSTRAINT `fk_petty_cash_work_descriptions` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `petty_cash_ibfk_1` FOREIGN KEY (`pd_id`) REFERENCES `project_details` (`pd_id`),
  CONSTRAINT `petty_cash_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petty_cash`
--

LOCK TABLES `petty_cash` WRITE;
/*!40000 ALTER TABLE `petty_cash` DISABLE KEYS */;
INSERT INTO `petty_cash` VALUES (1,'PD001','ST001','2025-05-28',1500.00,'2025-08-25 07:05:16',NULL,NULL,69),(2,'PD001','ST001','2025-06-04',3140.00,'2025-08-25 07:06:11',NULL,NULL,69),(3,'PD001','ST001','2025-06-16',1500.00,'2025-08-25 07:06:46',NULL,NULL,69),(4,'PD001','ST001','2025-09-11',250.00,'2025-09-12 03:54:38',NULL,NULL,69);
/*!40000 ALTER TABLE `petty_cash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline`
--

DROP TABLE IF EXISTS `pipeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `primer` decimal(10,2) DEFAULT NULL,
  `primer_rate` decimal(10,2) DEFAULT NULL,
  `primer_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  `top_coat` decimal(10,2) DEFAULT NULL,
  `top_coat_rate` decimal(10,2) DEFAULT NULL,
  `top_coat_value` decimal(10,2) DEFAULT NULL,
  `arrow` decimal(10,2) DEFAULT NULL,
  `arrow_rate` decimal(10,2) DEFAULT NULL,
  `arrow_value` decimal(10,2) DEFAULT NULL,
  `cleaning` decimal(10,2) DEFAULT NULL,
  `cleaning_rate` decimal(10,2) DEFAULT NULL,
  `cleaning_value` decimal(10,2) DEFAULT NULL,
  `pasting` decimal(10,2) DEFAULT NULL,
  `pasting_rate` decimal(10,2) DEFAULT NULL,
  `pasting_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `pipeline_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `pipeline_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline`
--

LOCK TABLES `pipeline` WRITE;
/*!40000 ALTER TABLE `pipeline` DISABLE KEYS */;
/*!40000 ALTER TABLE `pipeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `po_budget`
--

DROP TABLE IF EXISTS `po_budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `po_budget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_id` varchar(50) NOT NULL,
  `desc_id` int NOT NULL,
  `total_po_value` decimal(15,2) NOT NULL,
  `total_budget_value` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_site_desc` (`site_id`,`desc_id`),
  KEY `desc_id` (`desc_id`),
  CONSTRAINT `po_budget_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`),
  CONSTRAINT `po_budget_ibfk_2` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_budget`
--

LOCK TABLES `po_budget` WRITE;
/*!40000 ALTER TABLE `po_budget` DISABLE KEYS */;
INSERT INTO `po_budget` VALUES (1,'ST001',69,919215.00,597489.75,'2025-09-09 09:26:24','2025-09-09 09:26:24'),(2,'ST002',53,55900.00,36335.00,'2025-09-10 04:38:19','2025-09-10 04:38:19');
/*!40000 ALTER TABLE `po_budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `po_reckoner`
--

DROP TABLE IF EXISTS `po_reckoner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `po_reckoner` (
  `rec_id` int NOT NULL AUTO_INCREMENT,
  `category_id` varchar(30) DEFAULT NULL,
  `subcategory_id` varchar(30) DEFAULT NULL,
  `po_quantity` int DEFAULT NULL,
  `uom` varchar(10) DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `value` float DEFAULT NULL,
  `site_id` varchar(30) DEFAULT NULL,
  `desc_id` varchar(10) DEFAULT NULL,
  `item_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rec_id`),
  KEY `fk_category` (`category_id`),
  KEY `fk_subcategory` (`subcategory_id`),
  KEY `fk_po_reckoner_site` (`site_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `item_category` (`category_id`),
  CONSTRAINT `fk_po_reckoner_site` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `item_subcategory` (`subcategory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_reckoner`
--

LOCK TABLES `po_reckoner` WRITE;
/*!40000 ALTER TABLE `po_reckoner` DISABLE KEYS */;
INSERT INTO `po_reckoner` VALUES (1,'CA105','SC101',1857,'sqm',120,222840,'ST001','69','10','2025-08-25 10:59:50'),(2,'CA105','SC102',1857,'sqm',140,259980,'ST001','69','10','2025-08-25 10:59:50'),(3,'CA105','SC103',1857,'sqm',100,185700,'ST001','69','10','2025-08-25 10:59:50'),(4,'CA105','SC105',1857,'sqm',135,250695,'ST001','69','10','2025-08-25 10:59:50'),(7,'CA102','SC101',130,'sqm',215,27950,'ST002','53','10','2025-09-10 10:04:19'),(8,'CA102','SC101',220,'sqm',100,22000,'ST002','17','15','2025-09-10 10:04:19'),(9,'CA102','SC102',130,'sqm',215,27950,'ST002','53','10','2025-09-10 10:04:19'),(10,'CA102','SC102',220,'sqm',100,22000,'ST002','17','15','2025-09-10 10:04:19');
/*!40000 ALTER TABLE `po_reckoner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_details`
--

DROP TABLE IF EXISTS `project_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_details` (
  `pd_id` varchar(30) NOT NULL,
  `company_id` varchar(30) DEFAULT NULL,
  `project_type_id` varchar(30) DEFAULT NULL,
  `project_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pd_id`),
  KEY `fk_company_details` (`company_id`),
  KEY `fk_project_type` (`project_type_id`),
  CONSTRAINT `fk_company_details` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  CONSTRAINT `fk_project_type` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_details`
--

LOCK TABLES `project_details` WRITE;
/*!40000 ALTER TABLE `project_details` DISABLE KEYS */;
INSERT INTO `project_details` VALUES ('PD001','CO001','PT001','Jay Jay Mills (Perundurai)'),('PD002','CO002','PT001','kgcas'),('PD003','CO003','PT001','Test Cost Center'),('PD004','CO002','PT001','KITE'),('PD005','CO005','PT001','Test Costcenter 05');
/*!40000 ALTER TABLE `project_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_type`
--

DROP TABLE IF EXISTS `project_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_type` (
  `type_id` varchar(30) NOT NULL,
  `type_description` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_type`
--

LOCK TABLES `project_type` WRITE;
/*!40000 ALTER TABLE `project_type` DISABLE KEYS */;
INSERT INTO `project_type` VALUES ('PT001','service'),('PT002','supply');
/*!40000 ALTER TABLE `project_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider_master`
--

DROP TABLE IF EXISTS `provider_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `transport_type_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transport_type_id` (`transport_type_id`),
  CONSTRAINT `provider_master_ibfk_1` FOREIGN KEY (`transport_type_id`) REFERENCES `transport_type` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider_master`
--

LOCK TABLES `provider_master` WRITE;
/*!40000 ALTER TABLE `provider_master` DISABLE KEYS */;
INSERT INTO `provider_master` VALUES (1,'ABC parcel service','chennai','94839483',2),(2,'karthi','chennai','94838283',1),(3,'sankar',NULL,NULL,1),(5,'guna','gandhhipuram','9958475945',4),(6,'guru','example address','9483847384',1),(7,'xyz parcel service limited','example address','9484838483',2),(8,'lmw parcel service','PN palayam','9859493943',2),(9,'No.1 Transport','gandhi nagar','8474839929',1),(10,'arun',NULL,NULL,1);
/*!40000 ALTER TABLE `provider_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reckoner_types`
--

DROP TABLE IF EXISTS `reckoner_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reckoner_types` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reckoner_types`
--

LOCK TABLES `reckoner_types` WRITE;
/*!40000 ALTER TABLE `reckoner_types` DISABLE KEYS */;
INSERT INTO `reckoner_types` VALUES (1,'Sample'),(2,'Approved'),(3,'Not Approved');
/*!40000 ALTER TABLE `reckoner_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_master`
--

DROP TABLE IF EXISTS `report_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_master` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `site_id` varchar(30) NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `site_id` (`site_id`),
  CONSTRAINT `report_master_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_master`
--

LOCK TABLES `report_master` WRITE;
/*!40000 ALTER TABLE `report_master` DISABLE KEYS */;
INSERT INTO `report_master` VALUES (1,'2025-09-05','ST002'),(2,'2025-09-06','ST002'),(3,'2025-09-07','ST002'),(4,'2025-09-08','ST002'),(5,'2025-09-09','ST002'),(6,'2025-09-10','ST002'),(7,'2025-09-11','ST002');
/*!40000 ALTER TABLE `report_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_type`
--

DROP TABLE IF EXISTS `report_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_type`
--

LOCK TABLES `report_type` WRITE;
/*!40000 ALTER TABLE `report_type` DISABLE KEYS */;
INSERT INTO `report_type` VALUES (1,'SPR'),(2,'MDR'),(3,'MUR');
/*!40000 ALTER TABLE `report_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superadmin'),(2,'admin'),(3,'site incharge'),(4,'accounts_team');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_details`
--

DROP TABLE IF EXISTS `site_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_details` (
  `site_id` varchar(30) NOT NULL,
  `site_name` varchar(100) DEFAULT NULL,
  `po_number` varchar(70) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `incharge_id` varchar(30) DEFAULT NULL,
  `workforce_id` varchar(30) DEFAULT NULL,
  `pd_id` varchar(30) NOT NULL,
  `location_id` varchar(10) DEFAULT NULL,
  `reckoner_type_id` int DEFAULT NULL,
  PRIMARY KEY (`site_id`),
  KEY `fk_incharge_type` (`incharge_id`),
  KEY `fk_workforce_type` (`workforce_id`),
  KEY `fk_pd_id` (`pd_id`),
  KEY `fk_site_details_location` (`location_id`),
  KEY `fk_reckoner_type_id` (`reckoner_type_id`),
  CONSTRAINT `fk_incharge_type` FOREIGN KEY (`incharge_id`) REFERENCES `site_incharge` (`incharge_id`),
  CONSTRAINT `fk_pd_id` FOREIGN KEY (`pd_id`) REFERENCES `project_details` (`pd_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reckoner_type_id` FOREIGN KEY (`reckoner_type_id`) REFERENCES `reckoner_types` (`type_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_site_details_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`),
  CONSTRAINT `fk_workforce_type` FOREIGN KEY (`workforce_id`) REFERENCES `workforce_type` (`workforce_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_details`
--

LOCK TABLES `site_details` WRITE;
/*!40000 ALTER TABLE `site_details` DISABLE KEYS */;
INSERT INTO `site_details` VALUES ('ST001','Perundurai ','6789098483','2025-05-28',NULL,'SI002',NULL,'PD001','LO008',2),('ST002','ground','NA0000000001','2025-09-04','2025-09-10','SI002',NULL,'PD002','LO003',3),('ST003','New','9876540321','2025-09-01',NULL,'SI001',NULL,'PD003','LO006',2),('ST004','AI&DS Block','4563210897','2025-09-20','2025-09-30','SI002',NULL,'PD004','LO006',2),('ST005','Site Test 05','123243254371','2025-09-17','2025-09-27','SI001',NULL,'PD005','LO003',2);
/*!40000 ALTER TABLE `site_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_incharge`
--

DROP TABLE IF EXISTS `site_incharge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_incharge` (
  `incharge_id` varchar(30) NOT NULL,
  `incharge_type` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`incharge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_incharge`
--

LOCK TABLES `site_incharge` WRITE;
/*!40000 ALTER TABLE `site_incharge` DISABLE KEYS */;
INSERT INTO `site_incharge` VALUES ('SI001','Site Engineer'),('SI002','Supervisor');
/*!40000 ALTER TABLE `site_incharge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siteincharge_assign`
--

DROP TABLE IF EXISTS `siteincharge_assign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siteincharge_assign` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pd_id` varchar(30) NOT NULL,
  `site_id` varchar(30) NOT NULL,
  `desc_id` int DEFAULT NULL,
  `emp_id` varchar(30) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pd_id` (`pd_id`),
  KEY `site_id` (`site_id`),
  KEY `emp_id` (`emp_id`),
  KEY `fk_siteincharge_desc_id` (`desc_id`),
  CONSTRAINT `fk_siteincharge_desc_id` FOREIGN KEY (`desc_id`) REFERENCES `work_descriptions` (`desc_id`),
  CONSTRAINT `siteincharge_assign_ibfk_1` FOREIGN KEY (`pd_id`) REFERENCES `project_details` (`pd_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `siteincharge_assign_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `site_details` (`site_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `siteincharge_assign_ibfk_3` FOREIGN KEY (`emp_id`) REFERENCES `employee_master` (`emp_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siteincharge_assign`
--

LOCK TABLES `siteincharge_assign` WRITE;
/*!40000 ALTER TABLE `siteincharge_assign` DISABLE KEYS */;
INSERT INTO `siteincharge_assign` VALUES (1,'PD001','ST001',NULL,'EMP003','2025-05-28','2025-08-31'),(2,'PD002','ST002',NULL,'EMP006','2025-09-05','2025-09-11'),(3,'PD001','ST001',69,'EMP004','2025-09-08','2025-09-08'),(4,'PD001','ST001',69,'EMP006','2025-09-08','2025-09-08'),(5,'PD003','ST003',NULL,'EMP005','2025-09-01','2025-09-30'),(6,'PD001','ST001',69,'EMP004','2025-09-16','2025-09-19'),(7,'PD004','ST004',NULL,'emp0043','2025-09-20','2025-09-30'),(8,'PD005','ST005',NULL,'EMP005','2025-09-17','2025-09-27');
/*!40000 ALTER TABLE `siteincharge_assign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siteincharge_exp_entry`
--

DROP TABLE IF EXISTS `siteincharge_exp_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siteincharge_exp_entry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `petty_cash_id` int NOT NULL,
  `expense_category_id` int DEFAULT NULL,
  `expense_detail_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `amount_created_at` timestamp NULL DEFAULT NULL,
  `expense_details` varchar(300) DEFAULT NULL,
  `overhead_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `petty_cash_id` (`petty_cash_id`),
  KEY `expense_category_id` (`expense_category_id`),
  KEY `expense_detail_id` (`expense_detail_id`),
  KEY `overhead_id` (`overhead_id`),
  CONSTRAINT `siteincharge_exp_entry_ibfk_1` FOREIGN KEY (`petty_cash_id`) REFERENCES `petty_cash` (`id`),
  CONSTRAINT `siteincharge_exp_entry_ibfk_2` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_category` (`id`),
  CONSTRAINT `siteincharge_exp_entry_ibfk_3` FOREIGN KEY (`expense_detail_id`) REFERENCES `expense_details` (`id`),
  CONSTRAINT `siteincharge_exp_entry_ibfk_4` FOREIGN KEY (`overhead_id`) REFERENCES `overhead` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siteincharge_exp_entry`
--

LOCK TABLES `siteincharge_exp_entry` WRITE;
/*!40000 ALTER TABLE `siteincharge_exp_entry` DISABLE KEYS */;
INSERT INTO `siteincharge_exp_entry` VALUES (1,1,7,47,580.00,'2025-05-28 07:18:50',NULL,NULL),(2,1,4,32,200.00,'2025-05-31 07:24:58',NULL,NULL),(3,2,4,13,500.00,'2025-06-04 07:31:46',NULL,NULL),(4,2,3,24,2640.00,'2025-06-04 07:32:19',NULL,NULL),(5,1,4,32,200.00,'2025-06-25 07:33:11',NULL,NULL),(6,1,4,32,200.00,'2025-06-13 07:33:37',NULL,NULL),(7,3,NULL,NULL,100.00,'2025-09-08 12:18:17','remarks example',1),(8,4,NULL,NULL,100.00,'2025-09-12 06:15:46','travel charge',5);
/*!40000 ALTER TABLE `siteincharge_exp_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (1,'Tamil Nadu'),(2,'Tamil Nādu');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stickering`
--

DROP TABLE IF EXISTS `stickering`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stickering` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `pasting` decimal(10,2) DEFAULT NULL,
  `pasting_rate` decimal(10,2) DEFAULT NULL,
  `pasting_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  `font_sticker` decimal(10,2) DEFAULT NULL,
  `font_sticker_rate` decimal(10,2) DEFAULT NULL,
  `font_sticker_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `stickering_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `stickering_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stickering`
--

LOCK TABLES `stickering` WRITE;
/*!40000 ALTER TABLE `stickering` DISABLE KEYS */;
/*!40000 ALTER TABLE `stickering` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structural_painting`
--

DROP TABLE IF EXISTS `structural_painting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structural_painting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `report_type_id` int NOT NULL,
  `primer` decimal(10,2) DEFAULT NULL,
  `primer_rate` decimal(10,2) DEFAULT NULL,
  `primer_value` decimal(10,2) DEFAULT NULL,
  `total_rate` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(10,2) DEFAULT NULL,
  `top_coat` decimal(10,2) DEFAULT NULL,
  `top_coat_rate` decimal(10,2) DEFAULT NULL,
  `top_coat_value` decimal(10,2) DEFAULT NULL,
  `cleaning` decimal(10,2) DEFAULT NULL,
  `cleaning_rate` decimal(10,2) DEFAULT NULL,
  `cleaning_value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_report_type` (`report_id`,`report_type_id`),
  KEY `report_type_id` (`report_type_id`),
  CONSTRAINT `structural_painting_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `report_master` (`report_id`) ON DELETE CASCADE,
  CONSTRAINT `structural_painting_ibfk_2` FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structural_painting`
--

LOCK TABLES `structural_painting` WRITE;
/*!40000 ALTER TABLE `structural_painting` DISABLE KEYS */;
INSERT INTO `structural_painting` VALUES (1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,4,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,4,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,4,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,5,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,5,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,5,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,6,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,6,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,6,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,7,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,7,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,7,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `structural_painting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_material_assign`
--

DROP TABLE IF EXISTS `supply_material_assign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supply_material_assign` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pd_id` varchar(30) NOT NULL,
  `site_id` varchar(30) NOT NULL,
  `item_id` varchar(50) NOT NULL,
  `uom_id` int NOT NULL,
  `quantity` int NOT NULL,
  `production_cost_per_uom` decimal(10,2) NOT NULL,
  `production_cost` decimal(10,2) NOT NULL,
  `supply_cost_per_uom` decimal(10,2) NOT NULL,
  `supply_cost` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_material_assign`
--

LOCK TABLES `supply_material_assign` WRITE;
/*!40000 ALTER TABLE `supply_material_assign` DISABLE KEYS */;
/*!40000 ALTER TABLE `supply_material_assign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_master`
--

DROP TABLE IF EXISTS `transport_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  `booking_expense` decimal(10,2) DEFAULT NULL,
  `travel_expense` decimal(10,2) DEFAULT NULL,
  `dispatch_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `driver_id` (`driver_id`),
  KEY `dispatch_id` (`dispatch_id`),
  CONSTRAINT `transport_master_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `provider_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transport_master_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transport_master_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `driver_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transport_master_ibfk_4` FOREIGN KEY (`dispatch_id`) REFERENCES `material_dispatch` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_master`
--

LOCK TABLES `transport_master` WRITE;
/*!40000 ALTER TABLE `transport_master` DISABLE KEYS */;
INSERT INTO `transport_master` VALUES (1,2,'coimbatore',4,1,NULL,5000.00,37,'2025-08-23 10:50:12'),(2,2,'coimbatore',4,1,NULL,5000.00,38,'2025-08-23 10:50:12'),(3,2,'coimbatore',4,1,NULL,5000.00,39,'2025-08-23 10:50:12'),(4,2,'coimbatore',4,1,NULL,5000.00,40,'2025-08-23 10:50:12'),(5,2,'coimbatore',4,1,NULL,5000.00,41,'2025-08-23 10:50:12'),(6,2,'coimbatore',4,1,NULL,5000.00,42,'2025-08-23 10:50:12'),(7,2,'coimbatore',4,1,NULL,5000.00,43,'2025-08-23 10:50:12'),(8,2,'coimbatore',4,1,NULL,5000.00,44,'2025-08-23 10:50:12'),(9,2,'coimbatore',4,1,NULL,5000.00,45,'2025-08-23 10:50:12'),(10,2,'coimbatore',4,1,NULL,5000.00,46,'2025-08-23 10:50:12'),(11,2,'coimbatore',4,1,NULL,5000.00,47,'2025-08-23 10:50:12'),(12,2,'coimbatore',4,1,NULL,5000.00,48,'2025-08-23 10:50:12'),(13,3,'chennai',3,3,NULL,5000.00,49,'2025-08-23 10:52:49'),(14,3,'chennai',3,3,NULL,5000.00,50,'2025-08-23 10:52:49'),(15,3,'chennai',3,3,NULL,5000.00,51,'2025-08-23 10:52:49'),(16,3,'chennai',3,3,NULL,5000.00,52,'2025-08-23 10:52:49'),(17,3,'chennai',3,3,NULL,5000.00,53,'2025-08-23 10:52:49'),(18,3,'chennai',3,3,NULL,5000.00,54,'2025-08-23 10:52:49'),(19,3,'chennai',3,3,NULL,5000.00,55,'2025-08-23 10:52:49'),(20,3,'chennai',3,3,NULL,5000.00,56,'2025-08-23 10:52:49'),(21,9,'perundurai',3,3,NULL,20000.00,1,'2025-08-25 11:41:47'),(22,9,'perundurai',3,3,NULL,20000.00,2,'2025-08-25 11:41:47'),(23,9,'perundurai',3,3,NULL,20000.00,3,'2025-08-25 11:41:47'),(24,9,'perundurai',3,3,NULL,20000.00,4,'2025-08-25 11:41:47'),(25,9,'perundurai',3,3,NULL,20000.00,5,'2025-08-25 11:41:47'),(26,9,'perundurai',3,3,NULL,20000.00,6,'2025-08-25 11:41:47'),(27,9,'perundurai',3,3,NULL,20000.00,7,'2025-08-25 11:41:47'),(28,9,'perundurai',3,3,NULL,20000.00,8,'2025-08-25 11:41:47'),(29,9,'perundurai',3,3,NULL,20000.00,9,'2025-08-25 11:41:47'),(30,2,'coimbatore',3,1,NULL,10000.00,1,'2025-08-29 10:32:58'),(31,2,'coimbatore',1,1,NULL,5000.00,1,'2025-08-29 12:33:13'),(32,2,'coimbatore',1,1,NULL,5000.00,2,'2025-08-29 12:33:13'),(33,2,'coimbatore',1,1,NULL,5000.00,3,'2025-08-29 12:33:13'),(34,2,'coimbatore',1,1,NULL,5000.00,4,'2025-08-29 12:33:13'),(35,10,'kumar',3,1,NULL,90000.00,5,'2025-09-17 09:51:05'),(36,3,'Salem',1,1,NULL,50000.00,6,'2025-09-19 09:47:25');
/*!40000 ALTER TABLE `transport_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_type`
--

DROP TABLE IF EXISTS `transport_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_type`
--

LOCK TABLES `transport_type` WRITE;
/*!40000 ALTER TABLE `transport_type` DISABLE KEYS */;
INSERT INTO `transport_type` VALUES (1,'Freight Paid'),(2,'Freight to Pay');
/*!40000 ALTER TABLE `transport_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uom_master`
--

DROP TABLE IF EXISTS `uom_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uom_master` (
  `uom_id` int NOT NULL AUTO_INCREMENT,
  `uom_name` varchar(10) NOT NULL,
  PRIMARY KEY (`uom_id`),
  UNIQUE KEY `uom_name` (`uom_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uom_master`
--

LOCK TABLES `uom_master` WRITE;
/*!40000 ALTER TABLE `uom_master` DISABLE KEYS */;
INSERT INTO `uom_master` VALUES (4,'GMS'),(2,'KGS'),(1,'LIT'),(3,'ML'),(5,'NOS'),(6,'SET');
/*!40000 ALTER TABLE `uom_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'superadmin','superadmin@gmail.com','12345678',1,'2025-07-18 04:46:28'),(2,'admin','admin@gmail.com','12345678',2,'2025-07-18 04:46:28'),(3,'siteincharge','siteincharge@gmail.com','12345678',3,'2025-07-18 04:46:28'),(4,'accountant','accountant@gmail.com','12345678',4,'2025-07-18 04:46:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_master`
--

DROP TABLE IF EXISTS `vehicle_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_name` varchar(255) DEFAULT NULL,
  `vehicle_model` varchar(255) DEFAULT NULL,
  `vehicle_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_master`
--

LOCK TABLES `vehicle_master` WRITE;
/*!40000 ALTER TABLE `vehicle_master` DISABLE KEYS */;
INSERT INTO `vehicle_master` VALUES (1,'tempo','2s1','Tn-39-2394'),(3,'mini truck','se145','TN -483 -39394'),(4,'auto','new model','tn04923'),(5,'honda','s21','tn-388283'),(6,'car','car','tn-04 -4343');
/*!40000 ALTER TABLE `vehicle_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_descriptions`
--

DROP TABLE IF EXISTS `work_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_descriptions` (
  `desc_id` int NOT NULL AUTO_INCREMENT,
  `desc_name` varchar(100) NOT NULL,
  PRIMARY KEY (`desc_id`),
  UNIQUE KEY `desc_name` (`desc_name`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_descriptions`
--

LOCK TABLES `work_descriptions` WRITE;
/*!40000 ALTER TABLE `work_descriptions` DISABLE KEYS */;
INSERT INTO `work_descriptions` VALUES (47,'1.5\" line arrow supply and pasting'),(57,'1.5\" line font stickering work'),(46,'1\" line arrow supply and pasting'),(55,'1\" line font stickering work'),(53,'10\" line arrow supply and pasting'),(63,'10\" line font stickering work'),(54,'12\" line arrow supply and pasting'),(64,'12\" line font stickering work'),(48,'2\" line arrow supply and pasting'),(58,'2\" line font stickering work'),(49,'3\" line arrow supply and pasting'),(59,'3\" line font stickering work'),(50,'4\" line arrow supply and pasting'),(60,'4\" line font stickering work'),(51,'6\" line arrow supply and pasting'),(61,'6\" line font stickering work'),(52,'8\" line arrow supply and pasting'),(62,'8\" line font stickering work'),(11,'Air line 1 coat blue'),(33,'Chilled brine band supply and pasting'),(19,'Chilled brine line painting'),(32,'Chilled water band supply and pasting'),(18,'Chilled water line painting'),(31,'Cooling water band supply and pasting'),(13,'Cooling water line 1 coat dark green'),(17,'Cooling water line painting'),(68,'dummy description'),(38,'Eye wash shower band supply and pasting'),(24,'Eye wash shower line'),(44,'HSD band supply and pasting'),(30,'HSD line painting work'),(40,'Instrument air band supply and pasting'),(26,'Instrument air line'),(42,'LP Steam band supply and pasting'),(28,'LP Steam line painting work'),(43,'MP Steam band supply and pasting'),(29,'MP Steam line painting'),(5,'Nitrogen 2 coat redoxide + Canary Yellow'),(35,'Nitrogen band supply and pasting'),(20,'Nitrogen line painting'),(9,'Plant Air 2 coat redoxide + sky blue'),(41,'Plant air band supply and pasting'),(27,'Plant air line painting'),(16,'Primer coating with supply'),(36,'Process water band supply and pasting'),(21,'Process water line painting work'),(37,'PSV band supply and pasting'),(22,'PSV line painting'),(7,'PSV quench 2 coat redoxide + black'),(6,'Raw water 2 coat redoxide + sea green'),(39,'Raw water band supply and pasting'),(25,'Raw water line'),(14,'Raw water line 1 coat sea green'),(12,'Sticker for cooling water return'),(1,'Sticker for cooling water supply'),(34,'Sticker for Eye wash'),(45,'Sticker for High speed diesel'),(3,'Sticker for Holding Tank'),(66,'Sticker for LEV Scrubber'),(2,'Sticker for Non Peso Tank'),(67,'Sticker for Peso Tank'),(23,'Sticker for process water'),(65,'Sticker for scrubber'),(56,'Sticker for Vacuum'),(15,'Structural line painting'),(10,'Structural paint incl cleaner 2 coat paint'),(4,'Structural Painting Work'),(69,'Surface Cleaning + RC + SFZPP + UVR 750DFT'),(8,'Vacuum White');
/*!40000 ALTER TABLE `work_descriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workforce_type`
--

DROP TABLE IF EXISTS `workforce_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workforce_type` (
  `workforce_id` varchar(30) NOT NULL,
  `workforce_type` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`workforce_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workforce_type`
--

LOCK TABLES `workforce_type` WRITE;
/*!40000 ALTER TABLE `workforce_type` DISABLE KEYS */;
INSERT INTO `workforce_type` VALUES ('WF001','contract'),('WF002','labour'),('WF003','contract + labour');
/*!40000 ALTER TABLE `workforce_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-23 13:59:57
