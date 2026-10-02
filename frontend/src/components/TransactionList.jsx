import { deleteTransaction } from "../services/api";

function TransactionList({
    transactions,
    onTransactionDeleted
}) {
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            await deleteTransaction(id);

            onTransactionDeleted(id);
        } catch (error) {
            console.error(error);
            alert("Failed to delete transaction");
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="transaction-card">
                <h2>Transaction History</h2>

                <p className="empty">
                    No transactions found.
                </p>
            </div>
        );
    }

    return (
        <div className="transaction-card">
            <h2>Transaction History</h2>

            <div className="transaction-list">
                {transactions.map((transaction) => (
                    <div
                        className="transaction"
                        key={transaction._id}
                    >
                        <div className="transaction-info">
                            <h3>{transaction.title}</h3>

                            <p>
                                {transaction.category} •{" "}
                                {new Date(
                                    transaction.date
                                ).toLocaleDateString()}
                            </p>

                            {transaction.description && (
                                <small>
                                    {transaction.description}
                                </small>
                            )}
                        </div>

                        <div className="transaction-right">
                            <span
                                className={
                                    transaction.type === "income"
                                        ? "income"
                                        : "expense"
                                }
                            >
                                {transaction.type === "income"
                                    ? "+"
                                    : "-"}
                                ₹{transaction.amount.toLocaleString()}
                            </span>

                            <button
                                className="delete-btn"
                                onClick={() =>
                                    handleDelete(
                                        transaction._id
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionList;