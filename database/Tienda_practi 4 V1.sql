DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `id_inventory` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_inventory` (`id_inventory`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`id_inventory`) REFERENCES `inventory` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `category` WRITE;
INSERT INTO `category` VALUES (1,'Poker',1),(2,'Whiskeys',1),(3,'Productos del mar',2),(4,'Bebidas',2),(5,'Aseo',2),(6,'Granos',2),(7,'TestCategory',3),(8,'DespensaTest Category',3),(9,'DespensaTest Category',3),(10,'DespensaTest Category',3),(11,'DespensaTest Category',3),(12,'Aguardiente',1),(13,'te',1),(14,'CategorÃ­a',1),(15,'b',1),(16,'x',4),(17,'Category',4),(19,'Category - 1',4),(20,'Category - 1',4);
UNLOCK TABLES;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `id_store` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_store` (`id_store`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`id_store`) REFERENCES `store` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;


LOCK TABLES `client` WRITE;
INSERT INTO `client` VALUES (1,'Yulian','Vargas',31156625,4),(2,'Rulos','Mosquera',321999777,5),(3,'Amaranto','Mena',32157997,5),(4,'jacinto','Lopera',3220489,5),(5,'jacinto','Lopera',3220489,4),(6,'Lucio','Dias',32324423,4),(7,'Client','Test',0,6);
UNLOCK TABLES;


DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_store` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_store` (`id_store`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`id_store`) REFERENCES `store` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` VALUES (1,4),(2,5),(3,6),(4,7),(5,8);
UNLOCK TABLES;


DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_cost` double DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `id_category` int DEFAULT NULL,
  `id_supplier` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_category` (`id_category`),
  KEY `id_supplier` (`id_supplier`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4;


LOCK TABLES `product` WRITE;
INSERT INTO `product` VALUES (38,'7709583296529',NULL,'2021-10-31','Product Test',1000,5500,9800,7,3,960),(39,'7702909313667',NULL,'2021-11-01','chambersito',1100,5500,9800,2,1,1100),(40,'7708425576205','https://online-store-s3.s3.us-east-2.amazonaws.com/dfc949bf12a78fa2c80eb5081ab99959.jpg','2021-10-28','Chirrinchi',90,1000,3000,2,1,-1778),(41,'7708789539985','https://online-store-s3.s3.us-east-2.amazonaws.com/f3de694ad00f839f4fa7e011de4ef95b.jpg','2021-10-27','Aguardiente Cristal',400,2000,8000,12,1,0),(42,'7705797917023','https://online-store-s3.s3.us-east-2.amazonaws.com/297975c04ae259666d42da8b1288d39f.jpg','2022-06-28','Bacardi',100,15000,35600,4,2,100),(43,'7702575636586','https://online-store-s3.s3.us-east-2.amazonaws.com/ce76bec2f11ea965b2574124f10b28be.jpg','2022-05-25','Lentejas Aburra',3000,500,950,6,2,3000),(44,'7702922536825','https://online-store-s3.s3.us-east-2.amazonaws.com/8652881f0b5faa9ec29d4fed3e0f4b48.jpg',NULL,'Product Test',1,1000,2500,NULL,5,1),(45,'7704761128313','https://online-store-s3.s3.us-east-2.amazonaws.com/e5576ae5707841c7cc183498e739222d.jpg',NULL,'Product Test',1,1000,2500,17,5,1),(46,'7708184472781','https://online-store-s3.s3.us-east-2.amazonaws.com/911a8efef3af9a6db3a9169986ddb4cc.jpg','2021-11-15','Yack Daniels',100000,25000,75000,2,1,99999),(47,'7708991680841','https://online-store-s3.s3.us-east-2.amazonaws.com/abe1d9c56c0cdf3152faca212addd02f.jpg','2021-11-26','Fuze Tea',10000,1000,3000,13,1,10000),(48,'7709694361342','https://online-store-s3.s3.us-east-2.amazonaws.com/3ffc619cd17771923634c86a45ccf8e2.jpg','2021-11-24','Sun Tea',10000,300,800,13,1,9988);
UNLOCK TABLES;

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
LOCK TABLES `role` WRITE;
INSERT INTO `role` VALUES (1,'admin'),(2,'seller'),(3,'support');
UNLOCK TABLES;

DROP TABLE IF EXISTS `sale`;
CREATE TABLE `sale` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_sale` date DEFAULT NULL,
  `id_client` int NOT NULL,
  `id_store` int NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `total_sale` double DEFAULT NULL,
  `total_debt` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_client` (`id_client`),
  KEY `id_store` (`id_store`),
  CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `client` (`id`),
  CONSTRAINT `sale_ibfk_2` FOREIGN KEY (`id_store`) REFERENCES `store` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `sale` WRITE;
INSERT INTO `sale` VALUES (86,'2021-11-10',6,4,1,'Venta',0,0),(87,'2021-11-10',6,4,1,'Venta',15000,0),(88,'2021-11-10',6,4,1,'a',19500,0),(89,'2021-11-11',5,4,1,'deudita',0,0),(90,'2021-11-11',1,4,1,'ventica',28500,0),(91,'2021-11-11',6,4,1,'ventica',15000,0),(92,'2021-11-15',1,4,0,'Deuda Chamber',300000,-282000),(93,'2021-11-15',5,4,0,'Deudita',190000000,-189985000),(94,'2021-11-15',6,4,0,'deuda',0,0),(95,'2021-11-15',5,4,0,'Deuda para Jacinto',300000,-292500),(96,'2021-11-15',5,4,0,'Deuda para Jacinto',7000,500),(97,'2021-11-15',6,4,1,'Venta',3000,6000),(98,'2021-11-15',5,4,1,'Venta Jacinto',0,0),(99,'2021-11-15',1,4,1,'Venta yulina',0,0),(100,'2021-11-15',5,4,1,'Venta jaca',18000,0),(101,'2021-11-15',6,4,1,'Ventila jack',75000,0),(102,'2021-11-15',5,4,1,'Vahsdfasf',0,0);
UNLOCK TABLES;

DROP TABLE IF EXISTS `sale_debt`;
CREATE TABLE `sale_debt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_product` int NOT NULL,
  `id_sale` int NOT NULL,
  `quantity_sale` int NOT NULL,
  `price_sale` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_product` (`id_product`),
  KEY `id_sale` (`id_sale`),
  CONSTRAINT `sale_debt_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`),
  CONSTRAINT `sale_debt_ibfk_2` FOREIGN KEY (`id_sale`) REFERENCES `sale` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `sale_debt` WRITE;
INSERT INTO `sale_debt` VALUES (1,39,92,12,18000),(2,39,93,10,15000),(3,39,95,5,7500),(4,39,96,5,7500),(5,39,97,2,3000),(6,39,97,2,3000);
UNLOCK TABLES;

DROP TABLE IF EXISTS `sale_product`;
CREATE TABLE `sale_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_product` int NOT NULL,
  `id_sale` int NOT NULL,
  `quantity_sale` int NOT NULL,
  `price_sale` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_product` (`id_product`),
  KEY `id_sale` (`id_sale`),
  CONSTRAINT `sale_product_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`),
  CONSTRAINT `sale_product_ibfk_2` FOREIGN KEY (`id_sale`) REFERENCES `sale` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `sale_product` WRITE;
INSERT INTO `sale_product` VALUES (1,39,87,10,15000),(2,39,88,1,1500),(3,39,88,12,18000),(4,39,90,19,28500),(5,39,91,10,15000),(7,39,97,2,3000),(10,39,100,12,18000),(11,46,101,1,75000);
UNLOCK TABLES;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

LOCK TABLES `sessions` WRITE;
INSERT INTO `sessions` VALUES ('5K-pG0CnX_2KMSdjxtPONh_D0IN9Zosa',1637083237,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"id_sale\":102}');
UNLOCK TABLES;

DROP TABLE IF EXISTS `store`;
CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `store_name` varchar(45) DEFAULT NULL,
  `id_role` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `store_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `store` WRITE;
INSERT INTO `store` VALUES (4,'Hector','Perea','Don Hector Perea','$2b$10$ARBL2.WJbZqbtm6J/OZA/OVn2r7eBg0tdgJP/UREvl9.xnPc6ItCi','1234567890','calle 5 # 12-25','La tienda de Don Hector',2),(5,'Emiliano','Santollo','Don Santollito','$2b$10$v7tcVOaNhVjy8PTXMoFLt.3rcsxrBqJhkgKcSYivQqCDield4rO2e','5464654654','calle 3 # 12-25','La tienda de Don Santollo el mejor',2),(6,'name','test','usertest','$2b$10$QcnLDakZcoI2bmW.cl7Vt.WwHOEMKAmNiT/ebYyH26CQaBkWN7UsW','00000000','calle 0 # 0-0','Tienda Test',2),(7,'The User','Testing','UserTesting','$2b$10$zfDCo1szVA52UZgu1xF.JeAA73tRtJQ3Lr6xIIauNuWEZyYFYbu2K','000000000','Kr 0 # 0 - 0','Store Test',2),(8,'User','Testing','UserTest1','$2b$10$VXOM98BanldT3e45lTW55uEoQT7O2pg4guKi5hjO4iEolcrTDwikW','20202020','Cll 1 # 0 - 0','Store Test 1',2);
UNLOCK TABLES;

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `id_store` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_store` (`id_store`),
  CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`id_store`) REFERENCES `store` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
LOCK TABLES `supplier` WRITE;
INSERT INTO `supplier` VALUES (1,'Armando','Paredes',3125624,4),(2,'Armando','Paredes',3125624,5),(3,'Proveedor','Test',0,6),(4,'Yulian Esteban','Vargas Pardo',320777999,4),(5,'Supplier','Test',0,7),(7,'Supplier','Test',10101010,7),(8,'Supplier','Test 2',10101111,7);
UNLOCK TABLES;
