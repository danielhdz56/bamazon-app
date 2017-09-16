const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

const queryAll = () => {
    return new Promise((res, rej) => {
        connection.query('SELECT id, product_name, price, stock_quantity FROM products', (err, rows) => {
            if (err) throw err; 
            res(console.log(rows));
        });
    });
}

const isInteger = (str) => {
    str = Number(str); // Number over parseInt to reject decimals
    return str % 1 === 0; 
}

const questions = [{
    name: "idOfProduct",
    type: "input",
    message: "What is the ID of the product you want to buy?",
    validate: (value)=> {
        const pass = isInteger(value); // turns string to number
        if (pass) return true;
        return 'Please enter a valid integer';
    }
}];

connection.connect((err)=> {
    if (err) throw err;
    console.log('You are now connected...');
    queryAll().then(()=> {
        console.log('\n');
        inquirer.prompt(questions).then((answers) => {
            console.log(answers);
        });
    });
});










