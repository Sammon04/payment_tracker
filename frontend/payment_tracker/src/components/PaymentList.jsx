import PaymentItem from "./PaymentItem";

function PaymentList( {payments, onPaymentDeleted, onPaymentUpdated }) {

    if (payments.length === 0) return <p>No payments yet.</p>;

    const sorted = [...payments].sort((a, b) => {
        if (a.renew_date === b.renew_date) return a.payment_id - b.payment_id;
        return a.renew_date < b.renew_date ? -1 : 1;
    })

    return (
        <div>
            {sorted.map(payment => (
                <PaymentItem key={payment.payment_id} payment={payment} onPaymentDeleted={onPaymentDeleted} onPaymentUpdated={onPaymentUpdated}/>
            ))}
        </div>
    )
}

export default PaymentList;