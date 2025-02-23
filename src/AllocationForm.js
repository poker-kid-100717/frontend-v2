import React, { useState } from "react";
import axios from "axios";

const AllocationForm = () => {
    const [investors, setInvestors] = useState([{ investor_id: "1", requested_amount: "", average_investment: "" }]);
    const [totalAllocation, setTotalAllocation] = useState(10000);
    const [results, setResults] = useState(null);

    const handleChange = (index, field, value) => {
        const updatedInvestors = [...investors];
        updatedInvestors[index][field] = value;
        setInvestors(updatedInvestors);
    };

    const addInvestor = () => {
        setInvestors([...investors, { investor_id: `${investors.length + 1}`, requested_amount: "", average_investment: "" }]);
    };

    const submitAllocation = async () => {
        const payload = investors.map(inv => ({
            investor_id: inv.investor_id,
            requested_amount: parseFloat(inv.requested_amount),
            average_investment: parseFloat(inv.average_investment)
        }));

        try {
            const response = await axios.post("http://localhost:8000/allocate", { investors: payload, total_allocation: totalAllocation });
            setResults(response.data);
        } catch (error) {
            console.error("Error allocating funds", error);
        }
    };

    return (
        <div>
            <h2>Investment Allocation</h2>
            <input type="number" value={totalAllocation} onChange={(e) => setTotalAllocation(e.target.value)} />
            {investors.map((inv, index) => (
                <div key={index}>
                    <input type="text" placeholder="Requested Amount" value={inv.requested_amount} onChange={(e) => handleChange(index, "requested_amount", e.target.value)} />
                    <input type="text" placeholder="Average Investment" value={inv.average_investment} onChange={(e) => handleChange(index, "average_investment", e.target.value)} />
                </div>
            ))}
            <button onClick={addInvestor}>Add Investor</button>
            <button onClick={submitAllocation}>Submit</button>

            {results && (
                <div>
                    <h3>Allocation Results</h3>
                    <ul>{results.map((res, i) => (<li key={i}>Investor {res.investor_id}: {res.allocated_amount.toFixed(2)}</li>))}</ul>
                </div>
            )}
        </div>
    );
};

export default AllocationForm;
