const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

connection.connect((err)=> {
    if (err) throw err;
    console.log('You are now connected...');
});

connection.query('SELECT id, product_name, price, stock_quantity FROM products', (err, rows) => {
    connection.end();
    console.log(rows);
});