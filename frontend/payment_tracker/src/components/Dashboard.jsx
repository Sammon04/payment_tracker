import { useState, useEffect } from "react";
import AddPayment from "./AddPayment";
import PaymentList from "./PaymentList";
import Logout from "./Logout";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const [payments, setPayments] = useState([]);

    const fetchPayments = () => {
        fetch("/api/payments/payments.php", { credentials: "include" })
            .then(res => res.json())
            .then(data => setPayments(data));
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const monthlyTotal = payments.reduce((total, payment) => {
        const amount = parseFloat(payment.amount);
        const frequency = parseFloat(payment.frequency);
        if (payment.renew_type === 'yearly') return total + (amount / 12);
        if (payment.renew_type === 'monthly') return total + amount;
        if (payment.renew_type === 'fixed') return total + (amount * (365 / frequency) / 12);
        return total;
    }, 0);

    const yearlyTotal = payments.reduce((total, payment) => {
        const amount = parseFloat(payment.amount);
        const frequency = parseFloat(payment.frequency);
        if (payment.renew_type === 'yearly') return total + (amount);
        if (payment.renew_type === 'monthly') return total + (amount * 12);
        if (payment.renew_type === 'fixed') return total + (amount * (365 / frequency));
        return total;
    }, 0);

    return (
        <div>
            <h1 className={styles.dashboard_header}>Dashboard</h1>
            <Logout />
            <div className={styles.totals_section}>
                <div className={styles.total_container}>
                    <h3 className={styles.total_title}>Monthly total:</h3>
                    <p className={styles.total_value}>${monthlyTotal.toFixed(2)}</p>
                </div>
                <div className={styles.total_container}>
                    <h3 className={styles.total_title}>Yearly total:</h3>
                    <p className={styles.total_value}>${yearlyTotal.toFixed(2)}</p>
                </div>
            </div>
            <hr className={styles.dashboard_divider}></hr>
            <AddPayment onPaymentAdded={fetchPayments} />
            <hr className={styles.dashboard_divider}></hr>
            <PaymentList payments={payments} onPaymentDeleted={fetchPayments} onPaymentUpdated={fetchPayments} />
        </div>
    )
}

export default Dashboard;