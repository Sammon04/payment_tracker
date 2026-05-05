<?php

include '../config/init.php';
include '../config/date_utils.php';

$today = date('Y-m-d');

try {

    $sql = "SELECT payment_id, amount, renew_date, renew_type, frequency, total_paid 
            FROM payment 
            WHERE renew_date <= ?";
    
    $query = $db->prepare($sql);
    $query->bind_param('s', $today);
    $query->execute();
    $result = $query->get_result();

    while ($payment = $result->fetch_assoc()) {

        try {
            $new_date_total = catchUpDate($payment['renew_date'], $payment['renew_type'], $payment['frequency'], $payment['amount']);
            $new_renew_date = $new_date_total['renew_date'];
            $new_total_paid = $new_date_total['total_paid'];        
        } catch (Exception $e) {
            send_response(['error' => 'Date calculation error'], 500);
        }

        $updateSql = "UPDATE payment 
                    SET renew_date = ?, total_paid = ? 
                    WHERE payment_id = ?";
        
        $update = $db->prepare($updateSql);
        $update->bind_param('sdi', $new_renew_date, $new_total_paid, $payment['payment_id']);
        $update->execute();
    }
} catch (Exception $e) {
    echo $e;
}

echo "Done. " . $result->num_rows . " payment(s) updated.";