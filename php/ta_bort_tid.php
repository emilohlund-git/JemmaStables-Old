<?php
include("db_connection.php");
$dag = $_POST['dag'];
$tid = $_POST['tid'];
$sql = 'DELETE FROM Tider WHERE tid='.$tid.' AND dag='.$dag;

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}

echo $id;
mysqli_close($conn);
?>