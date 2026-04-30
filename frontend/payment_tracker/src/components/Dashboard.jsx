import { useState, useEffect } from "react";
import AddPayment from "./AddPayment";
import PaymentList from "./PaymentList";
import Logout from "./Logout";

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
            <h1>Dashboard</h1>
            <Logout />
            <p>Monthly total: ${monthlyTotal.toFixed(2)}</p>
            <p>Yearly total: ${yearlyTotal.toFixed(2)}</p>
            <AddPayment onPaymentAdded={fetchPayments} />
            <PaymentList payments={payments} onPaymentDeleted={fetchPayments} onPaymentUpdated={fetchPayments} />
        </div>
    )
}

export default Dashboard;