<?php
require_once '../utils/cors.php';
require_once '../db.php';
session_start();
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'Username and password required.']);
    exit;
}
$stmt = $conn->prepare('SELECT id, password FROM admins WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 1) {
    $stmt->bind_result($id, $hash);
    $stmt->fetch();
    if (password_verify($password, $hash)) {
        $_SESSION['admin_id'] = $id;
        echo json_encode(['success' => true]);
        exit;
    }
}
echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
?> 