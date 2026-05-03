import { useState } from "react";
import styles from "./AddPayment.module.css";

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
        <div className={styles.container}>
            <h2 className={styles.payment_form_header}>Add Payment</h2>
            <form className={styles.payment_form} onSubmit={handleSubmit}>
                <div className={styles.form_item}>
                    <label for="paymentName">Payment Name:</label>
                    <input
                        className={styles.form_input}
                        id="paymentName"
                        type="text"
                        placeholder="Payment Name"
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                    />
                </div>
                <div className={styles.form_item}>
                    <label for="paymentAmount">Payment Amount:</label>
                    <input
                        className={styles.form_input}
                        id="paymentAmount"
                        type="number"
                        placeholder="Payment Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />                    
                </div>
                <div className={styles.form_item}>
                    <label for="renewType">Renewal Type:</label>
                    <select 
                        className={styles.form_input}
                        id="renewType"
                        value={renewType} 
                        onChange={e => setRenewType(e.target.value)}>
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="fixed">Fixed (days)</option>
                    </select>                     
                </div>
                <div className={styles.form_item}>
                    <label for="paymentDate">Payment Date:</label>              
                    <input
                        className={styles.form_input}
                        id="paymentDate"
                        type="date"
                        placeholder="Next Payment Date"
                        value={renewDate}
                        onChange={(e) => setRenewDate(e.target.value)}
                    />                    
                </div>
                {renewType === 'fixed' && (
                    <div className={styles.form_item}>
                        <label for="paymentFrequency">Payment Frequency:</label>
                        <input
                            className={styles.form_input}
                            id="paymentFrequency"
                            type="number"
                            placeholder="Payment Frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                        />
                    </div>

                )}
                <button 
                    className={styles.submit_button}
                    type="submit">Add Payment</button>
            </form>
        </div>     
    );
}

export default AddPayment;