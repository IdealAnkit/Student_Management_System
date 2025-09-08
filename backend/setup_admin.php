<?php
require_once 'db.php';

// Create default admin user
$username = 'admin';
$password = 'admin123'; // Change this to your desired password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if admin already exists
$checkStmt = $conn->prepare('SELECT id FROM admins WHERE username = ?');
$checkStmt->bind_param('s', $username);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo "Admin user 'admin' already exists.\n<br>";
} else {
    // Insert new admin user
    $insertStmt = $conn->prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
    $insertStmt->bind_param('ss', $username, $hashedPassword);
    
    if ($insertStmt->execute()) {
        echo "Admin user created successfully!\n<br>";
        echo "Username: admin\n<br>";
        echo "Password: admin123\n<br>";
    } else {
        echo "Error creating admin user: " . $conn->error . "\n<br>";
    }
}

// Create another admin with different password
$username2 = 'ankit';
$password2 = 'Ankit07@';
$hashedPassword2 = password_hash($password2, PASSWORD_DEFAULT);

$checkStmt2 = $conn->prepare('SELECT id FROM admins WHERE username = ?');
$checkStmt2->bind_param('s', $username2);
$checkStmt2->execute();
$checkStmt2->store_result();

if ($checkStmt2->num_rows > 0) {
    echo "Admin user 'ankit' already exists.\n<br>";
} else {
    $insertStmt2 = $conn->prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
    $insertStmt2->bind_param('ss', $username2, $hashedPassword2);
    
    if ($insertStmt2->execute()) {
        echo "Admin user 'ankit' created successfully!\n<br>";
        echo "Username: ankit\n<br>";
        echo "Password: Ankit07@\n<br>";
    } else {
        echo "Error creating admin user 'ankit': " . $conn->error . "\n<br>";
    }
}

$conn->close();
?>
