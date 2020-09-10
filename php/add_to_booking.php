<?php
include("db_connection.php");
$namn = $_POST['userName'];
$email = $_POST['userEmail'];
$tid = $_POST['content'];
$dag = $_POST['day'];
// sql to create table
$sql = "INSERT INTO Bokningar (namn, email, tid, dag) VALUES ('$namn', '$email', '$tid', '$dag')";

if (mysqli_query($conn, $sql)) {
  echo "";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

mysqli_close($conn);
?>