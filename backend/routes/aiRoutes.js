const express = require("express");

const {
    askAI,
    analyzeSpending,
    parseExpense
} = require("../controllers/aiController");

const router = express.Router();


// Ask AI about finances
router.post("/ask", askAI);


// Analyze spending
router.get("/analyze", analyzeSpending);


// Convert natural language into transaction
router.post("/parse-expense", parseExpense);


module.exports = router;