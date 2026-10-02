# ExpenseAI

ExpenseAI is a full-stack AI-powered expense tracker that helps users manage personal finances by tracking transactions, asking natural-language questions, and analyzing spending patterns with Gemini AI.

## Features

- Add, view, update, and delete transactions
- Categorize expenses and income
- Dashboard with spending summaries and charts
- Natural-language AI assistant for financial questions
- AI-based expense parsing from text such as "Spent Rs 450 on groceries yesterday"
- Spending analysis with recommendations based on transaction history
- React frontend and Express backend architecture

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas / local MongoDB via Mongoose
- AI: Google Gemini via @google/genai

## Project Structure

```bash
ExpenseAi/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── packahe.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- npm installed
- MongoDB running locally or a MongoDB Atlas connection string
- A Google Gemini API key

## Environment Setup

Create a `.env` file inside the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenseai
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
```

Notes:

- Replace `MONGO_URI` with your local MongoDB URI or Atlas connection string.
- `GEMINI_API_KEY` is required for AI features.
- `GEMINI_MODEL` is optional and defaults to a Gemini model if omitted.

## Installation

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Overview

The backend exposes AI and transaction endpoints under `/api`.

### Transactions

- `GET /api/transactions` — fetch all transactions
- `GET /api/transactions/:id` — fetch one transaction
- `POST /api/transactions` — create a transaction
- `PUT /api/transactions/:id` — update a transaction
- `DELETE /api/transactions/:id` — delete a transaction

### AI

- `POST /api/ai/ask` — ask a question about spending or finances
- `GET /api/ai/analyze` — analyze spending patterns
- `POST /api/ai/parse-expense` — convert text like "Spent Rs 400 on food" into a structured transaction

## Example Transaction Schema

```json
{
  "title": "Groceries",
  "amount": 1200,
  "type": "expense",
  "category": "Food",
  "description": "Weekly supermarket purchase",
  "date": "2026-10-02T00:00:00.000Z"
}
```

## Usage

1. Open the frontend in the browser.
2. Add an income or expense entry from the form.
3. View your dashboard and transaction list.
4. Ask the AI assistant questions like:
   - "How much did I spend this month?"
   - "What is my highest spending category?"
   - "Can you suggest ways to save more?"
5. Use AI parsing for natural-language entries.

## Notes

- The project is built for personal finance tracking and simple budgeting insights.
- For production use, add authentication, validation, and better error handling.
- Consider using environment-based deployment settings for MongoDB and Gemini secrets.

## License

This project is for educational and personal use unless otherwise specified by the project owner.
