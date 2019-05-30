create database bamazonDB;
use bamazonDB;

CREATE TABLE products
(
    item_id INT(10) NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10 , 2 ),
    stock_quantity INT(10)
);

insert into products
    (item_id, product_name, department_name, price, stock_quantity)
values
    (110, "PW", "Titleist", 99, 6);
select*
from products;
update products set price= "99" where item_id = "100";
UPDATE products SET stock_quantity= 9 WHERE item_id = 101;

Select stock_quantity, price
from products
where item_id = ?;
UPDATE products SET stock_quantity= stock_quantity - ? WHERE item_id = ?;
Select*
from products
where stock_quantity <= 5;
insert into products
    (item_id, product_name, department_name, price, stock_quantity)
values
    (?, ?, ?, ?, ?)