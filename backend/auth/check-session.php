<?php
require_once '../utils/cors.php';
session_start();
echo json_encode(['loggedIn' => isset($_SESSION['admin_id'])]);
?> 