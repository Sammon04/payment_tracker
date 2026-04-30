import { useState } from "react";

function AddPayment( { onPaymentAdded }) {
    const [paymentName, setPaymentName] = useState("");
    const [amount, setAmount] = useState("");
    const [renewDate, setRenewDate] = useState("");
    const [renewType, setRenewType] = useState("yearly");
    const [frequency, setFrequency] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/payments/payments.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                payment_name: paymentName, 
                amount, 
                renew_date: renewDate, 
                renew_type: renewType, 
                frequency: renewType === 'fixed' ? frequency : null,
            }),
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Request failed:", res.status);
            return;
        }

        const data = await res.json();
        console.log(data);

        onPaymentAdded();

        setPaymentName("");
        setAmount("");
        setRenewDate("");
        setRenewType("yearly");
        setFrequency("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Payment</h2>
            <input
                type="text"
                placeholder="Payment Name"
                value={paymentName}
                onChange={(e) => setPaymentName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Payment Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="date"
                placeholder="Next Payment Date"
                value={renewDate}
                onChange={(e) => setRenewDate(e.target.value)}
            />
            <select value={renewType} onChange={e => setRenewType(e.target.value)}>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed (days)</option>
            </select>
            {renewType === 'fixed' && (
                <input
                    type="number"
                    placeholder="Payment Frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                />
            )}


            <button type="submit">Add Payment</button>
        </form>
    );
}

export default AddPayment;