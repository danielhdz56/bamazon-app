const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});
var allRows = [];
var allItems = [];
var specificRow;

const isInteger = (str) => {
    str = Number(str); // Number over parseInt to reject decimals
    return (str % 1 === 0 && str > 0); // positive integers only
}

const isValidString = (str) => {
    str = str.trim(); // must enter something, only letters and spaces, shorter than 15.
    return (str.length !== 0 && str.search(/^[a-zA-Z\s]*$/) !== -1 && str.length <= 15);
}

const isValidPrice = (str) => {
    const regex = /^\d+(\.\d{0,2})?$/; // greater than 0 and up to two decimal places
    return (regex.test(str) && Number(str) > 0);
}

const questions = [{
    name: "mainMenu",
    type: "list",
    message: "What would you want to do?",
    choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
    ] // end of choices
}, {
    name: "addToItem",
    type: 'list',
    message: "What item would you like to add to?",
    choices: allItems,
    when: (answers) => {
        return answers.mainMenu === 'Add to Inventory';
    }
}, {
    name: "itemToAdd",
    type: "input",
    message: "What item would you like to add?",
    when: (answers) => {
        return answers.mainMenu === 'Add New Product';
    },
    validate: (value) => {
        const pass = isValidString(value);
        if (!pass) return "Please make sure it's short, and that it doesn't contain any special characters";
        return true;
    } // end of validation
}, {
    name: "qtyToAdd",
    type: "input",
    message: "How much would you like to add?",
    when: (answers) => {
        return (answers.mainMenu === 'Add to Inventory' || answers.mainMenu === 'Add New Product');
    },
    validate: (value) => {
        const pass = isInteger(value);
        if (!pass) return 'Please enter a valid amount of units';
        return true;
    } // end validation
}, {
    name: "priceToAdd",
    type: "input",
    message: "How much does it cost?",
    when: (answers) => {
        return answers.mainMenu === 'Add New Product';
    },
    validate: (value) => {
        const pass = isValidPrice(value);
        if (!pass) return 'Please enter a valid price';
        return true;
    } // end of validation
}, {
    name: "departmentToAdd",
    type: "input",
    message: "What department store is this for?",
    when: (answers) => {
        return answers.mainMenu === 'Add New Product';
    },
    validate: (value) => {
        const pass = isValidString(value);
        if (!pass) return "Please make sure it's short, and that it doesn't contain any special characters";
        return true;
    } // end of validation
}]; // end of questions

const searchArray = (arr, property, value) => {
    arr.forEach(function (element, index) {
        if (element[property] === value) specificRow = arr[index];
    }, this);
};

const queryAll = () => {
    return new Promise((res, rej) => {
        connection.query('SELECT id, product_name, price, stock_quantity FROM products', (err, rows) => {
            if (err) throw err;
            res(rows); // resolves promise
        });
    });
};

const queryLowInventory = () => {
    return new Promise((res, rej) => {
        connection.query('SELECT product_name FROM products WHERE stock_quantity <= 5', (err, rows) => {
            if (err) throw err;
            const items = [];
            rows.forEach(function (element) {
                items.push(element.product_name);
            }, this);
            res(items);
        });
    });
};

const queryAddToInventory = (item, quantity) => {
    return new Promise((res, rej) => {
        searchArray(allRows, 'product_name', item);
        let newQuantity = specificRow.stock_quantity + quantity;
        connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ?', [newQuantity, item], (err, row) => {
            if (err) throw err;
            res(newQuantity);
        });
    });
};

const queryAddToProducts = (item, quantity, price, store) => {
    return new Promise((res, rej) => {
        let newItem = {
            product_name: item,
            department_name: store,
            price,
            stock_quantity: quantity
        };
        connection.query('INSERT INTO products SET ?', newItem, (err, row) => {
            if (err) throw err;
            res(newItem);
        });
    });
}

connection.connect((err) => {
    if (err) throw err;
    console.log('You are now connected...');
    queryAll().then((rows) => {
        rows.forEach(function (element) {
            allRows.push(element);
            allItems.push(element.product_name);
        }, this);
    });
    inquirer.prompt(questions).then((answers) => {
        if (answers.mainMenu === 'View Products for Sale') {
            queryAll().then((rows) => {
                console.log(rows);
            });
        } else if (answers.mainMenu === 'View Low Inventory') {
            queryLowInventory().then((items) => {
                console.log(items);
            });
        } else if (answers.mainMenu === 'Add to Inventory') {
            queryAddToInventory(answers.addToItem, +answers.qtyToAdd).then((totalInventory) => {
                console.log(`The total inventory for ${answers.addToItem} is now ${totalInventory}`);
            });
        } else {
            queryAddToProducts(answers.itemToAdd, +answers.qtyToAdd, +answers.priceToAdd, answers.departmentToAdd).then((newProduct) => {
                console.log(`${answers.qtyToAdd} ${answers.itemToAdd} at ${answers.priceToAdd} have successfully been added to ${answers.departmentToAdd}`);
            });
        }
        connection.end();
    }); // end of inquirer
});