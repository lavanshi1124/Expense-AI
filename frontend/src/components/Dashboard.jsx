import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Dashboard({ transactions }) {
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expenses;

    const categoryData = {};

    transactions
        .filter((t) => t.type === "expense")
        .forEach((transaction) => {
            if (!categoryData[transaction.category]) {
                categoryData[transaction.category] = 0;
            }

            categoryData[transaction.category] += Number(
                transaction.amount
            );
        });

    const chartData = Object.entries(categoryData).map(
        ([name, value]) => ({
            name,
            value
        })
    );

    return (
        <>
            <div className="summary">
                <div className="summary-card">
                    <p>Total Balance</p>
                    <h2>₹{balance.toLocaleString()}</h2>
                </div>

                <div className="summary-card">
                    <p>Total Income</p>
                    <h2>
                        ₹{income.toLocaleString()}
                    </h2>
                </div>

                <div className="summary-card">
                    <p>Total Expenses</p>
                    <h2>
                        ₹{expenses.toLocaleString()}
                    </h2>
                </div>
            </div>

            {chartData.length > 0 && (
                <div className="chart-card">
                    <h2>Expenses by Category</h2>

                    <div className="chart">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {chartData.map(
                                        (_, index) => (
                                            <Cell
                                                key={index}
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;