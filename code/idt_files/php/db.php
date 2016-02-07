<?php
define('DB_HOST', 'localhost');//Change this to the actual database server address
define('DB_NAME', 'scholar_log');
define('DB_USER', 'root');//Change this to the actual database user name
define('DB_PASS', '');//Change this to the actual database password
$db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
function get_rows_as_arr($sql) {
	global $db;
	$stmt = $db -> query($sql);
	return $stmt -> fetchAll(PDO::FETCH_ASSOC);
}
?>
