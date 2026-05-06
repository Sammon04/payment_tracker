import { useState, useEffect } from "react";
import AddPayment from "./AddPayment";
import PaymentList from "./PaymentList";
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
            <h1 className={styles.dashboardHeader}>Dashboard</h1>
            <div className={styles.totalsSection}>
                <div className={styles.totalContainer}>
                    <h3 className={styles.totalTitle}>Monthly total:</h3>
                    <p className={styles.totalValue}>${monthlyTotal.toFixed(2)}</p>
                </div>
                <div className={styles.totalContainer}>
                    <h3 className={styles.totalTitle}>Yearly total:</h3>
                    <p className={styles.totalValue}>${yearlyTotal.toFixed(2)}</p>
                </div>
            </div>
            <hr className={styles.dashboardDivider}></hr>
            <AddPayment onPaymentAdded={fetchPayments} />
            <hr className={styles.dashboardDivider}></hr>
            <PaymentList payments={payments} onPaymentDeleted={fetchPayments} onPaymentUpdated={fetchPayments} />
        </div>
    )
}

export default Dashboard;