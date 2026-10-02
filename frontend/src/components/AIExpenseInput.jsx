import { useState } from "react";

import {
    parseExpense,
    createTransaction
} from "../services/api";


function AIExpenseInput({
    onTransactionAdded
}) {

    const [text, setText] = useState("");

    const [loading, setLoading] =
        useState(false);


    const [preview, setPreview] =
        useState(null);


    const handleParse = async () => {

        if (!text.trim()) {
            return;
        }


        setLoading(true);

        setPreview(null);


        try {

            const response =
                await parseExpense(text);


            setPreview(
                response.data.transaction
            );

        } catch (error) {

            console.error(error);

            alert(
                "AI could not understand the expense."
            );

        } finally {

            setLoading(false);

        }
    };


    const handleSave = async () => {

        if (!preview) {
            return;
        }


        try {

            const response =
                await createTransaction(
                    preview
                );


            onTransactionAdded(
                response.data
            );


            setText("");

            setPreview(null);

            alert(
                "Transaction added successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to save transaction."
            );
        }
    };


    return (

        <div className="ai-expense-card">

            <h2>
                ✨ Add Expense with AI
            </h2>

            <p>
                Describe your expense naturally.
            </p>


            <div className="natural-input">

                <input
                    type="text"
                    placeholder='Example: "I spent ₹500 on dinner yesterday"'
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                />

                <button
                    onClick={handleParse}
                    disabled={loading}
                >
                    {loading
                        ? "Understanding..."
                        : "✨ Understand"}
                </button>

            </div>


            {preview && (

                <div className="ai-preview">

                    <h3>
                        AI understood:
                    </h3>


                    <div className="preview-grid">

                        <div>
                            <span>Title</span>
                            <strong>
                                {preview.title}
                            </strong>
                        </div>


                        <div>
                            <span>Amount</span>
                            <strong>
                                ₹{preview.amount}
                            </strong>
                        </div>


                        <div>
                            <span>Type</span>
                            <strong>
                                {preview.type}
                            </strong>
                        </div>


                        <div>
                            <span>Category</span>
                            <strong>
                                {preview.category}
                            </strong>
                        </div>


                        <div>
                            <span>Date</span>
                            <strong>
                                {preview.date}
                            </strong>
                        </div>

                    </div>


                    <button
                        className="save-ai-btn"
                        onClick={handleSave}
                    >
                        ✓ Add Transaction
                    </button>

                </div>

            )}

        </div>
    );
}


export default AIExpenseInput;