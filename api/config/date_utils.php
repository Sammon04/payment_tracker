<?php

function calculateNextDate($date, $renew_type, $frequency) {
    $d = new DateTime($date);

    switch ($renew_type) {
        case 'yearly':
            $d->modify('+1 year');
            break;
        case 'monthly':
            $d->modify('+1 month');
            break;
        case 'fixed':
            $d->modify('+' . $frequency . ' days');
            break;
    }

    return $d->format('Y-m-d');
}

function calculateFromStartDate($start_date, $renew_type, $frequency, $amount) {
    $today = date('Y-m-d');
    $next_date = $start_date;
    $total_paid = 0;

    while ($next_date <= $today) {
        $next_date = calculateNextDate($next_date, $renew_type, $frequency);
        $total_paid += $amount;
    }

    return [
        'renew_date' => $next_date,
        'total_paid' => $total_paid,
    ];
}