const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

var allRows;
var specificRow;

const queryAll = () => {
    return new Promise((res, rej) => {
        connection.query('SELECT id, product_name, price, stock_quantity FROM products', (err, rows) => {
            if (err) throw err; 
            res(allRows = rows); // resolves promise
        });
    });
}

const queryUpdateRow = (id, quantity) => {
    return new Promise((res, rej) => {
        connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [specificRow.stock_quantity - quantity, id], (err, row) => {
            if (err) throw err;
            res(specificRow.price * quantity);
        })
    });
}

const isInteger = (str) => {
    str = Number(str); // Number over parseInt to reject decimals
    return (str % 1 === 0 && str > 0); // positive integers only
}

const searchArray = (arr, property, value) => {
    arr.forEach(function(element, index) {
        if (element[property] === value) specificRow = arr[index];
    }, this);
}

const checkQuantity = (obj, property, value) => {
    if(obj[property] >= value) return value;
    return false;
} 

const questions = [{
    name: "idOfProduct",
    type: "input",
    message: "What is the ID of the product you want to buy?",
    validate: (value)=> {
        const pass = isInteger(value); // turns string to number
        if (!pass) return 'Please enter a valid ID';
        searchArray(allRows, 'id', +value);
        if (specificRow.stock_quantity === 0) return `Sorry, we don\'t have ${specificRow.product_name} in stock`;
        if (!specificRow) return 'Try again, ID is not in the database.';
        return true;
    } // end validation
}, {
    name: "qtyOfProduct",
    type: "input",
    message: "How many units of the product would you like to buy?",
    validate: (value)=> {
        const pass = isInteger(value);
        if (!pass) return 'Please enter a valid amount of units';
        const quantity = checkQuantity(specificRow, 'stock_quantity', +value);
        if (!quantity) return 'Insufficient quantity';
        return true;
    } // end validation
}]; // end of questions

connection.connect((err)=> {
    if (err) throw err;
    console.log('You are now connected...');
    queryAll().then((rows) => {
        console.log(rows); // allRows
        console.log('\n');
        inquirer.prompt(questions).then((answers) => {
            queryUpdateRow(+answers.idOfProduct, +answers.qtyOfProduct).then((total)=> {
                console.log(`Your total is ${total}`);
                connection.end();
            });
        }); // end of inquirer
    });
});