import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// -----------------------------
// TRANSACTION APIs
// -----------------------------

export const getTransactions = () =>
    API.get("/transactions");


export const createTransaction = (data) =>
    API.post("/transactions", data);


export const updateTransaction = (id, data) =>
    API.put(`/transactions/${id}`, data);


export const deleteTransaction = (id) =>
    API.delete(`/transactions/${id}`);


// -----------------------------
// AI APIs
// -----------------------------

export const askAI = (question) =>
    API.post("/ai/ask", {
        question
    });


export const analyzeSpending = () =>
    API.get("/ai/analyze");


export const parseExpense = (text) =>
    API.post("/ai/parse-expense", {
        text
    });


export default API;