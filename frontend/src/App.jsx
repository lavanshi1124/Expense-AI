import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";

import TransactionForm
    from "./components/TransactionForm";

import TransactionList
    from "./components/TransactionList";

import AIAssistant
    from "./components/AIAssistant";

import AIExpenseInput
    from "./components/AIExpenseInput";


import { getTransactions }
    from "./services/api";


import "./App.css";


function App() {

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const fetchTransactions =
        async () => {

            try {

                const response =
                    await getTransactions();

                setTransactions(
                    response.data
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to connect to backend."
                );

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        fetchTransactions();

    }, []);


    const handleTransactionAdded =
        (transaction) => {

            setTransactions((prev) => [
                transaction,
                ...prev
            ]);
        };


    const handleTransactionDeleted =
        (id) => {

            setTransactions((prev) =>
                prev.filter(
                    (transaction) =>
                        transaction._id !== id
                )
            );
        };


    if (loading) {

        return (
            <div className="loading">
                Loading AI Expense Tracker...
            </div>
        );
    }


    return (

        <div className="app">

            <header>

                <h1>
                    AI Expense Tracker
                </h1>

                <p>
                    Track, understand and improve
                    your finances with AI
                </p>

            </header>


            <main>

                <Dashboard
                    transactions={transactions}
                />


                <AIExpenseInput
                    onTransactionAdded={
                        handleTransactionAdded
                    }
                />


                <AIAssistant />


                <div className="content">

                    <TransactionForm
                        onTransactionAdded={
                            handleTransactionAdded
                        }
                    />


                    <TransactionList
                        transactions={transactions}
                        onTransactionDeleted={
                            handleTransactionDeleted
                        }
                    />

                </div>

            </main>

        </div>
    );
}


export default App;