const dbcreds = require('./DbConfig');
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE
});

function addTransaction(amount, desc, callback) {
    const sql = "INSERT INTO transactions (amount, description) VALUES (?, ?)";

    con.query(sql, [amount, desc], function(err, result) {
        if (err) {
            console.error("Error adding transaction:", err);
            return callback(err);
        }

        console.log("Transaction added successfully. ID:", result.insertId);
        callback(null, result);
    });
}

function getAllTransactions(callback) {
    const sql = "SELECT * FROM transactions";

    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        }

        console.log("Getting all transactions...");
        return callback(result);
    });
}

function findTransactionById(id, callback) {
    const sql = "SELECT * FROM transactions WHERE id = ?";

    con.query(sql, [id], function(err, result) {
        if (err) {
            throw err;
        }

        console.log(`retrieving transactions with id ${id}`);
        return callback(result);
    });
}

function deleteAllTransactions(callback) {
    const sql = "DELETE FROM transactions";

    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        }

        console.log("Deleting all transactions...");
        return callback(result);
    });
}

function deleteTransactionById(id, callback) {
    const sql = "DELETE FROM transactions WHERE id = ?";

    con.query(sql, [id], function(err, result) {
        if (err) {
            throw err;
        }

        console.log(`Deleting transaction with id ${id}`);
        return callback(result);
    });
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteAllTransactions,
    findTransactionById,
    deleteTransactionById
};

