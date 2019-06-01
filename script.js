var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  findProduct();
});

function start() {
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "Insert the ID number of the item you would like to purchase:"
      },
      {
        name: "units",
        item: "input",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "Select stock_quantity, price from products where item_id = ?",
        [answer.item_id],
        function(err, res) {
          if (err) throw err;
          var quantity = res[0].stock_quantity;
          var item = answer.item_id;
          var price = res[0].price;
          var units = answer.units;
          var total = price * units;
          if (quantity - units < 0) {
            console.log("Not Enough Product In Stock");
            start();
          } else {
            console.log("Total Amount Due: $" + total);
            reduce(units, item);
          }
          report(total);
        }
      );
    });
}

function findProduct() {
  connection.query("Select*from products", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function reduce(x, y) {
  connection.query(
    "UPDATE products SET stock_quantity= stock_quantity - ? WHERE item_id = ?",
    [x, y],
    function(err, res) {
      if (err) throw err;
      console.log("Inventory Updated");
      again();
    }
  );
}

function end() {
  connection.end();
  console.log("Goodbye");
}

function again() {
  inquirer
    .prompt([
      {
        name: "anotherItem",
        type: "confirm",
        message: "Purchase another item?"
      }
    ])
    .then(function(answer) {
      if (answer.anotherItem) {
        findProduct();
      } else {
        end();
      }
    });
}

function report(x) {
  connection.query(
    "update departments set product_sales = product_sales + ?",
    [x],
    function(err, res) {
      if (err) throw err;
    }
  );
  supervisor();
}

function supervisor() {
  connection.query(
    "select department_id, department_name, over_head_cost, product_sales, (product_sales - over_head_cost )AS total_profit from departments;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}
