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
  start();
});

function start() {
  inquirer
    .prompt({
      name: "actionChoice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.actionChoice) {
        case "View Products for Sale":
          findProduct();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
        default:
          start();
      }
    });
}

function findProduct() {
  connection.query("Select*from products", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function lowInventory() {
  connection.query("Select*from products where stock_quantity <= 5", function(
    err,
    res
  ) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Increase quantity for product_name"
      },
      {
        name: "quantity",
        item: "input",
        message: "Increase Inventory by: "
      }
    ])
    .then(function(answer) {
      connection.query(
        "UPDATE products SET stock_quantity= stock_quantity + ? WHERE product_name = ?",
        [answer.quantity, answer.item],
        function(err, res) {
          if (err) throw err;
          console.log("Inventory Updated");
          findProduct();
        }
      );
    });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: "itemId",
        type: "input",
        message: "New Item ID Number: "
      },
      {
        name: "productName",
        item: "input",
        message: "New Product Name:"
      },
      {
        name: "departmentName",
        item: "input",
        message: "New Department Name:"
      },
      {
        name: "price",
        item: "input",
        message: "Price"
      },
      {
        name: "quantity",
        item: "input",
        message: "Quantity"
      }
    ])
    .then(function(answer) {
      connection.query(
        "insert into products (item_id, product_name, department_name, price, stock_quantity) values (?, ?, ?, ?, ?)",
        [
          answer.itemId,
          answer.productName,
          answer.departmentName,
          answer.price,
          answer.quantity
        ],
        function(err, res) {
          if (err) throw err;
          console.log("Product Added");
          findProduct();
        }
      );
    });
}
