import { useState } from "react";
import styles from './PaymentItem.module.css';

function PaymentItem( { payment, onPaymentDeleted, onPaymentUpdated } ) {
    const [editing, setEditing] = useState(false);
    const [paymentName, setPaymentName] = useState(payment.payment_name);
    const [amount, setAmount] = useState(payment.amount);
    const [renewDate, setRenewDate] = useState(payment.renew_date);
    const [renewType, setRenewType] = useState(payment.renew_type);
    const [frequency, setFrequency] = useState(payment.frequency);

    const handleDelete = async () => {
        const res = await fetch("/api/payments/payments.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_id: payment.payment_id }),
            credentials: "include",
        });

        if (res.ok) {
            onPaymentDeleted();
        } else {
            const err = await res.json();
            console.error("Delete failure:", err);
        }
    };

    const handleCancel = () => {
        setPaymentName(payment.payment_name);
        setAmount(payment.amount);
        setRenewDate(payment.renew_date);
        setRenewType(payment.renew_type);
        setFrequency(payment.frequency);
        setEditing(false);
    };

    const handleSubmit = async () => {
        const res = await fetch("/api/payments/payments.php", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payment_id: payment.payment_id,
                payment_name: paymentName,
                amount,
                renew_date: renewDate,
                renew_type: renewType,
                frequency: renewType === 'fixed' ? frequency : null,
            }),
            credentials: "include",
        });

        if (res.ok) {
            setEditing(false);
            onPaymentUpdated();
        } else {
            const err = await res.json();
            console.error("Update failure:", err);  
        }
    }

    if (editing) {
        return (
            <div className={styles.container}>
                <div className={styles.editItem}>
                    <label htmlFor="editPaymentName">Payment Name:</label>
                    <input
                        className={styles.editInput}
                        id="editPaymentName"
                        type="text"
                        placeholder="Payment Name"
                        value = {paymentName}
                        onChange={e => setPaymentName(e.target.value)}
                    />                    
                </div>
                <div className={styles.editItem}>
                    <label htmlFor="editPaymentAmount">Payment Amount:</label>
                    <input
                        className={styles.editInput}
                        id="editPaymentAmount"
                        type="number"
                        placeholder="Payment Amount"
                        value = {amount}
                        onChange={e => setAmount(e.target.value)}
                    />                    
                </div>
                <div className={styles.editItem}>
                    <label htmlFor="editRenewType">Renewal Type:</label>
                    <select
                        className={styles.editInput}
                        id="editRenewType"
                        value={renewType}
                        onChange={e => setRenewType(e.target.value)}>
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="fixed">Fixed (days)</option>
                    </select>                    
                </div>
                <div className={styles.editItem}>
                    <label htmlFor="editPaymentDate">Start Date:</label>
                    <input
                        className={styles.editInput}
                        id="editPaymentDate"
                        type="date"
                        placeholder="Next Payment Date"
                        value = {renewDate}
                        onChange={e => setRenewDate(e.target.value)}
                    />                        
                </div>
                {renewType === 'fixed' && (
                    <div className={styles.editItem}>
                        <label htmlFor="editPaymentFrequency">Frequency:</label>
                        <input
                            className={styles.editInput}
                            id="editPaymentFrequency"
                            type="number"
                            placeholder="Payment Frequency"
                            value = {frequency}
                            onChange={e => setFrequency(e.target.value)}
                        />                        
                    </div>

                )}
                <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={handleSubmit}>Save</button>
                    <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>                    
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.name}>{payment.payment_name}</h3>
            <div className={styles.detail}>
                <p className={styles.detailLabel}>Amount</p>
                <p className={styles.detailValue}>${payment.amount}</p>
            </div>
            <div className={styles.detail}>
                <p className={styles.detailLabel}>Due Date</p>
                <p className={styles.detailValue}>{payment.renew_date}</p>
            </div>
            
            <div className={styles.detail}>
                <p className={styles.detailLabel}>Renewed</p>
                {payment.renew_type !== 'fixed' && (
                    <p className={styles.detailValue}>{payment.renew_type}</p>
                )}
                {payment.renew_type === 'fixed' && (
                    <p className={styles.detailValue}>Every {payment.frequency} days</p>
                )}
            </div>
            <div className={styles.detail}>
                <p className={styles.detailLabel}>Total Paid</p>
                <p className={styles.detailValue}>${payment.total_paid}</p>
            </div>
            
            <div className={styles.actions}>
                <button className={styles.editButton} onClick={() => setEditing(true)}>Edit</button>
                <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default PaymentItem;