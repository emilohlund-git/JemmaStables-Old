<?php
include("db_connection.php");
$myArray = array();
if ($result = $conn->query("SELECT * FROM Tider")) {

    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}

$result->close();
mysqli_close($conn);
?>
