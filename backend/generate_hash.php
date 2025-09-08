<?php
// Generate password hashes for admin users
echo "Hash for 'admin' with password 'admin123': " . password_hash('admin123', PASSWORD_DEFAULT) . "\n<br>";
echo "Hash for 'admin' with password 'Ankit07@': " . password_hash('Ankit07@', PASSWORD_DEFAULT) . "\n<br>";
echo "Hash for 'admin' with password 'password': " . password_hash('password', PASSWORD_DEFAULT) . "\n<br>";
?>
