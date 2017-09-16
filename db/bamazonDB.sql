DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE IF NOT EXISTS bamazonDB;
USE bamazonDB;
CREATE TABLE products (
	id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(5,2) NOT NULL,
	stock_quantity INTEGER(10) NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
('Eggs','King Soopers', 2.99, 100),
('Milk','King Soopers', 3.49, 50),
('Ground Beef','King Soopers', 3.99, 20),
('Bananas','King Soopers', 0.59, 30),
('Pizza','King Soopers', 3.49, 14),
('Bread','King Soopers', 3.49, 12),
('Sliced Turkey','King Soopers', 2.67, 90),
('Apples','King Soopers', 1.25, 88),
('Ham','King Soopers', 4.20, 21),
('Oranges','King Soopers', 0.99, 54);

SELECT * FROM products;