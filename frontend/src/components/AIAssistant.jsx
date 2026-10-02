import { useState } from "react";
import {
    askAI,
    analyzeSpending
} from "../services/api";

function AIAssistant() {

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);


    const handleAsk = async (e) => {

        e.preventDefault();

        if (!question.trim()) {
            return;
        }


        const userMessage = {
            role: "user",
            text: question
        };


        setMessages((prev) => [
            ...prev,
            userMessage
        ]);


        const currentQuestion = question;

        setQuestion("");

        setLoading(true);


        try {

            const response =
                await askAI(currentQuestion);


            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: response.data.answer
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text:
                        "Sorry, I couldn't process your question."
                }
            ]);

        } finally {

            setLoading(false);

        }
    };


    const handleAnalysis = async () => {

        setLoading(true);

        try {

            const response =
                await analyzeSpending();


            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: response.data.analysis
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text:
                        "Unable to analyze your spending."
                }
            ]);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="ai-card">

            <div className="ai-header">

                <div>
                    <h2>🤖 AI Financial Assistant</h2>

                    <p>
                        Ask questions about your spending
                    </p>
                </div>

                <button
                    className="analysis-btn"
                    onClick={handleAnalysis}
                    disabled={loading}
                >
                    Analyze My Spending
                </button>

            </div>


            <div className="chat-container">

                {messages.length === 0 && (

                    <div className="ai-welcome">

                        <h3>
                            How can I help you?
                        </h3>

                        <p>
                            Try asking:
                        </p>

                        <ul>
                            <li>
                                Where am I spending the most?
                            </li>

                            <li>
                                How much did I spend on food?
                            </li>

                            <li>
                                How can I reduce my expenses?
                            </li>

                            <li>
                                Give me a summary of my finances.
                            </li>
                        </ul>

                    </div>

                )}


                {messages.map((message, index) => (

                    <div
                        key={index}
                        className={
                            message.role === "user"
                                ? "chat-message user-message"
                                : "chat-message ai-message"
                        }
                    >

                        <strong>
                            {message.role === "user"
                                ? "You"
                                : "AI"}
                        </strong>

                        <p>
                            {message.text}
                        </p>

                    </div>

                ))}


                {loading && (

                    <div className="chat-message ai-message">

                        <strong>AI</strong>

                        <p>
                            Thinking...
                        </p>

                    </div>

                )}

            </div>


            <form
                className="ai-input"
                onSubmit={handleAsk}
            >

                <input
                    type="text"
                    placeholder="Ask something about your finances..."
                    value={question}
                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    Ask
                </button>

            </form>

        </div>
    );
}

export default AIAssistant;