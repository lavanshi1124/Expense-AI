const path = require("path");
const dotenv = require("dotenv");

// ======================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ======================================

dotenv.config({
    path: path.join(__dirname, ".env")
});

console.log(
    "Gemini key exists:",
    !!process.env.GEMINI_API_KEY
);

console.log(
    "Gemini model:",
    process.env.GEMINI_MODEL
);


// ======================================
// IMPORT PACKAGES
// ======================================

const express = require("express");
const cors = require("cors");


// ======================================
// DATABASE
// ======================================

const connectDB = require("./config/db");


// ======================================
// CREATE APP
// ======================================

const app = express();


// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());


// ======================================
// CONNECT DATABASE
// ======================================

connectDB();


// ======================================
// ROUTES
// ======================================

// Import routes AFTER dotenv.config()
const transactionRoutes =
    require("./routes/transactionRoutes");

const aiRoutes =
    require("./routes/aiRoutes");


app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/ai",
    aiRoutes
);


// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {

    res.json({

        message:
            "AI Expense Tracker API is running"

    });

});


// ======================================
// 404
// ======================================

app.use((req, res) => {

    res.status(404).json({

        message:
            "Route not found"

    });

});


// ======================================
// START SERVER
// ======================================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});