<?php
require_once '../../utils/cors.php';
require_once '../../db.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $student_id = $_GET['student_id'] ?? null;
    if (!$student_id) {
        echo json_encode(['error' => 'student_id required']);
        exit;
    }
    $stmt = $conn->prepare('SELECT subject, marks FROM marks WHERE student_id = ?');
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $marks = [];
    while ($row = $result->fetch_assoc()) {
        $marks[] = $row;
    }
    echo json_encode($marks);
    exit;
}
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $student_id = $data['student_id'] ?? null;
    $subject = $data['subject'] ?? '';
    $marks = $data['marks'] ?? null;
    if (!$student_id || !$subject || $marks === null) {
        echo json_encode(['success' => false, 'message' => 'All fields required.']);
        exit;
    }
    $stmt = $conn->prepare('INSERT INTO marks (student_id, subject, marks) VALUES (?, ?, ?)');
    $stmt->bind_param('isi', $student_id, $subject, $marks);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
    exit;
}
echo json_encode(['error' => 'Invalid request']);
?> 