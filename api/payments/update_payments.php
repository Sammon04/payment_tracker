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

        $next_date = calculateNextDate($payment['renew_date'], $payment['renew_type'], $payment['frequency']);
        $new_total = $payment['total_paid'] + $payment['amount'];

        while ($next_date <= $today) {
            $next_date = calculateNextDate($next_date, $payment['renew_type'], $payment['frequency']);
            $new_total += $payment['amount'];
        }

        $updateSql = "UPDATE payment 
                    SET renew_date = ?, total_paid = ? 
                    WHERE payment_id = ?";
        
        $update = $db->prepare($updateSql);
        $update->bind_param('sdi', $next_date, $new_total, $payment['payment_id']);
        $update->execute();
    }
} catch (Exception $e) {
    echo $e;
}

echo "Done. " . $result->num_rows . " payment(s) updated.";

function calculateNextDate($payment_date, $renew_type, $frequency) {
    $date = new DateTime($payment_date);

    switch ($renew_type) {
        case 'yearly':
            $date->modify('+1 year');
            break;
        case 'monthly':
            $date->modify('+1 month');
            break;
        case 'fixed':
            $date->modify('+' . $frequency . ' days');
            break;
    }

    return $date->format('Y-m-d');
}