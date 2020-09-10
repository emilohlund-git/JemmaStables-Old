<?php
// CREATE CONNECTION
$dbhost = 'jemmastables.com.mysql';
$dbuser = 'jemmastables_combokningssystem';
$dbpass = 'Jemma2019';
$db = 'jemmastables_combokningssystem';
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db);

if (!$conn) {
   die('Could not connect');
}
?>
