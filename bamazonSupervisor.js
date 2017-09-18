const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

const questions = [{
    name: "mainMenu",
    type: "list",
    message: "What would you want to do?",
    choices: [
        'View Product Sales by Department',
        'Create New Department'
    ] // end of choices
}];

connection.connect((err) => {
    if (err) throw err;
    console.log('You are now connected...');
    inquirer.prompt(questions).then((answers) => {
        console.log(answers);
        connection.end();
    }); // end of inquirer
});