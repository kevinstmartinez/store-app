CREATE DATABASE tienda;
use tienda;

CREATE TABLE role(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45)
);

CREATE TABLE user(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_role INT(11),
    FOREIGN KEY (id_role) references role (id)
);
CREATE TABLE seller(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    dni INT(11),
    name VARCHAR(45),
    lastname VARCHAR(45),
    phone INT(11),
    email VARCHAR(45),
    user_id INT(11),
    FOREIGN KEY (user_id) references user (id)
);
CREATE TABLE store(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    description VARCHAR(45),
    address VARCHAR(45),
    seller_id INT(11),
    FOREIGN KEY (seller_id) references seller (id)
);
CREATE TABLE client(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    lastname VARCHAR(45),
    phone INT(11)
);
CREATE TABLE sale(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sale_date DATE,
    status BOOLEAN,
    description VARCHAR(45),
    id_store INT(11),
    id_client INT(11),
    FOREIGN KEY (id_store) references store (id),
    FOREIGN KEY (id_client) references client (id)
);
CREATE TABLE inventory(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    id_store INT(45),
    FOREIGN KEY (id_store) references store (id)
);
CREATE TABLE category(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    id_inventory INT(11),
    FOREIGN KEY (id_inventory) references inventory (id)
);
CREATE TABLE supplier(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    lastname VARCHAR(45),
    phone INT(11),
    id_store INT(11),
    FOREIGN KEY (id_store) references store (id)
);
CREATE TABLE product(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    barcode INT(11),
    image LONGBLOB,
    expiration_date DATE,
    name VARCHAR(45),
    quantity  INT(11),
    unit_cost DOUBLE,
    unit_price DOUBLE,
    id_category INT(11),
    id_supplier INT(11),
    FOREIGN KEY (id_category) references category(id),
    FOREIGN KEY (id_supplier) references supplier(id)
);
CREATE TABLE sale_product(
    id_product INT(11) NOT NULL,
    id_sale INT(11) NOT NULL,
    quantity_sale INT(11) NOT NULL,
    price_sale DOUBLE NOT NULL,
    PRIMARY KEY (id_product,id_sale),
    FOREIGN KEY (id_product) references product (id),
    FOREIGN KEY (id_sale) references sale (id)
);