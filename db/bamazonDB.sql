DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE IF NOT EXISTS bamazonDB;
USE bamazonDB;
CREATE TABLE IF NOT EXISTS products (
	id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(5,2) NOT NULL,
	stock_quantity INTEGER(10) NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
('Eggs','Food', 2.99, 10),
('Milk','Food', 3.49, 5),
('Ground Beef','Food', 3.99, 2),
('Pencils','Office', 0.59, 3),
('Paper','Office', 3.49, 4),
('Markers','Office', 3.49, 12),
('Bracelet','Clothing', 2.67, 9),
('Chapstick','Health', 1.25, 8),
('Toilet Paper','Bathroom', 4.20, 2),
('Vitamins','Health', 0.99, 3);

CREATE TABLE IF NOT EXISTS departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	over_head_costs DECIMAL(9,2) NOT NULL,
	PRIMARY KEY(department_id)
);

ALTER TABLE products
ADD product_sales DECIMAL(10, 2);

SELECT * FROM products;


INSERT INTO departments (department_name, over_head_costs)
VALUES
('Food', 30340.23),
('Office', 4143.13),
('Clothing', 33114.51),
('Health', 124250.03),
('Bathroom', 39500.33);

SELECT * FROM departments;