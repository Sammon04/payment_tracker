import PaymentItem from "./PaymentItem";

function PaymentList( {payments, onPaymentDeleted, onPaymentUpdated }) {

    if (payments.length === 0) return <p>No payments yet.</p>;

    return (
        <div>
            {payments.map(payment => (
                <PaymentItem key={payment.payment_id} payment={payment} onPaymentDeleted={onPaymentDeleted} onPaymentUpdated={onPaymentUpdated}/>
            ))}
        </div>
    )
}

export default PaymentList;