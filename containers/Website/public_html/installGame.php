<?php
// Initialize the session
if (!isset($_SESSION)) {
    session_start();
    $_SESSION["token"] = rand(0, 10005);
}


// Check if the user is logged in, if not then redirect him to login page
// if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
//     header("location: index.php");
//     exit;
// }

require_once 'config.php';
require_once 'functions.php';
//read the loaded games


 ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Game Dashboard</title>
    <?php include 'includes.php'; ?>
</head>
<body>
    <?php include 'menu.php'; ?>
    <div id="content" class="bg">
        <div class="container">
            
        </div>
    </div>
    <?php include 'footer.php'; ?> 
</body>
</html>