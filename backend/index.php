<?php
$con = mysqli_connect("localhost", "root", "", "blog_app");

if (mysqli_connect_errno()) {
    // If connection fails, display the error
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit;  // Stop further execution if the connection fails
}
?>
