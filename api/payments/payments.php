<?php

session_start();

include '../config/init.php';
include '../config/date_utils.php';

function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::createFromFormat($format, $date);

    return $d && $d->format($format) === $date;
}

if (!isset($_SESSION['user_id'])) {
    send_response(['error' => 'Not logged in'], 401);
}

$user_id = $_SESSION['user_id'];

switch ($_SERVER['REQUEST_METHOD']){
    case 'GET':
        try {

            $payments = [];

            $sql = "SELECT payment_id, payment_name, amount, renew_date, renew_type, frequency, total_paid 
            FROM payment 
            WHERE owner_id = ?";

            $query = $db->prepare($sql);
            $query->bind_param('i', $user_id);
            $query->execute();
            $result = $query->get_result();

            while ($payment = $result->fetch_assoc()) {
                $payments[] = $payment;
            }

            send_response($payments);

        } catch (Exception $e) {
            send_response(['error' => 'Database error'], 500);
        }
        break;
    
    case 'POST':

        $data = get_json();

        $payment_name = $data['payment_name'] ?? null;
        $amount = $data['amount'] ?? null;
        $renew_date = $data['renew_date'] ?? null;
        $renew_type = $data['renew_type'] ?? null;
        $frequency = $data['frequency'] ?? null;

        if ($payment_name === null || $amount === null || $renew_date === null) {
            send_response(['error' => 'Missing payment information'], 400);
        }

        if ($payment_name === "" || $amount === "" || $renew_date === "") {
            send_response(['error' => 'Missing payment information'], 400);
        }

        $valid_types = ['yearly', 'monthly', 'fixed'];
        if (!in_array($renew_type, $valid_types)) {
            send_response(['error' => 'Invalid renewal type'], 400);
        }

        if ($renew_type === 'fixed' && ($frequency === null || $frequency <= 0)) {
            send_response(['error' => 'Fixed payments require a valid frequency'], 400);
        }

        if ($renew_type !== 'fixed') {
            $frequency = null;
        }

        if (!validateDate($renew_date)) {
            send_response(['error' => 'Invalid payment date format'], 400);
        }

        try {
            $calculated_info = catchUpDate($renew_date, $renew_type, $frequency, $amount);
            $renew_date = $calculated_info['renew_date'];
            $total_paid = $calculated_info['total_paid'];            
        } catch (Exception $e) {
            send_response(['error' => 'Date calculation error'], 500);
        }

        try {

            $sql = "INSERT INTO payment (owner_id, payment_name, amount, renew_date, renew_type, frequency, total_paid) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $query = $db->prepare($sql);
            $query->bind_param('isdssid', $user_id, $payment_name, $amount, $renew_date, $renew_type, $frequency, $total_paid);
            $query->execute();

            send_response(['success' => True]);
            
        } catch (Exception $e) {
            send_response(['error' => 'Database error'], 500);
        }
        break;
    
    case 'PUT':

        $data = get_json();

        $payment_id = $data['payment_id'] ?? null;
        $payment_name = $data['payment_name'] ?? null;
        $amount = $data['amount'] ?? null;
        $renew_date = $data['renew_date'] ?? null;
        $renew_type = $data['renew_type'] ?? null;
        $frequency = $data['frequency'] ?? null;

        if ($payment_id === null || $payment_name === null || $amount === null || $renew_date === null) {
            send_response(['error' => 'Missing payment info'], 400);
        }

        if ($payment_id === "" || $payment_name === "" || $amount === "" || $renew_date === "") {
            send_response(['error' => 'Missing payment info'], 400);
        }

        $valid_types = ['yearly', 'monthly', 'fixed'];
        if (!in_array($renew_type, $valid_types)) {
            send_response(['error' => 'Invalid renewal type'], 400);
        }

        if ($renew_type === 'fixed' && ($frequency === null || $frequency <= 0)) {
            send_response(['error' => 'Fixed payments require a valid frequency'], 400);
        }

        if ($renew_type !== 'fixed') {
            $frequency = null;
        }

        if (!validateDate($renew_date)) {
            send_response(['error' => 'Invalid date'], 400);
        }

        try {
            $calculated_info = catchUpDate($renew_date, $renew_type, $frequency, $amount);
            $renew_date = $calculated_info['renew_date'];
            $total_paid = $calculated_info['total_paid'];            
        } catch (Exception $e) {
            send_response(['error' => 'Date calculation error'], 500);
        }

        try {

            $sql = "UPDATE payment 
                    SET payment_name = ?, amount = ?, renew_date = ?, renew_type = ?, frequency = ?, total_paid = ?
                    WHERE payment_id = ? AND owner_id = ?";
            
            $query = $db->prepare($sql);
            $query->bind_param('sdssidii', $payment_name, $amount, $renew_date, $renew_type, $frequency, $total_paid, $payment_id, $user_id);
            $query->execute();

            send_response(['success' => true]);
        } catch (Exception $e) {
            send_response(['error' => 'Database error'], 500);
        }
        break;

    case 'DELETE':

        $data = get_json();

        $payment_id = $data['payment_id'] ?? null;

        if ($payment_id === null) {
            send_response(['error' => 'Missing payment id'], 400);
        }

        try {
            $sql = "DELETE FROM payment
                    WHERE payment_id = ? AND owner_id = ?";
            
            $query = $db->prepare($sql);
            $query->bind_param('ii', $payment_id, $user_id);
            $query->execute();

            if ($query->affected_rows === 0) {
                send_response(['error' => 'Payment not found'], 404);
            }

            send_response(['success' => True]);
        
        } catch (Exception $e) {
            send_response(['error' => 'Database error'], 500);
        }
        break;
}