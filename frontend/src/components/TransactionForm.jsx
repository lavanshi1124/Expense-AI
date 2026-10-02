import { useState } from "react";
import { createTransaction } from "../services/api";

function TransactionForm({ onTransactionAdded }) {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        description: "",
        date: new Date().toISOString().split("T")[0]
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.amount) {
            alert("Please enter title and amount");
            return;
        }

        try {
            setLoading(true);

            const response = await createTransaction({
                ...formData,
                amount: Number(formData.amount)
            });

            onTransactionAdded(response.data);

            setFormData({
                title: "",
                amount: "",
                type: "expense",
                category: "Food",
                description: "",
                date: new Date().toISOString().split("T")[0]
            });
        } catch (error) {
            console.error(error);
            alert("Failed to add transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <h2>Add Transaction</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Grocery Shopping"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Amount</label>

                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            min="0"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Type</label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="expense">
                                Expense
                            </option>

                            <option value="income">
                                Income
                            </option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Food">Food</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Transport">
                                Transport
                            </option>
                            <option value="Bills">Bills</option>
                            <option value="Entertainment">
                                Entertainment
                            </option>
                            <option value="Health">Health</option>
                            <option value="Education">
                                Education
                            </option>
                            <option value="Salary">Salary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <textarea
                        name="description"
                        placeholder="Optional description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className="add-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Transaction"}
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;