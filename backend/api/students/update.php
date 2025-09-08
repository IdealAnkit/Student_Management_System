<?php
require_once '../../utils/cors.php';
require_once '../../db.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$roll_no = $data['roll_no'] ?? '';
$course = $data['course'] ?? '';
$class = $data['class'] ?? '';
if (!$id || !$name || !$email || !$roll_no || !$course || !$class) {
    echo json_encode(['success' => false, 'message' => 'All fields required.']);
    exit;
}
$stmt = $conn->prepare('UPDATE students SET name=?, email=?, roll_no=?, course=?, class=? WHERE id=?');
$stmt->bind_param('sssssi', $name, $email, $roll_no, $course, $class, $id);
$success = $stmt->execute();
echo json_encode(['success' => $success]);
?> 