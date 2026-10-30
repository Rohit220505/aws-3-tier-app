const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

// Health Checking
app.get('/health', (req, res) => {
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/transaction', (req, res) => {
    console.log(req.body);
    console.log(req.body.amount);
    console.log(req.body.desc);

    const amount = req.body.amount;
    const desc = req.body.desc;

    transactionService.addTransaction(amount, desc, function(err, result) {
        if (err) {
            console.error("Failed to add transaction:", err);

            return res.status(500).json({
                message: "Could not add transaction",
                error: err.message
            });
        }

        console.log("Transaction added successfully");

        res.status(200).json({
            message: "added transaction successfully",
            id: result.insertId
        });
    });
});

// GET ALL TRANSACTIONS
app.get('/transaction', (req, res) => {
    try {
        var transactionList = [];

        transactionService.getAllTransactions(function(results) {
            console.log("we are in the call back:");

            for (const row of results) {
                transactionList.push({
                    "id": row.id,
                    "amount": row.amount,
                    "description": row.description
                });
            }

            console.log(transactionList);

            res.statusCode = 200;
            res.json({"result": transactionList});
        });

    } catch (err) {
        res.json({
            message: "could not get all transactions",
            error: err.message
        });
    }
});

// DELETE ALL TRANSACTIONS
app.delete('/transaction', (req, res) => {
    try {
        transactionService.deleteAllTransactions(function(result) {
            res.statusCode = 200;
            res.json({
                message: "delete function execution finished."
            });
        });

    } catch (err) {
        res.json({
            message: "Deleting all transactions may have failed.",
            error: err.message
        });
    }
});

// DELETE ONE TRANSACTION
app.delete('/transaction/id', (req, res) => {
    try {
        // probably need to do some kind of parameter checking
        transactionService.deleteTransactionById(req.body.id, function(result) {
            res.statusCode = 200;
            res.json({
                message: `transaction with id ${req.body.id} seemingly deleted`
            });
        });

    } catch (err) {
        res.json({
            message: "error deleting transaction",
            error: err.message
        });
    }
});

// GET SINGLE TRANSACTION
app.get('/transaction/id', (req, res) => {
    // also probably do some kind of parameter checking here
    try {
        transactionService.findTransactionById(req.body.id, function(result) {
            res.statusCode = 200;

            var id = result[0].id;
            var amt = result[0].amount;
            var desc = result[0].description;

            res.json({
                "id": id,
                "amount": amt,
                "desc": desc
            });
        });

    } catch (err) {
        res.json({
            message: "error retrieving transaction",
            error: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`)
});