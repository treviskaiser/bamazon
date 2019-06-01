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
    .prompt([
      {
        name: "sales",
        type: "list",
        message: "Select Choice",
        choices: ["View Sales"]
      }
    ])
    .then(function() {
      supervisor();
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
}

function supervisor() {
  connection.query(
    "select department_id, department_name, over_head_cost, product_sales, (product_sales - over_head_cost )AS total_profit from departments;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      end();
    }
  );
}

function end() {
  connection.end();
  console.log("Goodbye");
}
