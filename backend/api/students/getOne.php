<?php
require_once '../../utils/cors.php';
require_once '../../db.php';
$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(['error' => 'ID required']);
    exit;
}
$stmt = $conn->prepare('SELECT * FROM students WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode($result->fetch_assoc());
?> 