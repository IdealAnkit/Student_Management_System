<?php
// backend/db.php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'student_management';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}
?> 