<?php

$password = "sammon";

$password = password_hash($password, PASSWORD_DEFAULT);

print($password);