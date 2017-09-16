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
            allRows = rows;
            res(console.log(allRows));
        });
    });
}

const isInteger = (str) => {
    str = Number(str); // Number over parseInt to reject decimals
    return str % 1 === 0; 
}

const searchArray = (arr, property, value) => {
    arr.forEach(function(element, index) {
        if (element[property] === value) specificRow = arr[index];
        return specificRow;
    }, this);
}

const questions = [{
    name: "idOfProduct",
    type: "input",
    message: "What is the ID of the product you want to buy?",
    validate: (value)=> {
        const pass = isInteger(value); // turns string to number
        if (!pass) return 'Please enter a valid ID';
        searchArray(allRows, 'id', +value);
        if (!specificRow) return 'Try again, ID is not in the database.'
        return true;
    }
}, {
    name: "qtyOfProduct",
    type: "input",
    message: "How many units of the product would you like to buy?",
    validate: (value)=> {
        const pass = isInteger(value);
        if (!pass) return 'Please enter a valid amount of units';
        return true;
    }
}];

connection.connect((err)=> {
    if (err) throw err;
    console.log('You are now connected...');
    queryAll().then(()=> {
        console.log('\n');
        inquirer.prompt(questions).then((answers) => {
            console.log(answers);
            console.log(specificRow);
        });
    });
});












