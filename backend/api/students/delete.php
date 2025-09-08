<?php
require_once '../../utils/cors.php';
require_once '../../db.php';
$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID required.']);
    exit;
}
$stmt = $conn->prepare('DELETE FROM students WHERE id = ?');
$stmt->bind_param('i', $id);
$success = $stmt->execute();
echo json_encode(['success' => $success]);
?> 