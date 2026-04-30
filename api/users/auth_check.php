<?php

include '../config/init.php';

session_start();

isset($_SESSION['user_id']) ? send_response(['ok' => true]) : send_response(['error' => 'Unauthorized'], 401);
