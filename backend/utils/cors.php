<?php
// backend/utils/cors.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    // Allow localhost or LAN IP on any port
    if (
        preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin) ||
        preg_match('/^http:\/\/192\.168\.169\.182(:[0-9]+)?$/', $origin) ||
        preg_match('/^http:\/\/10\.70\.18\.182(:[0-9]+)?$/', $origin)
    ) {
        header("Access-Control-Allow-Origin: $origin");
    }
    // Do NOT set Access-Control-Allow-Origin: * if credentials are used
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");
header("X-Debug-CORS: included");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?> 