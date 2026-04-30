<?php

include '../config/init.php';

$data = get_json();

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if ($email === null || $password === null) {
    send_response(['error' => 'Missing user data'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_response(['error' => 'Invalid email address'], 400);
}

if (strlen($password) < 8) {
    send_response(['error' => 'Password too short'], 400);
}

$password = password_hash($password, PASSWORD_DEFAULT);

try {

    $sql = "INSERT INTO user (email, password) VALUES 
            (?, ?)";

    $query = $db->prepare($sql);
    $query->bind_param('ss', $email, $password);
    $query->execute();

    send_response(['success' => True]);

} catch (Exception $e) {

    if ($e->getcode() === 1062) {
        send_response(['error' => 'Email already in use'], 409);
    }

    send_response(['error' => 'Database error'], 500);
}