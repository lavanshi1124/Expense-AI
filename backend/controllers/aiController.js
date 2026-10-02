const { GoogleGenAI } = require("@google/genai");
const Transaction = require("../models/Transaction");


// ======================================
// GEMINI CONFIGURATION
// ======================================

if (!process.env.GEMINI_API_KEY) {

    throw new Error(
        "GEMINI_API_KEY is missing. Check backend/.env"
    );

}

console.log(
    "✅ Gemini API key detected"
);


const ai = new GoogleGenAI({

    apiKey:
        process.env.GEMINI_API_KEY

});


const MODEL =
    process.env.GEMINI_MODEL ||
    "gemini-3.6-flash";


// ======================================
// DATE - INDIA
// ======================================

const getTodayIST = () => {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).format(new Date());

};


// ======================================
// ASK AI
// ======================================

const askAI = async (req, res) => {

    try {

        const { question } = req.body;


        if (
            !question ||
            !question.trim()
        ) {

            return res.status(400).json({

                message:
                    "Question is required"

            });

        }


        const transactions =
            await Transaction.find()
                .sort({ date: -1 })
                .limit(200);


        const transactionData =
            transactions.map(
                transaction => ({

                    title:
                        transaction.title,

                    amount:
                        transaction.amount,

                    type:
                        transaction.type,

                    category:
                        transaction.category,

                    description:
                        transaction.description,

                    date:
                        transaction.date

                })
            );


        const prompt = `

You are an AI financial assistant.

Transaction history:

${JSON.stringify(
    transactionData,
    null,
    2
)}

User question:

${question}

Rules:

- Use only the transaction data.
- Never invent transactions.
- Never invent amounts.
- Calculate totals carefully.
- If the data is insufficient, say so.
- Give useful financial advice.
- Keep the answer simple.

`;


        const response =
            await ai.models.generateContent({

                model: MODEL,

                contents: prompt

            });


        res.status(200).json({

            answer:
                response.text

        });


    } catch (error) {

        console.error(
            "ASK AI ERROR:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Failed to get AI response"

        });

    }

};


// ======================================
// ANALYZE SPENDING
// ======================================

const analyzeSpending =
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find()
                    .sort({ date: -1 })
                    .limit(200);


            if (
                transactions.length === 0
            ) {

                return res.status(200).json({

                    analysis:
                        "You don't have any transactions yet."

                });

            }


            const transactionData =
                transactions.map(
                    transaction => ({

                        title:
                            transaction.title,

                        amount:
                            transaction.amount,

                        type:
                            transaction.type,

                        category:
                            transaction.category,

                        date:
                            transaction.date

                    })
                );


            const prompt = `

You are an AI expense analysis assistant.

Analyze:

${JSON.stringify(
    transactionData,
    null,
    2
)}

Provide:

1. Total income
2. Total expenses
3. Current balance
4. Highest spending category
5. Spending patterns
6. Three ways to reduce unnecessary spending
7. Overall recommendation

Use only the supplied data.

Do not invent information.

`;


            const response =
                await ai.models.generateContent({

                    model: MODEL,

                    contents: prompt

                });


            res.status(200).json({

                analysis:
                    response.text

            });


        } catch (error) {

            console.error(
                "ANALYZE ERROR:",
                error
            );


            res.status(500).json({

                message:
                    error.message ||
                    "Failed to analyze spending"

            });

        }

    };


// ======================================
// PARSE EXPENSE
// ======================================

const parseExpense =
    async (req, res) => {

        try {

            const { text } = req.body;


            if (
                !text ||
                !text.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Expense text is required"

                });

            }


            const today =
                getTodayIST();


            console.log(
                "Today's date:",
                today
            );


            const prompt = `

You are an expense extraction AI.

Today's date in India is:

${today}

Convert the user's sentence into
structured expense data.

User sentence:

"${text}"

Return ONLY JSON.

Required structure:

{
    "title": "Dinner",
    "amount": 500,
    "type": "expense",
    "category": "Food",
    "description": "Dinner",
    "date": "2026-08-19"
}

Allowed categories:

Food
Shopping
Transport
Bills
Entertainment
Health
Education
Salary
Other

Rules:

1. Extract the exact amount.

2. "₹500" means amount 500.

3. "Rs 500" means amount 500.

4. "500 rupees" means amount 500.

5. Determine whether it is:
   "income"
   or
   "expense"

6. "yesterday" means the calendar day
   before ${today}.

7. "today" means ${today}.

8. If no date is provided,
   use ${today}.

9. Date format MUST be:

YYYY-MM-DD

10. Food such as dinner,
    lunch, breakfast, restaurant,
    groceries should normally be
    category "Food".

11. Return valid JSON only.

`;


            console.log(
                "Sending expense to Gemini..."
            );


            const response =
                await ai.models.generateContent({

                    model: MODEL,

                    contents: prompt,

                    config: {

                        temperature: 0,

                        responseMimeType:
                            "application/json"

                    }

                });


            const rawResponse =
                response.text;


            console.log(
                "Gemini raw response:",
                rawResponse
            );


            let transaction;


            try {

                transaction =
                    JSON.parse(
                        rawResponse
                    );

            } catch (error) {

                console.error(
                    "Invalid Gemini JSON:",
                    rawResponse
                );


                return res.status(500).json({

                    message:
                        "Gemini returned invalid JSON"

                });

            }


            // ==================================
            // VALIDATE
            // ==================================

            if (
                !transaction.title ||
                typeof transaction.amount !==
                    "number" ||
                !transaction.type ||
                !transaction.category ||
                !transaction.date
            ) {

                return res.status(500).json({

                    message:
                        "AI returned incomplete transaction data"

                });

            }


            // ==================================
            // NORMALIZE TYPE
            // ==================================

            transaction.type =
                transaction.type
                    .toLowerCase();


            if (
                transaction.type !==
                    "expense" &&
                transaction.type !==
                    "income"
            ) {

                transaction.type =
                    "expense";

            }


            console.log(
                "✅ Parsed transaction:",
                transaction
            );


            res.status(200).json({

                transaction

            });


        } catch (error) {

            console.error(
                "FULL GEMINI ERROR:",
                error
            );


            res.status(500).json({

                message:
                    error.message ||
                    "AI could not understand your expense"

            });

        }

    };


// ======================================
// EXPORT
// ======================================

module.exports = {

    askAI,

    analyzeSpending,

    parseExpense

};