const Transaction = require("../models/Transaction");

// GET all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};

// GET single transaction
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transaction",
            error: error.message
        });
    }
};

// CREATE transaction
const createTransaction = async (req, res) => {
    try {
        const {
            title,
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        if (!title || amount === undefined || !type || !category) {
            return res.status(400).json({
                message: "Title, amount, type and category are required"
            });
        }

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            description,
            date
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};

// UPDATE transaction
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
};

// DELETE transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(
            req.params.id
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};

module.exports = {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
};