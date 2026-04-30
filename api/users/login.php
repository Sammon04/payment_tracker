<?php

include '../config/init.php';



$data = get_json();

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if ($email === null || $password === null) {
    send_response(['error' => 'Missing login data'], 400);
}

try {

    $sql = "SELECT user_id, email, password 
            FROM user 
            WHERE email = ?";
    
    $query = $db->prepare($sql);
    $query->bind_param('s', $email);
    $query->execute();
    $result = $query->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        send_response(['error' => 'Invalid credentials'], 404);
    }

    if (!password_verify($password, $user['password'])) {
        send_response(['error' => 'Invalid credentials'], 404);
    }

    session_start();
    
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['user_id'];
    send_response(['success' => True]);


} catch (Exception $e) {
    send_response(['error' => 'Database error'], 500);
}