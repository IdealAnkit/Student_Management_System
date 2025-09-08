<?php
require_once '../../utils/cors.php';
require_once '../../db.php';
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$roll_no = $data['roll_no'] ?? '';
$course = $data['course'] ?? '';
$class = $data['class'] ?? '';
if (!$name || !$email || !$roll_no || !$course || !$class) {
    echo json_encode(['success' => false, 'message' => 'All fields required.']);
    exit;
}
$stmt = $conn->prepare('INSERT INTO students (name, email, roll_no, course, class) VALUES (?, ?, ?, ?, ?)');
$stmt->bind_param('sssss', $name, $email, $roll_no, $course, $class);
$success = $stmt->execute();
echo json_encode(['success' => $success, 'id' => $conn->insert_id]);
?> 