CREATE DATABASE tienda;
use tienda;

CREATE TABLE role(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45)
);

CREATE TABLE store(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45),
    last_name VARCHAR(45),
    username VARCHAR(45),
    phone VARCHAR(45),
    address VARCHAR(45),
    store_name VARCHAR(45),
    id_role INT(11), 
    FOREIGN KEY (id_role) references role (id)
);
CREATE TABLE client(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_store INT(11) NOT NULL,
    name VARCHAR(45),
    lastname VARCHAR(45),
    phone INT(11),
    FOREIGN KEY (id_store) references store(id)
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
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_product INT(11) NOT NULL,
    id_sale INT(11) NOT NULL,
    quantity_sale INT(11) NOT NULL,
    price_sale DOUBLE NOT NULL,
    PRIMARY KEY (id_product,id_sale),
    FOREIGN KEY (id_product) references product (id),
    FOREIGN KEY (id_sale) references sale (id)
);

CREATE TABLE sale(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    date_sale date,
    id_client INT(11) NOT NULL,
    id_store INT(11) NOT NULL, 
    status BOOLEAN,
    description VARCHAR(45),
       FOREIGN KEY (id_client) references client (id),
       FOREIGN KEY (id_store) references store (id)

);

CREATE TABLE sale_debt(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_product INT(11) NOT NULL,
    id_sale INT(11) NOT NULL,
    quantity_sale INT(11) NOT NULL,
    price_sale DOUBLE NOT NULL,
    FOREIGN KEY (id_product) references product (id),
    FOREIGN KEY (id_sale) references sale (id)
);

INSERT INTO role values(1, 'admin');
INSERT INTO role values(2, 'seller');
INSERT INTO role values(3, 'support');


ALTER TABLE sale ADD COLUMN total_sale DOUBLE;
ALTER TABLE sale ADD COLUMN total_debt DOUBLE;