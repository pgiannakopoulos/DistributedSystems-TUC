<?php
// Initialize the session
if (!isset($_SESSION)) {
    session_start();
}
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: index.php");
    exit;
}

require_once 'config.php';
require 'vendor/autoload.php';
$config = \Kafka\ProducerConfig::getInstance();
$config->setMetadataRefreshIntervalMs(10000);
$config->setMetadataBrokerList('kafka:9092');
$config->setBrokerVersion('1.0.0');
$config->setRequiredAck(1);
$config->setIsAsyn(false);
$config->setProduceInterval(500);


$_SESSION["gm"] = $_SESSION["pm"] = '';

if (isset($_GET['game'])) {
    if (isset($_GET['roundID'])) {
        $play = array(
            'token' => $_SESSION['username'], 
            'game' => $_GET['game'], 
            'tournament' => $_GET['tournament'] == 'null'? null:$_GET['tournament'] , 
            "spectator" => true,
            "roundID" => $_GET['roundID']
        );
    }else{
        $play = array(
            'token' => $_SESSION['username'], 
            'game' => $_GET['game'], 
            'tournament' => $_GET['tournament'] == 'null'? null:$_GET['tournament'] , 
            "spectator" => false,
        );
    }

    if ($_GET['tournament'] != 'null') {
        $_SESSION['tournament'] = true;
        $_SESSION['totalRounds'] = log($_GET['rounds'],2);
        $_SESSION['curRound'] = 1;
    }else{
        $_SESSION['tournament'] = false;
    }

    $producer = new \Kafka\Producer(
        function() {
            return [
                [
                    'topic' => 'input',
                    'value' => json_encode($GLOBALS['play'])
                ],
            ];
        }
    );

    // $producer->success(function($result) {
    //     header("location: loading.php");
    // });
    $producer->error(function($errorCode) {
        header("location: portal.php");
    });
    $producer->send(true);

}else if(isset($_GET['redirect'])){
    if (!$_GET['replay']) {
        $_SESSION['curRound'] += 1;
    }
}else{
    header("location: portal.php");
}

?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Game Dashboard</title>
        <?php include 'includes.php'; ?>
        <script src="js/pace.js"></script>
        <link href="css/pace.css" rel="stylesheet" />
    </head>
    <body>
        <?php include 'menu.php'; ?>
        <div id="content" class="bg">
        </div>
        <?php include 'footer.php'; ?> 
    </body>
    <script type="text/javascript">
        window.value=0;
        $('#myid').html(session_id());
        $.ajax({
            url: 'checkGameLoad.php?id='+session_id(),
            success: function(data) {
                window.value=1;  
                window.location.replace("gameBoard.php");   
            }
        })
        
    </script>

</html>

