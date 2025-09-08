<?php
require_once '../utils/cors.php';
session_start();
session_destroy();
echo json_encode(['success' => true]);
?> 